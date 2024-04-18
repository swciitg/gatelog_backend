import KhokhaEntryModel from "../../models/KhokhaEntryModel.js";
import verifyRoles from '../utils.js';
import {entryResourceProperties} from "../../shared/constants.js";
import roles from '../roles.js';

const allowedRoles = [roles.KHOKHA_ENTRY, roles.SUPER_ADMIN];

export default {
    resource: KhokhaEntryModel,
    options: {
        listProperties: entryResourceProperties,
        filterProperties: entryResourceProperties,
        editProperties: entryResourceProperties,
        showProperties: entryResourceProperties,
        actions: {
            list: {isAccessible: ({currentAdmin}) => verifyRoles(currentAdmin, allowedRoles)},
            new: {isAccessible: ({currentAdmin}) => verifyRoles(currentAdmin, allowedRoles)},
            filter: {isAccessible: ({currentAdmin}) => verifyRoles(currentAdmin, allowedRoles)},
            edit: {isAccessible: ({currentAdmin}) => verifyRoles(currentAdmin, allowedRoles)},
            delete: {isAccessible: ({currentAdmin}) => verifyRoles(currentAdmin, allowedRoles)},
        },
    },
}