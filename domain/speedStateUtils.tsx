import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {SpeedState} from "@/domain/speedState";
import {
    faCarSide,
    faCircleStop,
    faPersonHiking,
    faPersonRunning,
    faPersonWalking,
    faPersonWalkingArrowRight,
    faPlane,
    faQuestion
} from "@fortawesome/free-solid-svg-icons";
import React, {ReactElement} from "react";
import {useTranslation} from "react-i18next";
import {capitalize} from "@/utils/capitalize";

export class SpeedStateUtils {
    public static readonly MIN_SPEED = 0;
    public static readonly MAX_SPEED = 1000;
    public static readonly DEFAULT_MIN_DURATION = 500;

    static getPreviousState(speedState: SpeedState): SpeedState {
        switch (speedState) {
            case SpeedState.WALKING:
                return SpeedState.STOPPED;
            case SpeedState.MARCHING:
                return SpeedState.WALKING;
            case SpeedState.RUNNING:
                return SpeedState.MARCHING;
            case SpeedState.SPRINTING:
                return SpeedState.RUNNING;
            case SpeedState.LAND_MOTOR_VEHICLE:
                return SpeedState.SPRINTING;
            case SpeedState.AIR_MOTOR_VEHICLE:
                return SpeedState.LAND_MOTOR_VEHICLE;
            default:
                return SpeedState.NONE;
        }
    }


    static getNextState(speedState: SpeedState): SpeedState {
        switch (speedState) {
            case SpeedState.STOPPED:
                return SpeedState.WALKING;
            case SpeedState.WALKING:
                return SpeedState.MARCHING;
            case SpeedState.MARCHING:
                return SpeedState.RUNNING;
            case SpeedState.RUNNING:
                return SpeedState.SPRINTING;
            case SpeedState.SPRINTING:
                return SpeedState.LAND_MOTOR_VEHICLE;
            case SpeedState.LAND_MOTOR_VEHICLE:
                return SpeedState.AIR_MOTOR_VEHICLE;
            default:
                return SpeedState.NONE;
        }
    }

    static getName(speedState: SpeedState) {
        const {t} = useTranslation();
        let stateName: string;
        switch (speedState) {
            case SpeedState.STOPPED:
                stateName = t("state.stopped");
                break;
            case SpeedState.WALKING:
                stateName = t("state.walking");
                break;
            case SpeedState.MARCHING:
                stateName = t("state.marching");
                break;
            case SpeedState.RUNNING:
                stateName = t("state.running");
                break;
            case SpeedState.SPRINTING:
                stateName = t("state.sprinting");
                break;
            case SpeedState.LAND_MOTOR_VEHICLE:
                stateName = t("state.land_motor_vehicle");
                break;
            case SpeedState.AIR_MOTOR_VEHICLE:
                stateName = t("state.air_motor_vehicle");
                break;
            case SpeedState.NONE:
            default:
                stateName = t("state.unknown");
        }
        return capitalize(stateName);
    }

    static getIcon(speedState: SpeedState, color?: string): ReactElement {
        switch (speedState) {

            case SpeedState.STOPPED:
                return <FontAwesomeIcon icon={faCircleStop} size={24} color={color}/>;
            case SpeedState.WALKING:
                return <FontAwesomeIcon icon={faPersonWalking} size={24} color={color}/>;
            case SpeedState.MARCHING:
                return <FontAwesomeIcon icon={faPersonHiking} size={24} color={color}/>;
            case SpeedState.RUNNING:
                return <FontAwesomeIcon icon={faPersonWalkingArrowRight} size={24} color={color}/>;
            case SpeedState.SPRINTING:
                return <FontAwesomeIcon icon={faPersonRunning} size={24} color={color}/>;
            case SpeedState.LAND_MOTOR_VEHICLE:
                return <FontAwesomeIcon icon={faCarSide} size={24} color={color}/>;
            case SpeedState.AIR_MOTOR_VEHICLE:
                return <FontAwesomeIcon icon={faPlane} size={24} color={color}/>;
            case SpeedState.NONE:
            default:
                return <FontAwesomeIcon icon={faQuestion} size={24} color={color}/>;
        }
    }

    static getValidStates(): SpeedState[] {
        return Object.values(SpeedState).filter((state) => state !== SpeedState.NONE);
    }
}