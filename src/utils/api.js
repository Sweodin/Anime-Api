import axios from 'axios';

export const API_BASE_URL = 'https://api.jikan.moe/v4';

export const searchAnime = async (searchParams) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/anime`, {
            params: {
                ...searchParams,
                limit: 10,
                sfw: true
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching anime:', error);
        throw error;
    }
};

export const fetchGenres = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/genres/anime`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
};
