import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

console.log('Testing Arduino data parsing...');

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

        const port = new SerialPort({
            path: arduinoPort.path,
            baudRate: 9600,
            autoOpen: false
        });

        const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

        port.open((err) => {
            if (err) {
                console.error('Error opening port:', err.message);
                return;
            }

            console.log('Connected to Arduino - listening for data...\n');

            parser.on('data', (data) => {
                console.log('Raw Arduino data:', data);

                // Test parsing logic
                let distance = null;

                // Format 1: "Raw: 358  Distance: 0.00 %"
                if (data.includes('Distance:')) {
                    const distanceMatch = data.match(/Distance:\s*([\d.]+)/);
                    if (distanceMatch) {
                        distance = parseFloat(distanceMatch[1]);
                        console.log('✓ Parsed (Format 1):', distance);
                    }
                }
                // Format 2: "358 0.00" (PLOTTER_MODE)
                else if (data.match(/^\d+\s+[\d.]+$/)) {
                    const parts = data.trim().split(/\s+/);
                    if (parts.length >= 2) {
                        distance = parseFloat(parts[1]);
                        console.log('✓ Parsed (Format 2):', distance);
                    }
                }

                if (distance === null) {
                    console.log('✗ Could not parse distance from:', data);
                }

                console.log('---');
            });
        });

        // Close after 30 seconds
        setTimeout(() => {
            console.log('\nClosing connection...');
            port.close();
            process.exit(0);
        }, 30000);

    } else {
        console.log('\nNo Arduino found. Please check connection.');
        process.exit(1);
    }
}).catch(err => {
    console.error('Error listing ports:', err);
});

