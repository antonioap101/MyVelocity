// Configuración global del usuario
import {DeadZoneConfig} from "@/domain/deadZoneConfig";
import {SpeedState} from "@/domain/speedState";

export class UserSpeedConfig {
    public deadZoneConfigs: DeadZoneConfig[];

    constructor(deadZoneConfigs: DeadZoneConfig[]) {
        this.deadZoneConfigs = deadZoneConfigs;
    }

    // Obtiene la configuración para una transición específica
    public getTransitionConfig(fromState: SpeedState, toState: SpeedState): DeadZoneConfig | undefined {
        return this.deadZoneConfigs.find(config => config.fromState === fromState && config.toState === toState);
    }
}