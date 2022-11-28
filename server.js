const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
console.log(uuid.v4());

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      return res.json(parsedNotes);
    }
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  const newNote = {
    title,
    text,
    id: uuid.v4(),
  };

  //start here

  // get the db.json

  let data = fs.readFileSync("./db/db.json", "utf-8");
  let post = JSON.parse(data);
  post.push(newNote);
  data = JSON.stringify(post);
  //append the new note to the file
  fs.writeFileSync("./db/db.json", data, "utf-8");
  //

  res.status(200).json(JSON.parse(data));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
