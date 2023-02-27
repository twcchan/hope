const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../config/auth.config.js");
const db = require("../models");
const Profile = db.profiles;

// Create a profile
exports.create = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // Validate inputs
    if (!username) {
      return res.status(400).send({ message: "Please provide username." });
    }

    if (!email) {
      return res.status(400).send({ message: "Please provide email." });
    }

    if (!password) {
      return res.status(400).send({ message: "Please provide password." });
    }

    // Hash the password as we can't save the password directly to the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a profile
    const profile = new Profile({
      username: username,
      email: email,
      password: hashedPassword
    });

    // Save the profile to the database
    profile.save(profile)
      .then(data => {
        res.status(204).send();
      })
      .catch(err => {
        if (err.message.startsWith("E11000")) {
          res.status(500).send({ message: "Username / email was registered already." });
        } else {
          res.status(500).send({ message: err.message || "Error occurred while persisting a profile." });
        }
      });
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error occurred while creating a profile." });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    // Get the profile by username from the database
    const profile = await Profile.findOne({ username: username })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error occurred while getting a profile." });
      });

    // For sercurity reason, we can't tell exactly if it is a problem with username or password 
    if (!profile) {
      return res.status(400).send({ message: "Username / password is not correct." });
    }

    // Compare the password against the hashed one in the database
    if (!bcrypt.compareSync(password, profile.password)) {
      return res.status(400).send({ message: "Username / password is not correct." });
    }

    // Create a token, which is valid within 24 hours
    const token = jwt.sign({ username: profile.username }, config.secret, { expiresIn: '24h' });

    // Return the token
    return res.status(200).send({
      Token: token
    });
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error occurred while logging in." });
  }
};

// Change profile password
exports.changePassword = async (req, res) => {
  try {
    const username = req.username;
    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password;

    // Validate inputs
    if (!username) {
      return res.status(400).send({ message: "Please provide username." });
    }

    if (!oldPassword) {
      return res.status(400).send({ message: "Please provide old password." });
    }

    if (!newPassword) {
      return res.status(400).send({ message: "Please provide new password." });
    }

    // Get the profile by username from the database
    const profile = await Profile.findOne({ username: username })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error occurred while getting a profile." });
      });

    // For sercurity reason, we can't tell exactly if it is a problem with username or password 
    if (!profile) {
      return res.status(400).send({ message: "Username / password is not correct." });
    }

    // Compare the password against the hashed one in the database
    if (!bcrypt.compareSync(oldPassword, profile.password)) {
      return res.status(400).send({ message: "Username / password is not correct." });
    }

    // Hash the password as we can't save the password directly to the database
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    // Update password
    Profile.findOneAndUpdate({ username: username }, { password: hashedNewPassword })
      .then(data => {
        res.status(200).send();
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error occurred while updating a profile." });
      });
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error occurred while changing password." });
  }
};

// Find profile by username
exports.findOne = async (req, res) => {
  try {
    const username = req.username;

    // Validate inputs
    if (!username) {
      return res.status(400).send({ message: "Please provide username." });
    }

    // Get the profile by username from the database
    const profile = await Profile.findOne({ username: username })
      .catch(err => {
        res.status(500).send({ message: err.message || "Error occurred while getting a profile." });
      });

    // For sercurity reason, we can't tell exactly if it is a problem with username or password 
    if (!profile) {
      return res.status(400).send({ message: "Username / password is not correct." });
    }

    // Return profile information
    return res.status(200).send({
      username: profile.username,
      email: profile.email
    });
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error occurred while finding profile." });
  }
};