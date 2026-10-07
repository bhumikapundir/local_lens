import api from './api';

export const getNearbyFeed = async ({
    latitude,
    longitude,
    radius_km = 5,
    category,
    page = 1,
    limit = 10,
}) => {
    const params = {
        latitude,
        longitude,
        radius_km,
        page,
        limit,
    };

    if (category) {
        params.category = category;
    }

    const res = await api.get('/posts/feed', { params });

    return res.data;
};