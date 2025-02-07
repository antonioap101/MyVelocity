import {useEffect, useState} from "react";
import {Accelerometer} from "expo-sensors";
import {SpeedSensor} from "@/domain/speedSensor";
import {SpeedState} from "@/domain/speedState";
import {UserSpeedConfig} from "@/domain/userSpeedConfig";
import {SpeedTransitionHandler} from "@/domain/SpeedTransitionHandler";


// Hook personalizado para manejar el sensor de velocidad
export function useSpeedSensor() {
    const [speed, setSpeed] = useState(0); // Velocidad actual
    const [speedState, setSpeedState] = useState<SpeedState>(SpeedState.PARADO); // Estado de velocidad actual

    // Configuraciones de ejemplo (se pueden parametrizar)
    const speedSensor = new SpeedSensor({
        [SpeedState.PARADO]: { minValue: 0, maxValue: 1 },
        [SpeedState.CAMINANDO]: { minValue: 1, maxValue: 4 },
        [SpeedState.MARCHANDO]: { minValue: 4, maxValue: 6 },
        [SpeedState.CORRIENDO]: { minValue: 6, maxValue: 12 },
        [SpeedState.SPRINT]: { minValue: 12, maxValue: 25 },
        [SpeedState.VEH_MOTOR_TERRESTRE]: { minValue: 25, maxValue: 170 },
        [SpeedState.VEH_MOTOR_AEREO]: { minValue: 170, maxValue: Infinity }
    });

    const userConfig = new UserSpeedConfig([
        { fromState: SpeedState.CORRIENDO, toState: SpeedState.SPRINT, minDurationMs: 1500, minStableMessages: 10 },
        { fromState: SpeedState.SPRINT, toState: SpeedState.CORRIENDO, minDurationMs: 500, minStableMessages: 5 }
    ]);

    const transitionHandler = new SpeedTransitionHandler(userConfig, speedSensor);

    useEffect(() => {
        let subscription: any;

        // Función para calcular la velocidad a partir del acelerómetro
        const calculateSpeed = (acceleration: { x: number; y: number; z: number }) => {
            const { x, y, z } = acceleration;
            // Asumimos aceleración en m/s² y calculamos una aproximación de velocidad
            const instantSpeed = Math.sqrt(x * x + y * y + z * z);
            setSpeed(instantSpeed);

            // Aplicar la lógica de transición y actualizar el estado
            const newState = transitionHandler.handleTransition(instantSpeed);
            setSpeedState(newState);
        };

        // Suscribirse al acelerómetro
        Accelerometer.setUpdateInterval(500); // Cada 500 ms
        subscription = Accelerometer.addListener(calculateSpeed);

        return () => {
            if (subscription) subscription.remove();
        };
    }, []);

    return { speed, speedState };
}