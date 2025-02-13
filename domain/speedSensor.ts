import AsyncStorage from "@react-native-async-storage/async-storage";
import {SpeedState} from "@/domain/speedState";
import {errorEmitter} from "@/domain/EventEmitter";

// Define Interval interface
export interface Interval {
    minValue: number;
    maxValue: number;
    minDurationMs: number;
}

// Define SpeedTransitionConfig
export type SpeedTransitionConfig = {
    [state in SpeedState]: Interval;

};

export class SpeedSensor {
    private readonly _updateInterval: number;
    private _sensorStatus = {currentSpeed: 0, lastTimestamp: Date.now()};
    private _speedState = {current: SpeedState.STOPPED, last: SpeedState.STOPPED};
    private _transitionConfig: SpeedTransitionConfig;
    private readonly _defaultTransitionConfig: SpeedTransitionConfig = {
        [SpeedState.STOPPED]: {minValue: 0, maxValue: 1, minDurationMs: 500},
        [SpeedState.WALKING]: {minValue: 1, maxValue: 4, minDurationMs: 500},
        [SpeedState.MARCHING]: {minValue: 4, maxValue: 6, minDurationMs: 500},
        [SpeedState.RUNNING]: {minValue: 6, maxValue: 12, minDurationMs: 500},
        [SpeedState.SPRINTING]: {minValue: 12, maxValue: 25, minDurationMs: 500},
        [SpeedState.LAND_MOTOR_VEHICLE]: {minValue: 25, maxValue: 170, minDurationMs: 500},
        [SpeedState.AIR_MOTOR_VEHICLE]: {minValue: 170, maxValue: Infinity, minDurationMs: 500},
    };

    constructor(updateInterval: number) {
        this._updateInterval = updateInterval;
        this._transitionConfig = {...this._defaultTransitionConfig};

        // Cargar configuraciones desde AsyncStorage al iniciar
        this.loadConfig();
    }

    // Guardar en AsyncStorage
    private async saveConfig(): Promise<void> {
        try {
            await AsyncStorage.setItem("speedSensorConfig", JSON.stringify(this._transitionConfig));
        } catch (error) {
            errorEmitter.emitError("Failed to save speed sensor configuration!");
        }
    }

    private async loadConfig(): Promise<void> {
        try {
            const storedConfig = await AsyncStorage.getItem("speedSensorConfig");
            if (storedConfig) {
                this._transitionConfig = JSON.parse(storedConfig);
                console.log("Loaded transition config from storage:", this._transitionConfig);
            }
        } catch (error) {
            errorEmitter.emitError("Failed to load speed sensor configuration!");
        }
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
        // console.log("Speed state:", this._speedState.current, '|', "Elapsed time (ms):", now - this._sensorStatus.lastTimestamp);
        return this._speedState.current; // Return the last confirmed state if transition not complete
    }

    get updateInterval(): number {
        return this._updateInterval;
    }

    // Getter method to retrieve a specific field from the transitionConfig object
    public getTransitionConfigField(state: SpeedState, field: keyof Interval): number | undefined {
        return this._transitionConfig[state] ? this._transitionConfig[state][field] : undefined;
    }

    // Setter method para actualizar un campo y guardar la configuración
    public async setTransitionConfigField(state: SpeedState, field: keyof Interval, value: number): Promise<void> {
        if (!this.isValidTransitionConfigField(state, field, value)){
            console.error("Invalid value for transition config field:", state, '|', field, '|', value);
            errorEmitter.emitError("Invalid value for transition config field!");
        }
        if (this._transitionConfig[state]) {
            this._transitionConfig[state][field] = value;
            await this.saveConfig(); // Guardar cambios
        }
        console.log("Transition config updated:", state, '|', field, '|', value);
    }

    public async reset(): Promise<void> {
        this._transitionConfig = {...this._defaultTransitionConfig};
        await this.saveConfig(); // Guardar valores reseteados
    }

    get transitionConfig(): SpeedTransitionConfig {
        return this._transitionConfig;
    }

    // Function to validate a given value for a specific SpeedState
    public isValidTransitionConfigField(state: SpeedState, field: keyof Interval, value: number): boolean {
        if (value < 0) return false; // Value should be non-negative

        const interval = this._transitionConfig[state];
        if (!interval) return false; // State must exist in the config

        switch (field) {
            case "minValue":
                return value < interval.maxValue; // minValue should be less than maxValue
            case "maxValue":
                return value > interval.minValue; // maxValue should be greater than minValue
            case "minDurationMs":
                return value >= 0; // minDurationMs should be non-negative
            default:
                return false; // Invalid field
        }
    }

}