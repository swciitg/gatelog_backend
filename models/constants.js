exports.onestopUserEndpoint = 'https://swc.iitg.ac.in' + 
    (process.env.NODE_ENV === 'dev' ? '/test' : '') + '/onestop/api/v3/user';

exports.guestOutlookEmail = 'guest@onestop.swc.iitg.ac.in';

const Hostels = {
    Brahmaputra: "Brahmaputra",
    Kameng: "Kameng",
    Dihing: "Dihing",
    Barak: "Barak",
    Kapili: "Kapili",
    Lohit: "Lohit",
    Manas: "Manas",
    MarriedScholarsMen: "Married Scholars (Men)",
    MarriedScholarsWomen: "Married Scholars (Women)",
    Siang: "Siang",
    Subansiri: "Subansiri",
    Umiam: "Umiam",
    Dhansiri: "Dhansiri",
    DisangMen: "Disang (Men)",
    DisangWomen: "Disang (Women)"
};

const Branch={
    CSE:"Computer Science and Engineering",
    DSAI:"Data Science and Artificial Engineering",
    MNC:"Mathematics and Computing",
    EEE:"Electronics and Electrical Engineering",
    ECE:"Electronics and Communication Engineering",
    MECH:"Mechanical Engineering",
    PHY:"Engineering Physics",
    CIVIL:"Civil Engineering",
    CST:"Chemical Science and Technology",
    CL:"Chemical Engineering",
    DOD:"Department of Design",
    HSS:"Humanities and Social Science",
    BSBE:"Bioscience and Bioengineering"
};

const Program={
    bTech:"B.Tech",
    bDes:"B.Des",
    mTech:"M.Tech",
    mDes:"M.Des",
    mba:"MBA",
    ma:"MA",
    mSc:"MSc",
    dualPhD:"PhD (Dual)",
    phD:"PhD"
}

module.exports = { Hostels, Branch, Program,onestopUserEndpoint };