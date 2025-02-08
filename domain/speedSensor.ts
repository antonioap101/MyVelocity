import {SpeedState} from "@/domain/speedState";

// Define the Interval interface
export interface Interval {
    minValue: number;
    maxValue: number;
    minDurationMs: number;
}

// Update the SpeedTransitionConfig type
export type SpeedTransitionConfig = {
    [state in SpeedState]: Interval;
};

export class SpeedSensor {
    private readonly _updateInterval: number;
    private _sensorStatus = {currentSpeed: 0, lastTimestamp: Date.now()};
    private _speedState = {current: SpeedState.STOPPED, last: SpeedState.STOPPED};
    private readonly _transitionConfig: SpeedTransitionConfig;

    constructor(updateInterval: number) {
        this._updateInterval = updateInterval;
        this._transitionConfig = {
            [SpeedState.STOPPED]: {minValue: 0, maxValue: 1, minDurationMs: updateInterval},
            [SpeedState.WALKING]: {minValue: 1, maxValue: 4, minDurationMs: updateInterval},
            [SpeedState.MARCHING]: {minValue: 4, maxValue: 6, minDurationMs: updateInterval},
            [SpeedState.RUNNING]: {minValue: 6, maxValue: 12, minDurationMs: updateInterval},
            [SpeedState.SPRINTING]: {minValue: 12, maxValue: 25, minDurationMs: updateInterval},
            [SpeedState.LAND_MOTOR_VEHICLE]: {minValue: 25, maxValue: 170, minDurationMs: updateInterval},
            [SpeedState.AIR_MOTOR_VEHICLE]: {minValue: 170, maxValue: Infinity, minDurationMs: updateInterval}
        };
    }

    // Method to update the speed and process state transitions
    public handleTransition(newSpeed: number, at: number): SpeedState {
        const now = at * 1000; // Convert seconds to milliseconds
        this._sensorStatus.currentSpeed = newSpeed;

        // Check the current speed against state intervals
        for (const [state, interval] of Object.entries(this._transitionConfig)) {
            if (newSpeed >= interval.minValue && newSpeed < interval.maxValue) {
                if (state === this._speedState.last) {
                    // If the state hasn't changed, reset the timestamp
                    this._sensorStatus.lastTimestamp = now;
                    this._speedState.current = state as SpeedState;
                    return this._speedState.current;
                }

                // Check if the new state has been stable long enough
                const elapsedMs = now - this._sensorStatus.lastTimestamp;
                if (elapsedMs >= interval.minDurationMs) {
                    // Update the state if it has remained stable for the required duration
                    this._speedState.last = state as SpeedState;
                    this._sensorStatus.lastTimestamp = now;
                    this._speedState.current = state as SpeedState;
                }
                break;
            }
        }
        console.log("Speed state:", this._speedState.current, '|', "Elapsed time (ms):", now - this._sensorStatus.lastTimestamp);
        return this._speedState.current; // Return the last confirmed state if transition not complete
    }

    get updateInterval(): number {
        return this._updateInterval;
    }

    get sensorStatus(): { currentSpeed: number; lastTimestamp: number } {
        return this._sensorStatus;
    }

    get speedState(): { current: SpeedState; last: SpeedState } {
        return this._speedState;
    }

    get transitionConfig(): SpeedTransitionConfig {
        return this._transitionConfig;
    }

}
