// Configuración detallada de la banda muerta para cada transición de estado
import {SpeedState} from "@/domain/speedState";

export type DeadZoneConfig = {
    fromState: SpeedState;
    toState: SpeedState;
    minDurationMs: number; // Tiempo mínimo en ms para confirmar la transición
    minStableMessages: number; // Cantidad de mensajes consecutivos para cambiar de estado
};
