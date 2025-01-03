const url = 'http://localhost:8000/google-api'
const requestData = {
    key: 'NaIus'
}

// Create a promise that resolves with the API key
export const getGoogleMapsApiKey = async () => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        const responseData = await response.json();
        return responseData.apiKey;
    } catch (error) {
        console.error('Error fetching API key:', error);
        throw error;
    }
};
