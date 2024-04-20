import axios from 'axios';
import {onestopUserEndpoint} from '../shared/constants.js';

export const getOnestopUser = async (authHeader, onestopSecurityKey) => {
    const res = await axios.get(onestopUserEndpoint, {
        headers: {
            "authorization": authHeader,
            "security-key": onestopSecurityKey,
        },
    });

    return {
        success: true,
        user: res.data
    };
}