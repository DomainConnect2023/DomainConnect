import { I18n } from 'i18n-js';
import en from "./en.json";
import zh from "./zh.json";
import my from "./my.json";

const i18n = new I18n({
    en: en,
    zh: zh,
    my: my
})

i18n.fallbacks = true;
i18n.locale = "en";

export default i18n;

