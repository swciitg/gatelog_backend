import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSExpress from "@adminjs/express";
import khokhaEntryResource from './resources/entryResource.js';
import { componentLoader, Components } from "./ui/loader.js";

AdminJS.registerAdapter(AdminJSMongoose);

export const adminJs = new AdminJS({
    resources: [khokhaEntryResource],
    componentLoader: componentLoader,
    dashboard: {component: Components.Dashboard},
    branding: {
        companyName: "GateLog IITG",
        logo: false,
        withMadeWithLove: false,
    },
    env: {
        BASE_URL: process.env.BASE_URL,
    },
    rootPath: process.env.BASE_URL + '/admin'
});

adminJs.watch();

export const adminRouter = AdminJSExpress.buildRouter(adminJs);
