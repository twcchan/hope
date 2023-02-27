const db = require("../models");
const Registration = db.registrations;
const Teacher = db.teachers;
const Student = db.students;

// Register students with a teacher
exports.create = async (req, res) => {
  try {
    const teacherEmail = req.body.teacher;
    const studentEmails = req.body.students;

    // Validate inputs
    if (!teacherEmail) {
      return res.status(400).send({ message: "Please provide teacher email." });
    }

    if (!studentEmails || studentEmails.length <= 0) {
      return res.status(400).send({ message: "Please provide student emails." });
    }

    for (let i = 0; i < studentEmails.length; i++) {
      if (!studentEmails[i]) {
        return res.status(400).send({ message: "Please provide student email." });
      }
    }

    // Create a teacher
    const teacher = new Teacher({
      email: teacherEmail
    });

    // Create students
    const students = [studentEmails.length];
    for (let i = 0; i < studentEmails.length; i++) {
      students[i] = new Student({
        email: studentEmails[i]
      });
    }

    // Create registrations
    const registrations = [studentEmails.length];
    for (let i = 0; i < studentEmails.length; i++) {
      registrations[i] = new Registration({
        teacherEmail: teacherEmail,
        studentEmail: studentEmails[i]
      });
    }

    // Save the teacher to the database
    teacher.save(teacher)
      .then(data => {

      })
      .catch(err => {
        if (err.message.startsWith("E11000")) {
          console.log("Info: duplicate teacher ignored");
        } else {
          res.status(500).send({ message: err.message || "Error occurred while persisting a teacher." });
        }
      });

    // Save the students to the database
    Student.insertMany(students, { ordered: false }) // unordered insert - inserting others even duplicate key error occurred
      .then(data => {

      })
      .catch(err => {
        if (err.message.startsWith("E11000")) {
          console.log("Info: duplicate student(s) ignored");
        } else {
          res.status(500).send({ message: err.message || "Error occurred while persisting students." });
        }
      });

    // Save the registrations to the database
    Registration.insertMany(registrations, { ordered: false }) // unordered insert - inserting others even duplicate key error occurred
      .then(data => {
        res.status(204).send();
      })
      .catch(err => {
        if (err.message.startsWith("E11000")) {
          res.status(204).send();
          console.log("Info: duplicate registration(s) ignored");
        } else {
          res.status(500).send({ message: err.message || "Error occurred while persisting registrations." });
        }
      });
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error occurred while registering." });
  }
};

// Find common students by teacher
exports.findCommonStudents = async (req, res) => {
  try {
    if (!(req.query.teacher instanceof Object)) {
      // One teacher only from the query string
      const teacherEmail = req.query.teacher;

      // Validate inputs
      if (!teacherEmail) {
        return res.status(400).send({ message: "Please provide teacher email." });
      }

      // Get the students by teacher from the database
      Registration.find({ teacherEmail: teacherEmail })
        .then(data => {
          res.status(200).send({
            students: getStudentEmailsFromRegistrationsAsArray(data)
          })
        })
        .catch(err => {
          res.status(500).send({ message: err.message || "Error occurred while getting registrations." });
        });

    } else {
      // Multiple teachers from the query string (assumming they are unquie)
      const teacherEmails = req.query.teacher;

      // Validate inputs
      for (let i = 0; i < teacherEmails.length; i++) {
        if (!teacherEmails[i]) {
          return res.status(400).send({ message: "Please provide teacher email." });
        }
      }

      // Get registerations by teacher from the database
      Registration.find({ teacherEmail: teacherEmails })
        .then(data => {
          res.status(200).send({
            students: getCommonStudentEmailsAsArray(teacherEmails, data)
          })
        })
        .catch(err => {
          res.status(500).send({ message: err.message || "Error occurred while getting registrations." });
        });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error occurred while finding common students." });
  }
};

// Get the student emails from the registrations as an array
getStudentEmailsFromRegistrationsAsArray = (registrations) => {
  var studentEmails = [];
  for (let i = 0; i < registrations.length; i++) {
    studentEmails[i] = registrations[i].studentEmail;
  }
  return studentEmails;
}

// Get the commond student emails from the registrations as an array
// Assumming the teacher emails from the query string are unquie
// Based on the schema, the registrations should be unquie
// Common students are those with the number of teachers == the number of teachers inputted from the query string
getCommonStudentEmailsAsArray = (teacherEmailsFromQuery, registrations) => {
  var studentEmails = [];
  var studentTeacherCount = [];

  for (let i = 0; i < registrations.length; i++) {
    const studentEmail = registrations[i].studentEmail;

    if (!studentTeacherCount[studentEmail]) {
      studentTeacherCount[studentEmail] = 1;
    } else {
      studentTeacherCount[studentEmail]++;
    }

    if (studentTeacherCount[studentEmail] == teacherEmailsFromQuery.length) {
      studentEmails[studentEmails.length] = studentEmail;
    }
  }

  return studentEmails;
}

// Get the student emails from the students as an array
getStudentEmailsFromStudentsAsArray = (students) => {
  var studentEmails = [];
  for (let i = 0; i < students.length; i++) {
    studentEmails[i] = students[i].email;
  }
  return studentEmails;
}

// Get the mentioned emails from the content as an array
getMentionedEmails = (content) => {
  // extract mentioned like @studentagnes@example.com @studentmiche@example.com from the content
  var mentioned = content.match(/(@[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

  if (mentioned) {
    for (let i = 0; i < mentioned.length; i++) {
      // remove the leading '@'
      mentioned[i] = mentioned[i].substring(1);
    }
  } else {
    mentioned = [];
  }

  return mentioned;
}

// Combine and deduplicate the arrarys
getDistinctArray = (array1, array2) => {
  var distinctArray = [];
  var valueExists = [];

  if (array1) {
    for (let i = 0; i < array1.length; i++) {
      if (!valueExists[array1[i]]) {
        valueExists[array1[i]] = 1; // mark the value as exists
        distinctArray[distinctArray.length] = array1[i];
      }
    }
  }

  if (array2) {
    for (let i = 0; i < array2.length; i++) {
      if (!valueExists[array2[i]]) {
        valueExists[array2[i]] = 1; // mark the value as exists
        distinctArray[distinctArray.length] = array2[i];
      }
    }
  }

  return distinctArray;
}

// Find students receiving notification
exports.findReceivingNotification = async (req, res) => {
  try {
    const teacherEmail = req.body.teacher;
    const notification = req.body.notification;

    // Validate inputs
    if (!teacherEmail) {
      return res.status(400).send({ message: "Please provide teacher email." });
    }

    if (!notification) {
      return res.status(400).send({ message: "Please provide notification." });
    }

    // Get registerations by teacher from the database
    const registerations = await Registration.find({ teacherEmail: teacherEmail })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error occurred while getting registrations." });
      });

    // Student email list
    const studentEmails = getStudentEmailsFromRegistrationsAsArray(registerations);

    // Get students by suspended flag from the database
    const students = await Student.find({ email: studentEmails, suspended: false })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error occurred while getting students." });
      });

    // Combine the student email lists
    const studentEmailsWithoutSuspension = getStudentEmailsFromStudentsAsArray(students);
    const studentEmailsFromNotification = getMentionedEmails(notification);
    const recipients = getDistinctArray(studentEmailsWithoutSuspension, studentEmailsFromNotification);

    // Return the recipients
    return res.status(200).send({
      recipients: recipients
    });

  } catch (err) {
    return res.status(500).send({ message: err.message || "Error occurred while finding students receiving notification." });
  }
};