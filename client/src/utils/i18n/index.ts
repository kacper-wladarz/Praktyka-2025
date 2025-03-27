import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import plLang from "./locales/pl/pl.json";
import enLang from "./locales/en/en.json";

const resources = {
    pl: {
        translation: plLang,
    },
    en: {
        translation: enLang,
    },
};

const getStoredLng = () => {
    return localStorage.getItem("lng") || "pl";
};

i18n.use(initReactI18next).init({
    resources,
    lng: getStoredLng(),
    fallbackLng: "pl",
    interpolation: {
        escapeValue: false,
    },
});
