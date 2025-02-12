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

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export class SpeedStateUtils {
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
            default:
                stateName = t("state.unknown");
        }
        return capitalizeFirstLetter(stateName);
    }

    static getIcon(speedState: SpeedState): ReactElement {
        switch (speedState) {
            case SpeedState.STOPPED:
                return <FontAwesomeIcon icon={faCircleStop} size={24}/>;
            case SpeedState.WALKING:
                return <FontAwesomeIcon icon={faPersonWalking} size={24}/>;
            case SpeedState.MARCHING:
                return <FontAwesomeIcon icon={faPersonHiking} size={24}/>;
            case SpeedState.RUNNING:
                return <FontAwesomeIcon icon={faPersonWalkingArrowRight} size={24}/>;
            case SpeedState.SPRINTING:
                return <FontAwesomeIcon icon={faPersonRunning} size={24}/>;
            case SpeedState.LAND_MOTOR_VEHICLE:
                return <FontAwesomeIcon icon={faCarSide} size={24}/>;
            case SpeedState.AIR_MOTOR_VEHICLE:
                return <FontAwesomeIcon icon={faPlane} size={24}/>;
            default:
                return <FontAwesomeIcon icon={faQuestion} size={24}/>;
        }
    }
}