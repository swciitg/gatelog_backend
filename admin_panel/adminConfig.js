import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSExpress from "@adminjs/express";
import khokhaEntryResource from './resources/entryResource.js';
import { componentLoader, Components } from "./ui/loader.js";
import dotenv from 'dotenv';
dotenv.config();

AdminJS.registerAdapter(AdminJSMongoose);


const authenticate = async(email, password) => {
    try {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            return Promise.resolve({ email });
        } 
    } catch (error) {
        return Promise.reject(error);
    }
}


export const adminJs = new AdminJS({
    resources: [khokhaEntryResource],
    componentLoader: componentLoader,
    dashboard: {component: Components.Dashboard},
    branding: {
        companyName: "GateLog IITG",
        logo: false,
        withMadeWithLove: false,
    },
    rootPath: process.env.BASE_URL + '/admin',
    loginPath: process.env.BASE_URL + '/admin/login',
    logoutPath: process.env.BASE_URL + '/admin/logout',
});

adminJs.watch();

export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
        cookiePassword: process.env.ADMIN_PANEL_COOKIE_SECRET,
        authenticate
    },
    null,
    {
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // 1 day
          },
        resave: false, saveUninitialized: true
    }
);
