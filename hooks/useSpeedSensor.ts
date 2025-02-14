import { useEffect, useRef, useState } from "react";
import { Accelerometer } from "expo-sensors";
import { SpeedSensor } from "@/domain/speedSensor";
import { SpeedState } from "@/domain/speedState";

// Hook personalizado para manejar el sensor de velocidad
export function useSpeedSensor() {
    const [speed, setSpeed] = useState(0); // Velocidad en km/h
    const [speedState, setSpeedState] = useState<SpeedState>(SpeedState.STOPPED);
    const speedSensor = useRef(new SpeedSensor(500)).current;

    // Variables internas para integración
    const velocityRef = useRef(0);
    const lastTimestampRef = useRef<number | null>(null);
    const gravity = 9.807; // m/s²

    // Inicializar el sensor
    useEffect(() => {
        speedSensor.init().then(() => console.log("Speed sensor initialized!"));
    }, []);

    /** Integrates the acceleration data to estimate the speed
     * @param acceleration - Acceleration data from the sensor (in g values, not m/s²)
     *
     * The relation between the acceleration in g and m/s² is: 1 g = 9.81 m/s²
     *
     * The relation between acceleration and velocity is: v(t) ~= v(t-1) + a(t) * Δt, following Euler's integration method
     *  - Original integration formula: v(t) = v(0) + INT(a(t) * dt){0,t}
     * The speed is then converted to km/h
     */
    const calculateSpeed = (acceleration: { timestamp: number; x: number; y: number; z: number }) => {
        const { x, y, z, timestamp } = acceleration;

        console.log("Acceleration data:", acceleration);

        const currentTime = timestamp * 1000;
        if (lastTimestampRef.current === null) {
            lastTimestampRef.current = currentTime;
            return;
        }

        // Tiempo transcurrido en segundos desde la última lectura
        const deltaTime = (currentTime - lastTimestampRef.current) / 1000;
        lastTimestampRef.current = currentTime;

        // Calculamos la aceleración neta en m/s² (corrigiendo la gravedad)
        const accMs2 = Math.sqrt((x * gravity) ** 2 + (y * gravity) ** 2 + (z * gravity) ** 2) - gravity;

        // We apply a noise threshold to avoid small variations in the acceleration
        const noiseThreshold = 0.001; // m/s²
        const effectiveAcceleration = Math.abs(accMs2) > noiseThreshold ? accMs2 : 0;


        // Integración para estimar la velocidad
        velocityRef.current += effectiveAcceleration * deltaTime;
        console.warn("Effective acceleration (m/s²):", effectiveAcceleration,
            " | Δt:", deltaTime,
            " | Adding to velocity:", effectiveAcceleration*deltaTime,
            " => Current velocity (m/s):", velocityRef.current);

        // Evitar velocidades negativas (podría ser ruido)
        if (velocityRef.current < 0) velocityRef.current = 0;

        // Convertimos a km/h
        const speedKmH = velocityRef.current * 3.6;

        setSpeed(speedKmH);

        // Actualizar el estado del sensor
        const newState = speedSensor.handleTransition(speedKmH, timestamp);
        setSpeedState(newState);

        console.log(`Speed (km/h): ${speedKmH.toFixed(2)} | Acc: ${accMs2.toFixed(2)} m/s² | Δt: ${deltaTime.toFixed(3)}s`);

        return speedKmH;
    };

    useEffect(() => {
        let subscription: any;

        Accelerometer.setUpdateInterval(speedSensor.updateInterval);
        subscription = Accelerometer.addListener(calculateSpeed);

        return () => {
            if (subscription) subscription.remove();
        };
    }, []);

    return { speed, speedSensor, speedState, calculateSpeed };
}
