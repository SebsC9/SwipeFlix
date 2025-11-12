import axios from "axios";

//Uso de axios para simplificar la url, timouts y los parametros, como apikey y el lenguaje usado
const tmdb = axios.create({
    baseURL: import.meta.env.VITE_TMDB_BASE_URL,
    timeout: 5000,
    params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: import.meta.env.VITE_TMDB_LANG,
    },
});

export { tmdb };