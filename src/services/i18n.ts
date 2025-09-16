import  i18n  from "i18next";
import { initReactI18next } from "react-i18next";

import pt from "../locales/pt.json"
import en from "../locales/en.json"

i18n.use(initReactI18next).init({
    lng:'en',//Idioma padrão do meu app
    fallbackLng:'en',//Idioma se não encotrar tradução
    resources:{
        pt:{translation:pt},
        en:{translation:en},
    },
    interpolation:{
        escapeValue:false
    }
})

export default i18n