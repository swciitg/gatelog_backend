import { BulkDelete } from "adminjs";
import KhokhaEntryModel from "../../models/KhokhaEntryModel.js";
import {entryResourceProperties} from "../../shared/constants.js";
import importExportFeature from "@adminjs/import-export";
import { componentLoader } from "../ui/loader.js";

const isDevEnv = process.env.NODE_ENV === 'dev';

export default {
    resource: KhokhaEntryModel,
    options: {
        listProperties: entryResourceProperties,
        filterProperties: entryResourceProperties,
        editProperties: entryResourceProperties,
        showProperties: entryResourceProperties,
        sort: {
            direction: 'desc',
            sortBy: 'checkOutTime',
        },
        actions: {
            list: {isAccessible: true, },
            new: {isAccessible: true},
            edit: {isAccessible: isDevEnv},
            delete: {isAccessible: isDevEnv},
            bulkDelete: {isAccessible: isDevEnv},
        },
    },
    features: [
        importExportFeature({componentLoader})
    ],
}
