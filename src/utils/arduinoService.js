import { io } from 'socket.io-client';

class ArduinoService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.distanceCallbacks = [];
        this.statusCallbacks = [];
        this.backendUrl = 'http://localhost:3001';
    }

    // Connect to backend
    connect() {
        console.log('ArduinoService.connect() called');

        if (this.socket && this.isConnected) {
            console.log('Already connected to backend');
            return Promise.resolve();
        }

        // 清理旧连接
        if (this.socket) {
            console.log('Cleaning up old socket connection');
            this.socket.disconnect();
            this.socket = null;
        }

        return new Promise((resolve, reject) => {
            console.log('Creating new connection to backend...');
            this.socket = io(this.backendUrl, {
                transports: ['websocket', 'polling'],
                timeout: 5000,
                forceNew: true
            });

            // 设置事件监听器
            this.socket.on('connect', () => {
                console.log('✅ Connected to backend WebSocket');
                this.isConnected = true;
                // 请求Arduino状态 - 不要立即通知Arduino连接状态
                console.log('📡 Requesting Arduino status...');
                this.socket.emit('requestArduinoStatus');
                resolve();
            });

            this.socket.on('disconnect', () => {
                console.log('❌ Disconnected from backend');
                this.isConnected = false;
                this.notifyStatusCallbacks(false);
            });

            this.socket.on('arduinoStatus', (data) => {
                console.log('🤖 Arduino status received:', data);
                console.log('📢 Notifying status callbacks with:', data.connected);
                // 这是真正的Arduino连接状态
                this.notifyStatusCallbacks(data.connected);
            });

            this.socket.on('distance', (data) => {
                console.log('📏 Distance received:', data.distance);
                this.notifyDistanceCallbacks(data.distance);
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ Connection error:', error);
                this.isConnected = false;
                this.notifyStatusCallbacks(false);
                reject(error);
            });

        });
    }

    // Disconnect from backend (disabled - keeping connection alive)
    disconnect() {
        console.log('Disconnect called but ignored - keeping Arduino connection alive');
        // 不实际断开连接，保持连接状态
    }

    // Reconnect to backend (only if not connected)
    reconnect() {
        if (!this.isConnected) {
            console.log('Reconnecting to backend...');
            return this.connect();
        } else {
            console.log('Already connected, no need to reconnect');
            return Promise.resolve();
        }
    }

    // Force sync connection status
    syncConnectionStatus() {
        if (this.socket && this.socket.connected) {
            console.log('Forcing connection status sync...');
            this.isConnected = true;
            console.log('Emitting requestArduinoStatus...');
            this.socket.emit('requestArduinoStatus');
        } else {
            console.log('Cannot sync - socket not connected');
        }
    }

    // Set electromagnet strength (1-5, or 0 to turn off)
    setMagnetStrength(level) {
        if (!this.socket || !this.isConnected) {
            console.warn('Not connected to backend');
            return;
        }

        if (level < 0 || level > 5) {
            console.error('Invalid magnet strength level:', level);
            return;
        }

        this.socket.emit('setMagnetStrength', { level });
    }

    // Request distance data
    requestDistance() {
        if (!this.socket || !this.isConnected) {
            console.warn('Not connected to backend');
            return;
        }

        this.socket.emit('requestDistance');
    }

    // Subscribe to distance updates
    onDistance(callback) {
        this.distanceCallbacks.push(callback);
        return () => {
            const index = this.distanceCallbacks.indexOf(callback);
            if (index > -1) {
                this.distanceCallbacks.splice(index, 1);
            }
        };
    }

    // Subscribe to connection status updates
    onStatus(callback) {
        this.statusCallbacks.push(callback);
        return () => {
            const index = this.statusCallbacks.indexOf(callback);
            if (index > -1) {
                this.statusCallbacks.splice(index, 1);
            }
        };
    }

    // Notify distance callbacks
    notifyDistanceCallbacks(distance) {
        this.distanceCallbacks.forEach(callback => {
            try {
                callback(distance);
            } catch (error) {
                console.error('Error in distance callback:', error);
            }
        });
    }

    // Notify status callbacks
    notifyStatusCallbacks(connected) {
        this.statusCallbacks.forEach(callback => {
            try {
                callback(connected);
            } catch (error) {
                console.error('Error in status callback:', error);
            }
        });
    }

    // Get current connection status
    getConnectionStatus() {
        const status = this.socket && this.isConnected;
        console.log('Connection status check:', {
            socket: !!this.socket,
            isConnected: this.isConnected,
            socketConnected: this.socket?.connected,
            finalStatus: status
        });

        // 如果socket存在但状态不一致，尝试同步
        if (this.socket && this.socket.connected && !this.isConnected) {
            console.log('Syncing connection status...');
            this.isConnected = true;
            this.notifyStatusCallbacks(true);
        }

        return this.socket && this.isConnected;
    }

    // Map distance to resistance level (for monitoring mode)
    mapDistanceToResistance(distance) {
        // Distance is 0-100%, map to resistance -1 to -5
        // Higher distance = higher resistance (more negative)
        const resistance = -1 - (distance / 100) * 4;
        return Math.round(resistance);
    }

    // Map distance to emoji opacity (for emoji mode)
    mapDistanceToOpacity(distance) {
        // Distance is 0-100%, map to opacity 0.3-1.0
        return 0.3 + ((100 - distance) / 100) * 0.7;
    }
}

// Create singleton instance
const arduinoService = new ArduinoService();

export default arduinoService;
