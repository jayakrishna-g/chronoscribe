const languageObjects = [
  { language: 'Afrikaans', region: '', code: 'af-ZA' },
  { language: 'አማርኛ', region: '', code: 'am-ET' },
  { language: 'Azərbaycanca', region: '', code: 'az-AZ' },
  { language: 'বাংলা', region: 'বাংলাদেশ', code: 'bn-BD' },
  { language: 'বাংলা', region: 'ভারত', code: 'bn-IN' },
  { language: 'Bahasa Indonesia', region: '', code: 'id-ID' },
  { language: 'Bahasa Melayu', region: '', code: 'ms-MY' },
  { language: 'Català', region: '', code: 'ca-ES' },
  { language: 'Čeština', region: '', code: 'cs-CZ' },
  { language: 'Dansk', region: '', code: 'da-DK' },
  { language: 'Deutsch', region: '', code: 'de-DE' },
  { language: 'English', region: 'Australia', code: 'en-AU' },
  { language: 'English', region: 'Canada', code: 'en-CA' },
  { language: 'English', region: 'India', code: 'en-IN' },
  { language: 'English', region: 'Kenya', code: 'en-KE' },
  { language: 'English', region: 'Tanzania', code: 'en-TZ' },
  { language: 'English', region: 'Ghana', code: 'en-GH' },
  { language: 'English', region: 'New Zealand', code: 'en-NZ' },
  { language: 'English', region: 'Nigeria', code: 'en-NG' },
  { language: 'English', region: 'South Africa', code: 'en-ZA' },
  { language: 'English', region: 'Philippines', code: 'en-PH' },
  { language: 'English', region: 'United Kingdom', code: 'en-GB' },
  { language: 'English', region: 'United States', code: 'en-US' },
  { language: 'Español', region: 'Argentina', code: 'es-AR' },
  { language: 'Español', region: 'Bolivia', code: 'es-BO' },
  { language: 'Español', region: 'Chile', code: 'es-CL' },
  { language: 'Español', region: 'Colombia', code: 'es-CO' },
  { language: 'Español', region: 'Costa Rica', code: 'es-CR' },
  { language: 'Español', region: 'Ecuador', code: 'es-EC' },
  { language: 'Español', region: 'El Salvador', code: 'es-SV' },
  { language: 'Español', region: 'España', code: 'es-ES' },
  { language: 'Español', region: 'Estados Unidos', code: 'es-US' },
  { language: 'Español', region: 'Guatemala', code: 'es-GT' },
  { language: 'Español', region: 'Honduras', code: 'es-HN' },
  { language: 'Español', region: 'México', code: 'es-MX' },
  { language: 'Español', region: 'Nicaragua', code: 'es-NI' },
  { language: 'Español', region: 'Panamá', code: 'es-PA' },
  { language: 'Español', region: 'Paraguay', code: 'es-PY' },
  { language: 'Español', region: 'Perú', code: 'es-PE' },
  { language: 'Español', region: 'Puerto Rico', code: 'es-PR' },
  { language: 'Español', region: 'República Dominicana', code: 'es-DO' },
  { language: 'Español', region: 'Uruguay', code: 'es-UY' },
  { language: 'Español', region: 'Venezuela', code: 'es-VE' },
  { language: 'Euskara', region: '', code: 'eu-ES' },
  { language: 'Filipino', region: '', code: 'fil-PH' },
  { language: 'Français', region: '', code: 'fr-FR' },
  { language: 'Basa Jawa', region: '', code: 'jv-ID' },
  { language: 'Galego', region: '', code: 'gl-ES' },
  { language: 'ગુજરાતી', region: '', code: 'gu-IN' },
  { language: 'Hrvatski', region: '', code: 'hr-HR' },
  { language: 'IsiZulu', region: '', code: 'zu-ZA' },
  { language: 'Íslenska', region: '', code: 'is-IS' },
  { language: 'Italiano', region: 'Italia', code: 'it-IT' },
  { language: 'Italiano', region: 'Svizzera', code: 'it-CH' },
  { language: 'ಕನ್ನಡ', region: '', code: 'kn-IN' },
  { language: 'ភាសាខ្មែរ', region: '', code: 'km-KH' },
  { language: 'Latviešu', region: '', code: 'lv-LV' },
  { language: 'Lietuvių', region: '', code: 'lt-LT' },
  { language: 'മലയാളം', region: '', code: 'ml-IN' },
  { language: 'मराठी', region: '', code: 'mr-IN' },
  { language: 'Magyar', region: '', code: 'hu-HU' },
  { language: 'ລາວ', region: '', code: 'lo-LA' },
  { language: 'Nederlands', region: '', code: 'nl-NL' },
  { language: 'नेपाली भाषा', region: '', code: 'ne-NP' },
  { language: 'Norsk bokmål', region: '', code: 'nb-NO' },
  { language: 'Polski', region: '', code: 'pl-PL' },
  { language: 'Português', region: 'Brasil', code: 'pt-BR' },
  { language: 'Português', region: 'Portugal', code: 'pt-PT' },
  { language: 'Română', region: '', code: 'ro-RO' },
  { language: 'සිංහල', region: '', code: 'si-LK' },
  { language: 'Slovenščina', region: '', code: 'sl-SI' },
  { language: 'Basa Sunda', region: '', code: 'su-ID' },
  { language: 'Slovenčina', region: '', code: 'sk-SK' },
  { language: 'Suomi', region: '', code: 'fi-FI' },
  { language: 'Svenska', region: '', code: 'sv-SE' },
  { language: 'Kiswahili', region: 'Tanzania', code: 'sw-TZ' },
  { language: 'Kiswahili', region: 'Kenya', code: 'sw-KE' },
  { language: 'ქართული', region: '', code: 'ka-GE' },
  { language: 'Հայերեն', region: '', code: 'hy-AM' },
  { language: 'தமிழ்', region: 'இந்தியா', code: 'ta-IN' },
  { language: 'தமிழ்', region: 'சிங்கப்பூர்', code: 'ta-SG' },
  { language: 'தமிழ்', region: 'இலங்கை', code: 'ta-LK' },
  { language: 'தமிழ்', region: 'மலேசியா', code: 'ta-MY' },
  { language: 'తెలుగు', region: '', code: 'te-IN' },
  { language: 'Tiếng Việt', region: '', code: 'vi-VN' },
  { language: 'Türkçe', region: '', code: 'tr-TR' },
  { language: 'اُردُو', region: 'پاکستان', code: 'ur-PK' },
  { language: 'اُردُو', region: 'بھارت', code: 'ur-IN' },
  { language: 'Ελληνικά', region: '', code: 'el-GR' },
  { language: 'български', region: '', code: 'bg-BG' },
  { language: 'Русский', region: '', code: 'ru-RU' },
  { language: 'Српски', region: '', code: 'sr-RS' },
  { language: 'Українська', region: '', code: 'uk-UA' },
  { language: '한국어', region: '', code: 'ko-KR' },
  { language: '中文', region: '普通话 (中国大陆)', code: 'cmn-Hans-CN' },
  { language: '中文', region: '普通话 (香港)', code: 'cmn-Hans-HK' },
  { language: '中文', region: '中文 (台灣)', code: 'cmn-Hant-TW' },
  { language: '中文', region: '粵語 (香港)', code: 'yue-Hant-HK' },
  { language: '日本語', region: '', code: 'ja-JP' },
  { language: 'हिन्दी', region: '', code: 'hi-IN' },
  { language: 'ภาษาไทย', region: '', code: 'th-TH' }
];

export default languageObjects;

export interface Language {
  region: string;
  language: string;
  code: string;
}

export const getLanguageByCode = (code: string): Language | undefined => {
  return languageObjects.find((language) => language.code === code);
};

export const getLanguageByRegion = (region: string): Language | undefined => {
  return languageObjects.find((language) => language.region === region);
};

export const getLanguageByName = (language: string): Language | undefined => {
  return languageObjects.find((lang) => lang.language === language);
}

export const getLanguageCodeByRegion = (region: string): string | undefined => {
  const language = getLanguageByRegion(region);
  return language ? language.code : undefined;
};

export const getLanguageCodeByName = (language: string): string | undefined => {
  const lang = getLanguageByName(language);
  return lang ? lang.code : undefined;
};

export const getUniqueLanguages = (): Language[] => {
  return languageObjects.sort((a, b) => a.language.localeCompare(b.language)).filter((lang, index, array) => {
    return array.findIndex((l) => l.language === lang.language) === index;
  });
}

export const getRegionsByLanguageCode = (code: string): Language[] => {
  let language = getLanguageByCode(code)?.language;
  return languageObjects.filter((lang) => lang.language === language);
}