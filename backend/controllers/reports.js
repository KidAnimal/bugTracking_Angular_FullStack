const Report = require("../models/report");

exports.createReport = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const report = new Report({
    title: req.body.title,
    summary: req.body.summary,
    imagePath: url + "/images/" + req.file.filename,
    creatorId: req.userData.userId,
    userName: req.userData.userName,
    assignee: req.body.assignee,
    bugStatus: req.body.bugStatus
  });
  report
    .save()
    .then(createdReport => {
      res.status(201).json({
        message: "Report added successfully",
        report: {
          ...createdReport,
          id: createdReport._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Creating a report failed!"
      });
    });
};

exports.updateReport = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const report = new Report({
    _id: req.body.id,
    title: req.body.title,
    summary: req.body.summary,
    assignee: req.body.assignee,
    imagePath: imagePath,
    creatorId: req.userData.userId,
    // userName: req.userData.userName,
    assignee: req.body.assignee,
    bugStatus: req.body.bugStatus
  });
  Report.updateOne({ _id: req.params.id, creatorId: req.userData.userId }, report)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate report!"
      });
    });
};

exports.getReports = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const reportQuery = Report.find();
  let fetchedReports;
  if (pageSize && currentPage) {
    reportQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  reportQuery
    .then(documents => {
      fetchedReports = documents;
      return Report.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Reports fetched successfully!",
        reports: fetchedReports,
        maxReports: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching reports failed!"
      });
    });
};

exports.getReport = (req, res, next) => {
  Report.findById(req.params.id)
    .then(report => {
      if (report) {
        res.status(200).json(report);
      } else {
        res.status(404).json({ message: "Report not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching report failed!"
      });
    });
};

exports.deleteReport = (req, res, next) => {
  Report.deleteOne({ _id: req.params.id, creatorId: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting reports failed!"
      });
    });
};
