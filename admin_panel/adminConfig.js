import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSExpress from "@adminjs/express";
import khokhaEntryResource from './resources/entryResource.js';
import {authenticate} from "./auth.js";
import {default as connectMongoDBSession} from "connect-mongodb-session";
import session from "express-session";
import adminResource from "./resources/adminResource.js";


AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
    resources: [khokhaEntryResource, adminResource],
    rootPath: process.env.BASE_URL + '/admin',
    loginPath: process.env.BASE_URL + '/admin/login',
    logoutPath: process.env.BASE_URL + '/admin/logout',
    authenticate
});

const MongoDBStore = connectMongoDBSession(session);
const sessionStore = new MongoDBStore({
    uri: process.env.DATABASE_URI + '/' + process.env.DATABASE_NAME,
    collection: 'userSessions'
});

export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs,
    {
        cookieName: 'adminjs',
        cookiePassword: process.env.ADMIN_PANEL_COOKIE_SECRET,
        authenticate
    },
    null,
    {
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
        },
        resave: false,
        saveUninitialized: true
    }
);
