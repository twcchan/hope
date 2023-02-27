const controller = require("../controllers/profile.controller.js");
const authJwt = require("../middleware/authJwt.js");

module.exports = app => {

  var router = require("express").Router();

  // Create a profile
  router.post("/register", controller.create);

  // Login
  router.post("/login", controller.login);

  // Change profile password
  router.post("/actions/changepassword", authJwt.verifyToken, controller.changePassword);

  // Find profile by username
  router.get("/profiles", authJwt.verifyToken, controller.findOne);

  app.use('/api', router);
};