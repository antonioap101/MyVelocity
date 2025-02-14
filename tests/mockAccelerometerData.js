// Shared callback for simulated accelerometer data
let simulateAccelerometerMovement = false;

function mockAccelerometerData(callback) {
    if (!simulateAccelerometerMovement) return { remove: () => {} };

    let timestampInSeconds = 0;
    const accelerationData = {x: 1, y: 1.0, z: 0};

    // Simulate sensor updates every 100ms
    const intervalId = setInterval(() => {
        timestampInSeconds += 0.1;
        callback({
            timestamp: timestampInSeconds,
            ...accelerationData
        });
    }, 100);

    return {
        remove: () => clearInterval(intervalId)
    };
}


export function enableAccelerometerMovementSimulation() {
    simulateAccelerometerMovement = true;
}

export function disableAccelerometerMovementSimulation() {
    simulateAccelerometerMovement = false;
}

export default mockAccelerometerData;