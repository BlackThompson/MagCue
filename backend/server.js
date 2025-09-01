import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite dev server
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Arduino communication
let arduinoPort = null;
let parser = null;
let isConnected = false;
let lastDistance = null;
let lastDistanceTime = 0;
const DISTANCE_THROTTLE_MS = 500; // 最多每500ms发送一次距离数据

// Connect to Arduino
function connectToArduino() {
    SerialPort.list().then(ports => {
        console.log('Available ports:', ports.map(p => ({ path: p.path, manufacturer: p.manufacturer })));

        // Try to find Arduino port (common patterns)
        const arduinoPortInfo = ports.find(port =>
            port.manufacturer && (
                port.manufacturer.includes('Arduino') ||
                port.manufacturer.includes('CH340') ||
                port.manufacturer.includes('FTDI')
            )
        );

        if (arduinoPortInfo) {
            console.log('Found Arduino on port:', arduinoPortInfo.path);
            arduinoPort = new SerialPort({
                path: arduinoPortInfo.path,
                baudRate: 9600,
                autoOpen: false
            });

            parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

            arduinoPort.open((err) => {
                if (err) {
                    console.error('Error opening port:', err.message);
                    return;
                }

                isConnected = true;
                console.log('Connected to Arduino');

                // Listen for data from Arduino
                parser.on('data', (data) => {
                    // 只记录距离数据，忽略其他消息
                    if (data.includes('Distance:') && data.includes('Raw:')) {
                        console.log('Arduino distance data:', data);

                        // Parse distance data: "Raw: 358  Distance: 0.00 %"
                        const distanceMatch = data.match(/Distance:\s*([\d.]+)\s*%/);
                        if (distanceMatch) {
                            const distance = parseFloat(distanceMatch[1]);
                            if (!isNaN(distance) && distance >= 0 && distance <= 100) {
                                console.log('Sending distance to clients:', distance);
                                io.emit('distance', { distance });
                            }
                        }
                    } else {
                        // 其他Arduino消息（启动信息等）
                        console.log('Arduino info:', data);
                    }
                });
            });
        } else {
            console.log('Arduino not found. Available ports:', ports.map(p => p.path));
        }
    }).catch(err => {
        console.error('Error listing ports:', err);
    });
}

// Send command to Arduino
function sendToArduino(command) {
    if (arduinoPort && isConnected) {
        arduinoPort.write(command + '\n', (err) => {
            if (err) {
                console.error('Error sending command:', err);
            } else {
                console.log('Sent command:', command);
            }
        });
    } else {
        console.log('Arduino not connected');
    }
}

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    console.log('Current Arduino connection status:', isConnected);

    // Send current connection status
    console.log('Sending Arduino status to client:', { connected: isConnected });
    socket.emit('arduinoStatus', { connected: isConnected });

    // Handle electromagnet control
    socket.on('setMagnetStrength', (data) => {
        const { level } = data;
        if (level >= 1 && level <= 5) {
            sendToArduino(level.toString());
        } else if (level === 0) {
            sendToArduino('0');
        }
    });

    // Handle distance request
    socket.on('requestDistance', () => {
        // Arduino continuously sends distance data
        // No need to request specifically
    });

    // Handle Arduino status request
    socket.on('requestArduinoStatus', () => {
        console.log('Client requested Arduino status, current status:', isConnected);
        console.log('Sending Arduino status response:', { connected: isConnected });
        socket.emit('arduinoStatus', { connected: isConnected });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// REST API endpoints
app.get('/api/status', (req, res) => {
    res.json({
        connected: isConnected,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/magnet', (req, res) => {
    const { level } = req.body;
    if (level >= 0 && level <= 5) {
        sendToArduino(level.toString());
        res.json({ success: true, level });
    } else {
        res.status(400).json({ error: 'Invalid level. Must be 0-5.' });
    }
});

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Connecting to Arduino...');
    connectToArduino();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    if (arduinoPort && isConnected) {
        sendToArduino('0'); // Turn off magnets
        arduinoPort.close();
    }
    process.exit(0);
});
