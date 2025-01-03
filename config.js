import { getGoogleMapsApiKey } from './apiKeys.js';

const config = {
    GOOGLE_MAPS_API_KEY: null
};

// Initialize config
export const initConfig = async () => {
    config.GOOGLE_MAPS_API_KEY = await getGoogleMapsApiKey();
    return config;
};

export default config; 