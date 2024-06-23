import KhokhaEntryModel from "../../models/KhokhaEntryModel.js";
import verifyRoles from '../utils.js';
import {entryResourceProperties} from "../../shared/constants.js";
import roles from '../roles.js';

const readRoles = [roles.KHOKHA_ENTRY, roles.SUPER_ADMIN];
const writeRoles = [roles.SUPER_ADMIN];

export default {
    resource: KhokhaEntryModel,
    options: {
        listProperties: entryResourceProperties,
        filterProperties: entryResourceProperties,
        editProperties: entryResourceProperties,
        showProperties: entryResourceProperties,
        actions: {
            list: {isAccessible: ({currentAdmin}) => verifyRoles(currentAdmin, readRoles)},
            new: {isAccessible: ({currentAdmin}) => verifyRoles(currentAdmin, writeRoles)},
            filter: {isAccessible: ({currentAdmin}) => verifyRoles(currentAdmin, readRoles)},
            edit: {isAccessible: ({currentAdmin}) => verifyRoles(currentAdmin, writeRoles)},
            delete: {isAccessible: ({currentAdmin}) => verifyRoles(currentAdmin, writeRoles)},
        },
    },
}