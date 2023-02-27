const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const dbConfig = require("../config/db.config.js");

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.registrations = require("./registration.model.js")(mongoose);
db.students = require("./student.model.js")(mongoose);
db.teachers = require("./teacher.model.js")(mongoose);

module.exports = db;