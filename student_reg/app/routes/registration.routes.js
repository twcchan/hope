const controller = require("../controllers/registration.controller.js");

module.exports = app => {

  var router = require("express").Router();

  // Register students with a teacher
  router.post("/register", controller.create);

  // Find common students by teacher
  router.get("/commonstudents", controller.findCommonStudents);

  // Find students receiving notification
  router.post("/retrievefornotifications", controller.findReceivingNotification);

  app.use('/api', router);
};