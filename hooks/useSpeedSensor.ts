// Hook personalizado para manejar el sensor de velocidad
import {useEffect, useState} from "react";
import {Accelerometer} from "expo-sensors";
import {SpeedSensor} from "@/domain/speedSensor";
import {SpeedState} from "@/domain/speedState";

// Hook personalizado para manejar el sensor de velocidad
export function useSpeedSensor() {
    const [speed, setSpeed] = useState(0); // Velocidad actual
    const [speedState, setSpeedState] = useState<SpeedState>(SpeedState.STOPPED); // Estado de velocidad actual
    const speedSensor = new SpeedSensor(500);

    useEffect(() => {
        let subscription: any;
        const gravity = 9.81; // Aceleración de la gravedad en m/s²

        // Función para calcular la velocidad a partir del acelerómetro
        // Función para calcular la velocidad a partir del acelerómetro
        const calculateSpeed = (acceleration: { timestamp: number; x: number; y: number; z: number }) => {
            const { x, y, z } = acceleration;

            // Convertimos las fuerzas g a m/s²
            const accelerationMs2 = {
                x: x * gravity,
                y: y * gravity,
                z: z * gravity,
            };

            // Restamos la gravedad del eje vertical (asumimos que el eje Y es el vertical)
            const correctedAcceleration = {
                x: accelerationMs2.x,
                y: accelerationMs2.y - gravity, // Eliminar la componente de la gravedad
                z: accelerationMs2.z,
            };

            // Calculamos la magnitud de la aceleración neta en m/s²
            const instantAcceleration = Math.sqrt(
                correctedAcceleration.x ** 2 +
                correctedAcceleration.y ** 2 +
                correctedAcceleration.z ** 2
            );

            console.log("Corrected acceleration (m/s²):", correctedAcceleration, '|', "Instant acceleration magnitude (m/s²):", instantAcceleration, '|', "Timestamp:", acceleration.timestamp);

            setSpeed(instantAcceleration); // Actualizamos la aceleración neta (velocidad aproximada)

            // Aplicar la lógica de transición y actualizar el estado
            const newState = speedSensor.handleTransition(instantAcceleration, acceleration.timestamp);
            setSpeedState(newState);
        };
        // Suscribirse al acelerómetro
        Accelerometer.setUpdateInterval(speedSensor.updateInterval); // Cada 500 ms
        subscription = Accelerometer.addListener(calculateSpeed);

        return () => {
            if (subscription) subscription.remove();
        };
    }, []);

    return {speed, speedState};
}