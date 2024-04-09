const axios = require('axios');
const { onestopUserEndpoint } = require("../shared/constants");

exports.getOnestopUser = async(authHeader, onestopSecurityKey) => {
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