import {act, renderHook} from '@testing-library/react-native';
import {useSpeedSensor} from '@/hooks/useSpeedSensor';
import {
    disableAccelerometerMovementSimulation,
    enableAccelerometerMovementSimulation
} from "@/tests/mockAccelerometerData";


describe('useSpeedSensor Hook', () => {
    beforeEach(() => {
        disableAccelerometerMovementSimulation(); // Desactivar por defecto
    });

    test('calculates increasing speed over time', async () => {
        enableAccelerometerMovementSimulation(); // Activar solo para este test
        const {result} = renderHook(() => useSpeedSensor());

        // Allow sensor readings to accumulate
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 3000));
        });

        const speed = result.current.speed;

        // Assert that speed is greater than 0 after some time
        expect(speed).toBeGreaterThan(0);
        expect(speed).toBeLessThan(100);
    });

    test('resets speed when sensor is stopped', async () => {
        const {result} = renderHook(() => useSpeedSensor());

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        const initialSpeed = result.current.speed;
        expect(initialSpeed).toBeGreaterThanOrEqual(0);

        // Reset the speed sensor
        await act(async () => {
            await result.current.speedSensor.reset();
            await new Promise((resolve) => setTimeout(resolve, 500));
        });

        expect(result.current.speed).toBeCloseTo(0, 1);
    });

    test('handles negative acceleration values correctly', async () => {
        const {result} = renderHook(() => useSpeedSensor());

        let speedState = result.current.speedState;
        await act(async () => {
            speedState = result.current.speedSensor.handleTransition(-10, Date.now() + 500);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        expect(speedState).toBe('STOPPED');
        expect(result.current.speed).toBeGreaterThanOrEqual(0);
    });

    test('transitions between states correctly', async () => {
        const {result} = renderHook(() => useSpeedSensor());

        let speedState = result.current.speedState;
        await act(async () => {
            speedState = result.current.speedSensor.handleTransition(5, Date.now() + 500);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        expect(speedState).toBe('MARCHING');
    });
});
