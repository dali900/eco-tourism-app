import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

export const http = axios.create({
    withCredentials: true,
    baseURL: baseUrl,
    headers: { 
        "X-Requested-With": "XMLHttpRequest", 
        "withCredentials": "true",
        "Access-Control-Allow-Origin": "*"
},
});

/**
 * Save access token in local storage
 * @param {strin} token 
 */
export const storeAuthToken = (token) => {
    localStorage.setItem('_actamedia', token);
    loadAuthToken();
}

/**
 * Insert current access token in the current axios instance headers
 */
export const loadAuthToken = () => {
    setAuthToken(localStorage.getItem('_actamedia'))
}

/**
 * Get access token from local storage
 * @returns string
 */
export const getAuthToken = () => {
    return localStorage.getItem('_actamedia');
}

/**
 * Set the access token from local storage to the current axios instance headers
 * @param {strin} token 
 */
export const setAuthToken = (token) => {
    console.log("setAuthToken", {token});
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/**
 * Delete access token from local storage
 */
export const removeAuthToken = () => {
    localStorage.removeItem('_actamedia');
}

export const parseFilterParams = (params = {}) => {
    const {
        sort = null, 
        pagination = null, 
        filters = []
    } = params;
    const data = {
        params: {}//url query values
    };
    if(sort && sort.sortField && sort.sortField !== "") data.params.sortField = sort.sortField;
    if(sort && sort.sortOrder && sort.sortOrder !== "") data.params.sortOrder = sort.sortOrder;
    if(pagination && pagination.page) data.params.page = pagination.page;
    if(pagination && pagination.perPage) data.params.perPage = pagination.perPage;

    for (const key in filters) {
        const filter = filters[key];
        if(filter && filter.value !== "") {
            data.params[key] = filter.value;
            data.params[key+"_MatchMode"] = filter.matchMode;
        }
    }
    return data;
}

export const fillFormErrors = (errorFields, error) => {
    const defaultMessage = error.response.data.message;
    const errors = error.response.data.errors;
    if(error.response.status == 422){
        for (const key in errorFields) {
            if(errors && errors[key] && errors[key][0] !== "") {
                errorFields[key] = errors[key][0];
            }
        }
    }
    errorFields.default = defaultMessage;
    return errorFields;
}

export const downloadFile = async (url="", data=null, downloadName = "document.docx") => {
    try {
        const response = await axios({
            headers: { 
                "X-Requested-With": "XMLHttpRequest", 
                "withCredentials": "true",
                "Authorization": "Bearer " + getAuthToken()
            },
            withCredentials: true,
            url: baseUrl + url,           
            method: 'POST',           
            responseType: 'blob',       
            data: data    
        });
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));           
        var fileLink = document.createElement('a');
    
        if(response.headers['download-name'])
        {
            downloadName = response.headers['download-name'];
        }
    
        fileLink.href = fileURL;           
        fileLink.setAttribute('download', downloadName);           
        document.body.appendChild(fileLink);
    
        fileLink.click();
        fileLink.remove();           
    } catch (error) {
        console.log(error);
    }
};