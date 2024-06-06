import KhokhaEntryModel from "../models/KhokhaEntryModel.js";

export const khokhaHistoryController = {
  userHistory: async (req, res, _next) => {
    try {
      const onestopUser = req.user.outlookEmail;

      let { page, size, sort } = req.query;
      if (!page) page = 1;
      if (!size) size = 10;
      const limit = parseInt(size);
      const skip = (parseInt(page) - 1) * limit;
      const history = await KhokhaEntryModel.find({ outlookEmail: onestopUser })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      if (history.length === 0) {
        return res.status(404).json({ message: "No History" });
      } else {
        return res.status(200).send({
          page: parseInt(page),
          size: limit,
          totalPages: Math.ceil(history.length / limit),
          history,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server error" });
    }
  },
};
