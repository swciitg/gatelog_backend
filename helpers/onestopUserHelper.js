const axios = require('axios');
const { onestopUserEndpoint } = require("../shared/constants");

exports.getOnestopUser = async(authHeader, onestopSecurityKey) => {
    const res = await axios.get(onestopUserEndpoint, {
        headers: {
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2NGM3NWM4YWE2ZDE3ZWE0NTYyM2M5ODIiLCJpYXQiOjE3MTE0MjkxMjIsImV4cCI6MTcxMjI5MzEyMn0.VvDrXXH6duBVVopthvutOGyUxW_w7JI5BfObBBoAII4",
            // "authorization": authHeader,
            "security-key": "OneStop-Test"
            // "security-key": onestopSecurityKey,
        },
    });
    
    return {
        success: true,
        user: res.data
    };
}