const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // creator: { type: String, required: true},
  title: { type: String, required: true },
  summary: { type: String, required: true },
  imagePath: { type: String, required: true },
  assignee: { type: String, required: false },
  bugStatus: { type: String, required: false }
});

module.exports = mongoose.model("Report", reportSchema);
