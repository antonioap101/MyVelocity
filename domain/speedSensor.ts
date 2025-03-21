import AsyncStorage from "@react-native-async-storage/async-storage";
import {SpeedState} from "@/domain/speedState";
import {errorEmitter} from "@/domain/EventEmitter";
import {deepClone} from "@/utils/deepClone";

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

// Define a global constant for the default config
const DEFAULT_TRANSITION_CONFIG: SpeedTransitionConfig = {
    [SpeedState.NONE]: {minValue: 0, maxValue: 0, minDurationMs: 0},
    [SpeedState.STOPPED]: {minValue: 0, maxValue: 1, minDurationMs: 500},
    [SpeedState.WALKING]: {minValue: 1, maxValue: 4, minDurationMs: 500},
    [SpeedState.MARCHING]: {minValue: 4, maxValue: 6, minDurationMs: 500},
    [SpeedState.RUNNING]: {minValue: 6, maxValue: 12, minDurationMs: 500},
    [SpeedState.SPRINTING]: {minValue: 12, maxValue: 25, minDurationMs: 500},
    [SpeedState.LAND_MOTOR_VEHICLE]: {minValue: 25, maxValue: 170, minDurationMs: 500},
    [SpeedState.AIR_MOTOR_VEHICLE]: {minValue: 170, maxValue: 1000, minDurationMs: 500}

};


export class SpeedSensor {
    private readonly _updateInterval: number;
    private _sensorStatus = {currentSpeed: 0, lastTimestamp: Date.now()};
    private _speedState = {current: SpeedState.STOPPED, last: SpeedState.STOPPED};
    private _transitionConfig: SpeedTransitionConfig;

    constructor(updateInterval: number) {
        this._updateInterval = updateInterval;
        this._transitionConfig = deepClone(DEFAULT_TRANSITION_CONFIG);
    }

    // Initialize the config explicitly
    public async init(): Promise<void> {
        try {
            await this.loadConfig();
            console.warn("Loaded transition config:", this._transitionConfig);
        } catch (err) {
            console.error("Failed to load transition config:", err);
        }
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
                const storedConfigParsed = JSON.parse(storedConfig);
                if (!this.validateConfig(storedConfigParsed)) {
                    await this.reset();
                    throw new Error("Invalid transition config loaded from storage!");
                }
                this._transitionConfig = storedConfigParsed;
                console.log("Loaded transition config from storage:", this._transitionConfig);
            }
        } catch (error) {
            errorEmitter.emitError("Failed to load speed sensor configuration!");
        }
    }

    private validateConfig(config: SpeedTransitionConfig): boolean {
        for (const [state, interval] of Object.entries(config).filter(([state]) => state !== SpeedState.NONE)) {
            if (interval.minValue == undefined || interval.maxValue == undefined || interval.minDurationMs == undefined) {
                console.error("Invalid interval values for state:", state, " | Interval:", interval);
                return false;
            }
            if (!this.isValidTransitionConfigField(state as SpeedState, "minValue", interval.minValue)) {
                console.error("Invalid minValue for state:", state, " | Interval:", interval);
                return false;
            }
            if (!this.isValidTransitionConfigField(state as SpeedState, "maxValue", interval.maxValue)) {
                console.error("Invalid maxValue for state:", state, " | Interval:", interval);
                return false;
            }
            if (!this.isValidTransitionConfigField(state as SpeedState, "minDurationMs", interval.minDurationMs)) {
                console.error("Invalid minDurationMs for state:", state, " | Interval:", interval);
                return false;
            }
        }
        return true;
    }

    // Method to update the speed and process state transitions
    public handleTransition(newSpeed: number, at: number): SpeedState {
        const now = at * 1000; // Convert seconds to milliseconds
        this._sensorStatus.currentSpeed = newSpeed;
        console.warn("Current speed:", newSpeed, " | Current state:", this._speedState.current);

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
                console.log("Elapsed time (ms):", elapsedMs, " | Required duration:", interval.minDurationMs);
                if (elapsedMs >= interval.minDurationMs) {
                    // Update the state if it has remained stable for the required duration
                    this._speedState.last = state as SpeedState;
                    this._sensorStatus.lastTimestamp = now;
                    this._speedState.current = state as SpeedState;
                }
                break;
            }
        }
        console.log("Afterwards Speed state:", this._speedState.current, '|', "Elapsed time (ms):", now - this._sensorStatus.lastTimestamp);
        return this._speedState.current; // Return the last confirmed state if transition not complete
    }

    get updateInterval(): number {
        return this._updateInterval;
    }

    // Getter method to retrieve a specific field from the transitionConfig object
    public getTransitionConfigField(state: SpeedState, field: keyof Interval): number {
        if (!this._transitionConfig[state]) {
            console.warn(`State ${state} not found in transition config. Returning default value.`);
            return DEFAULT_TRANSITION_CONFIG[state][field];
        }

        const value = this._transitionConfig[state][field];

        if (value === null || value === undefined) {
            console.warn(`Invalid ${field} value for ${state}. Using default value.`);
            return DEFAULT_TRANSITION_CONFIG[state][field];
        }

        console.warn(`Getting transition config field: ${state} | ${field} -> ${value}`);
        console.warn('Spec-Transition-Config:', this._transitionConfig[state]);
        console.warn('Whole-Transition-Config:', this._transitionConfig);
        return value;
    }


    // Setter method para actualizar un campo y guardar la configuración
    public async setTransitionConfigField(state: SpeedState, field: keyof Interval, value: number): Promise<void> {
        if (!this.isValidTransitionConfigField(state, field, value)) {
            console.error("Invalid value for transition config field:", state, '|', field, '|', value);
            errorEmitter.emitError(`Invalid value for transition config field: ${state} | ${field} | ${value}`);
        }
        if (this._transitionConfig[state]) {
            this._transitionConfig[state][field] = value;
            await this.saveConfig(); // Guardar cambios
        }
        console.log("Transition config updated:", state, '|', field, '|', value);
    }

    public async reset(): Promise<void> {
        console.warn("------------------Transition config reset to default values. DEFUALT:", DEFAULT_TRANSITION_CONFIG);
        this._transitionConfig = deepClone(DEFAULT_TRANSITION_CONFIG);
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