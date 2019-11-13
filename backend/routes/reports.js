const express = require("express");

const ReportController = require("../controllers/reports");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, ReportController.createReport);
router.put("/:id", checkAuth, extractFile, ReportController.updateReport);
router.get("", ReportController.getReports);
router.get("/:id", ReportController.getReport);
router.delete("/:id", checkAuth, ReportController.deleteReport);

module.exports = router;
