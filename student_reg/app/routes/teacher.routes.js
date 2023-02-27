const controller = require("../controllers/teacher.controller.js");

module.exports = app => {

  var router = require("express").Router();

  // Add routes here

  app.use('/api', router);
};