// const axios = require('axios');
import axios from 'axios';
// const { onestopUserEndpoint } = require("../shared/constants");
import { onestopUserEndpoint } from '../shared/constants.js';

export const getOnestopUser = async(authHeader, onestopSecurityKey) => {
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