import {I18n} from 'i18n-js';
import en from "./en.json";
import zh from "./zh.json";

const i18n = new I18n({
    en: en,
    zh: zh,
})


i18n.fallbacks = true;
i18n.locale = "zh";

export default i18n;

