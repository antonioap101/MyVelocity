// Define the Interval interface
import {SpeedState} from "@/app/domain/speedState";

export interface Interval {
    minValue: number;
    maxValue: number;
}

// Update the SpeedTransitionConfig type
export type SpeedTransitionConfig = {
    [state in SpeedState]: Interval;
};

// Refactor the SpeedSensor class
export class SpeedSensor {
    private currentSpeed: number = 0;
    private currentState: SpeedState = SpeedState.PARADO;
    private readonly transitionConfig: SpeedTransitionConfig;

    constructor(transitionConfig: SpeedTransitionConfig) {
        this.transitionConfig = transitionConfig;
    }

    // Method to update the speed
    public updateSpeed(newSpeed: number): void {
        this.currentSpeed = newSpeed;
        this.updateState();
    }

    // Method to determine the state based on the speed
    private updateState(): void {
        for (const [state, interval] of Object.entries(this.transitionConfig)) {
            if (this.currentSpeed >= interval.minValue && this.currentSpeed < interval.maxValue) {
                this.currentState = state as SpeedState;
                break;
            }
        }
    }

    public getCurrentState(): SpeedState {
        return this.currentState;
    }
}