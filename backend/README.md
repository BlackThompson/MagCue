# MagCue Backend

后端服务器，用于连接前端和Arduino设备。

## 功能

- **串口通信**: 与Arduino设备进行双向通信
- **WebSocket服务器**: 为前端提供实时数据流
- **REST API**: 提供HTTP接口
- **自动设备检测**: 自动检测Arduino设备端口

## 安装

```bash
cd backend
npm install
```

## 运行

```bash
npm start
```

或者开发模式（自动重启）：
```bash
npm run dev
```

## API 端点

### WebSocket 事件

- `setMagnetStrength`: 设置电磁铁强度 (1-5, 0=关闭)
- `requestDistance`: 请求距离数据
- `distance`: 接收距离数据
- `arduinoStatus`: Arduino连接状态

### REST API

- `GET /api/status`: 获取服务器和Arduino状态
- `POST /api/magnet`: 设置电磁铁强度

## Arduino 通信协议

### 发送到Arduino
- `1-5`: 设置电磁铁强度级别
- `0`: 关闭电磁铁

### 从Arduino接收
- 距离数据格式: `Distance: XX.X %`
- 原始数据格式: `Raw: XXX  Distance: XX.X %`

## 端口配置

- 默认端口: 3001
- Arduino波特率: 9600
- 前端地址: http://localhost:5173

## 故障排除

1. **Arduino未连接**: 检查USB连接和端口权限
2. **端口被占用**: 修改PORT环境变量
3. **权限错误**: 在Linux/Mac上可能需要sudo权限访问串口
