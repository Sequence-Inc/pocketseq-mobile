const i18next = require('i18next');
const { initReactI18next } = require('react-i18next');
require('intl-pluralrules');
const strings = {
  en: { translation: require('../../../assets/strings/en.json') },
  jp: { translation: require('../../../assets/strings/jp.json') },
};
i18next.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: strings,
});
function changeLanguage(lng, callback) {
  if(i18next.language === lng) return;
  i18next.changeLanguage(lng, callback);
}
module.exports = { strings: i18next.t, changeLanguage: changeLanguage };
