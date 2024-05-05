/**
 * Get current admin scope, selected app.
 * @returns string
 */
export const getSelectedApp = () => {
    return localStorage.getItem('selectedApp') || 'exportinfo';
}

/**
 * Set admin scope, select app.
 * @returns void
 */
export const setSelectedApp = (app) => {
    localStorage.setItem("selectedApp", app);
}