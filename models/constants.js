exports.onestopUserEndpoint = 'https://swc.iitg.ac.in' + 
    (process.env.NODE_ENV === 'dev' ? '/test' : '') + '/onestop/api/v3/user';

exports.guestOutlookEmail = 'guest@onestop.swc.iitg.ac.in';
