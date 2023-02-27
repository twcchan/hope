const db = require("../models");
const Student = db.students;

// Suspend a student
exports.suspend = async (req, res) => {
  try {
    const studentEmail = req.body.student;

    // Validate inputs
    if (!studentEmail) {
      return res.status(400).send({ message: "Please provide student email." });
    }

    // Update the suspended flag
    Student.findOneAndUpdate({ email: studentEmail }, { suspended: true })
      .then(data => {
        res.status(204).send();
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error occurred while updating student." });
      });
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error occurred while suspending student." });
  }
};