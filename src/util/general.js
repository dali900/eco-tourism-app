import apps from "../constants/apps"

/**
 * Get app name based on the current url
 */
export const getAppNameFromUrl = () => {
    const host = window.location.host;
    for (const appName in apps) {
        if (apps.hasOwnProperty(appName)) {
            const names = apps[appName].alias;
            for (const nameKey in names) {
                const alias = names[nameKey]
                if (host.includes(alias)) {
                    return appName;
                    break;
                }
            }
        }
    }
    return null;
}

/**
 * Get all user portals. Excludes admin from the apps list
 */
export const getUserApps = () => {
    return Object.keys(apps).reduce((acc, key) => {
        if (key !== 'admin') {
            acc[key] = apps[key];
        }
        return acc;
    }, {});
}

export const getUserAppsArray = () => {
    const appsArray = [];
    for (const key in apps) {
        if (key !== 'admin') {
            appsArray.push(apps[key])
        }
    };
    return appsArray;
}

/**
 * Store selected language
 * @param {*} lang 
 */
export const storeLang = (lang) => {
    const langString = JSON.stringify(lang);
    localStorage.setItem('lang', langString);
}


/**
 * Get selected language
 * @returns string
 */
export const getLang = () => {
    let lang = localStorage.getItem('lang');
    if (lang) {
        return JSON.parse(lang);
    }
    return null;
}

/**
 * Get selected language id
 * @returns string
 */
export const getLangId = () => {
    let lang = localStorage.getItem('lang');
    if (lang) {
        return JSON.parse(lang).id;
    }
    return '';
}

/**
 * Get selected language code
 * @returns string
 */
export const getLangCode = () => {
    let lang = localStorage.getItem('lang');
    if (lang) {
        return JSON.parse(lang).lang_code;
    }
    return null;
}