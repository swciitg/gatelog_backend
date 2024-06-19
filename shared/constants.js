export const onestopUserEndpoint = 'https://swc.iitg.ac.in' +
    (process.env.NODE_ENV === 'dev' ? '/test' : '') + '/onestop/api/v3/user';

export const guestOutlookEmail = 'guest@onestop.swc.iitg.ac.in';

export const entryResourceProperties = [
    "name", "rollNumber", "outlookEmail", "phoneNumber",
    "hostel", "roomNumber", "destination", "checkOutTime",
    "checkOutGate", "checkInTime", "checkInGate", "isClosed"
];

export const adminResourceProperties = ["email", "password", "roles"];

export const guestUserEmail = "guest@onestop.swc.iitg.ac.in";