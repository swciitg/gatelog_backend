import { ComponentLoader } from "adminjs";

export const componentLoader = new ComponentLoader();

export const Components = {
    Dashboard: componentLoader.add("Dashboard", "./pages/dashboard.jsx"),
    // other custom components
};
