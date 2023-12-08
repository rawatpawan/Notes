const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3001;

const router = express.Router();

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "note_app",
});

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL: " + err.stack);
//     return;
//   }
//   console.log("Connected to MySQL as id " + db.threadId);
// });

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Use the router for all /api/notes routes
app.use("/api/notes", router);

// Create a notes table if not exists
db.query(
  "CREATE TABLE IF NOT EXISTS notes (id VARCHAR(36) PRIMARY KEY, title VARCHAR(255), body TEXT, lastModified BIGINT)",
  (err) => {
    if (err) throw err;
    console.log("Table created or already exists");
  }
);

// API routes using express.Router
router.post("/", (req, res) => {
  const { id, title, body, lastModified } = req.body;
  const query = "INSERT INTO notes (id, title, body, lastModified) VALUES (?, ?, ?, ?)";
  const values = [id, title, body, lastModified];

  db.query(query, values, (err, result) => {
    if (err) throw err;
    res.json({ id, title, body, lastModified });
  });
});

router.get("/", (req, res) => {
  const query = "SELECT * FROM notes";

  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.put("/:id", (req, res) => {
  const { title, body, lastModified } = req.body;
  const { id } = req.params;
  const query = "UPDATE notes SET title=?, body=?, lastModified=? WHERE id=?";
  const values = [title, body, lastModified, id];

  db.query(query, values, (err, result) => {
    if (err) throw err;
    res.json({ id, title, body, lastModified });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM notes WHERE id=?";

  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.json({ id });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
