// Importamos los archivos de traducción JSON


import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from '@/assets/locales/en.json';
import translationEs from '@/assets/locales/es.json';

const resources = {
    "en-US": {translation: translationEn},
    "es-ES": {translation: translationEs},
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem("language");

    if (!savedLanguage) {
        console.warn("Locales: ", Localization.getLocales()[0].languageTag)
        savedLanguage = Localization.getLocales()[0].languageTag;
    }

    console.log("savedLanguage: ", savedLanguage)

    i18n.use(initReactI18next).init({
        compatibilityJSON: "v4",
        lng: savedLanguage,
        fallbackLng: "en-US",
        resources: resources,
        interpolation: {
            escapeValue: false,
        },
    });
};

initI18n();

export default i18n;
