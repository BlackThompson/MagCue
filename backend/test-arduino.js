import { SerialPort } from 'serialport';

console.log('Testing Arduino connection...');

// List available ports
SerialPort.list().then(ports => {
    console.log('Available ports:');
    ports.forEach(port => {
        console.log(`- ${port.path} (${port.manufacturer || 'Unknown'})`);
    });

    // Try to find Arduino
    const arduinoPort = ports.find(port =>
        port.manufacturer && (
            port.manufacturer.includes('Arduino') ||
            port.manufacturer.includes('CH340') ||
            port.manufacturer.includes('FTDI')
        )
    );

    if (arduinoPort) {
        console.log(`\nFound Arduino on: ${arduinoPort.path}`);
        console.log('You can now run: npm start');
    } else {
        console.log('\nNo Arduino found. Please check:');
        console.log('1. Arduino is connected via USB');
        console.log('2. Arduino IDE shows the correct port');
        console.log('3. workingfile-magcue.ino is uploaded');
    }
}).catch(err => {
    console.error('Error listing ports:', err);
});
