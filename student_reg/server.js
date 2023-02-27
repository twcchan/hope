// App
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;

var corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Hi! This is HOPE." });
});

require("./app/routes/registration.routes")(app);
require("./app/routes/student.routes")(app);
require("./app/routes/teacher.routes")(app);

app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}.`);
});

// DB
const db = require("./app/models");

db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to the database.");
    })
    .catch(err => {
        console.log("Cannot connect to the database.", err);
        process.exit();
    });
