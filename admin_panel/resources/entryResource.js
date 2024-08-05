import KhokhaEntryModel from "../../models/KhokhaEntryModel.js";
import {entryResourceProperties} from "../../shared/constants.js";

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
            new: {isAccessible: isDevEnv},
            edit: {isAccessible: isDevEnv},
            delete: {isAccessible: isDevEnv},
            filterTime: {
                actionType: 'resource',
                icon: 'Filter',
                handler: async (request, response, context) => {
                    const tenThirtyPM = new Date();
                    tenThirtyPM.setHours(22, 30, 0, 0);

                    const entries = await KhokhaEntryModel.find({
                        $or: [
                            { checkInTime: null },
                            { checkInTime: { $gt: tenThirtyPM } }
                        ],
                    });

                    context.records = entries.map(entry => new context.record(entry));

                    return {
                        records: context.records,
                    };
                },
                component: false, // Since this is a server-side action, no need for a custom component
                label: 'Filter Late Entries',
            },
        },
    },
}