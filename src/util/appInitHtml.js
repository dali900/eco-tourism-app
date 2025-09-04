import apps from "../constants/apps"
/**
 * Set header info before app gets rendered
 */
export const setHtmlHeader = () => {
    let appExists = false;
    let title = "Selo na 3 klika";
    let tabIcon = "/images/app-logo3.png";
    let appFound = false;

    const host = window.location.host;
    for (const appName in apps) {
        if (apps.hasOwnProperty(appName)) {
            const app = apps[appName];
            const names = app.alias;
            for (const nameKey in names) {
                const alias = names[nameKey]
                if (host.includes(alias)) {
                    appExists = true;
                    title = app.title;
                    tabIcon = app.tabIcon;
                    appFound = true;
                }
            }
        }
        if (appFound) {
            break;
        }
    }

    if (!appExists) {
        console.error("appInitHtml.js missing new app. App '"+host+"' not defined.");
        //define app in /constants/apps.js
    }

    //Head params
    document.title = title;
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = tabIcon;
}