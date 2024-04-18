import KhokhaEntryModel from '../models/khokhaEntryModel.js'

export const khokhaHistoryController = {
    userHistory: async (req, res, next) => {
        const rollNo = req.params.rollno;
        try {
            const history = await KhokhaEntryModel.findOne({ rollNo: rollNo });
            if (!history) {
                return res.status(404).json({ message: "No History" });
            } else {
                return res.status(200).json(history);
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal Server error" });
        }
    }
}
