const express = require("express");
const movies = require("./movies");
const port = 3000;
const app = express();
const connection = require("./config");



connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});


app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to my favorite movie list");
});


app.get("/api/movies", (req, res) => {
  connection.query("SELECT * from movies", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});


app.get("/api/movies/:id", (req, res) => {
  connection.query(
    `SELECT * from movies WHERE id=`,
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});


app.get("/api/search", (req, res) => {
  connection.query(
    `SELECT * from movies WHERE duration<=?`,
    [req.query.durationMax],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});


app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES(?, ?, ?, ?, ?)",
    [title, director, year, color, duration],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving a movie");
      } else {
        res.status(200).send("Successfully saved");
      }
    }
  );
});


app.put("/api/users/:id", (req, res) => {

  const idUser = req.params.id;


  const newUser = req.body;


  connection.query(
    "UPDATE users SET ? WHERE id = ?",
    [newUser, idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else {
        res.status(200).send("User updated successfully 🎉");
      }
    }
  );
});


app.get("/api/users", (req, res) => {
  res.status(401).send("Unauthorized");
});

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email } = req.body;
  connection.query(
    "INSERT INTO users(firstname, lastname, email) VALUES(?, ?, ?)",
    [firstname, lastname, email],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving a User");
      } else {
        res.status(200).send("Successfully saved");
      }
    }
  );
});
app.listen(port, () => {
  console.log(`Server is runing on 3000`);
});