// Manejador para la lógica de transiciones con banda muerta
import {SpeedState} from "@/domain/speedState";
import {SpeedSensor} from "@/domain/speedSensor";
import {UserSpeedConfig} from "@/domain/userSpeedConfig";

export class SpeedTransitionHandler {
    private stableMessageCount: number = 0;
    private currentTimestamp: number = Date.now();
    private lastState: SpeedState;

    constructor(
        private userConfig: UserSpeedConfig,
        private speedSensor: SpeedSensor
    ) {
        this.lastState = speedSensor.getCurrentState();
    }

    public handleTransition(newSpeed: number): SpeedState {
        this.speedSensor.updateSpeed(newSpeed);
        const currentState = this.speedSensor.getCurrentState();

        // Si no hay cambio de estado, reseteamos los contadores
        if (currentState === this.lastState) {
            this.stableMessageCount = 0;
            this.currentTimestamp = Date.now();
            return currentState;
        }

        const transitionConfig = this.userConfig.getTransitionConfig(this.lastState, currentState);

        if (!transitionConfig) {
            // Si no hay configuración para esta transición, cambiar inmediatamente
            this.lastState = currentState;
            return currentState;
        }

        const elapsedMs = Date.now() - this.currentTimestamp;
        this.stableMessageCount++;

        // Validamos tanto el tiempo como la cantidad de mensajes estables necesarios
        if (elapsedMs >= transitionConfig.minDurationMs && this.stableMessageCount >= transitionConfig.minStableMessages) {
            this.lastState = currentState;
            this.stableMessageCount = 0; // Reseteamos el contador
            return currentState;
        }

        return this.lastState; // No cambiar hasta que se cumplan los criterios
    }
}
