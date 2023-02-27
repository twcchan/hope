const controller = require("../controllers/student.controller.js");

module.exports = app => {

  var router = require("express").Router();

  // Suspend student
  router.post("/suspend", controller.suspend);

  app.use('/api', router);
};