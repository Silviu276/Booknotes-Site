import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3500;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "booknotes",
    password: "...",
    port: 4000,
  });
db.connect();
var posts = [];

let lastId = 3;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET all posts
app.get("/posts", async (req, res) => {
  posts = (await db.query("SELECT * FROM books")).rows;
  res.json(posts);
});

// GET a specific post by id
app.get("/posts/:id", async (req, res) => {
  const post = (await db.query("SELECT * FROM books WHERE id = $1", [parseInt(req.params.id)])).rows;
  if(!post)
    return res.status(404);
  res.json(post[0]);
});

// POST a new post
app.post("/posts", async (req, res) => {
  await db.query("SELECT setval(pg_get_serial_sequence('books', 'id'), max(id)) FROM books;");
  await db.query("INSERT INTO books(title, description, rating) VALUES($1, $2, $3)", [req.body.title, req.body.description, req.body.rating]);
  const newPost = (await db.query("SELECT * FROM books WHERE id = $1", [posts.length+1]));
  console.log(newPost);
  console.log(req.body);
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.patch("/posts/:id", async (req, res) => {
  const post = (await db.query("SELECT * FROM books WHERE id = $1", [parseInt(req.params.id)])).rows;
  if (!post) return res.status(404).json({ message: "Book not found" });
  if(req.body.title) post.title = req.body.title;
  if(req.body.description) post.description = req.body.description;
  if(req.body.rating) post.rating = req.body.rating;
  await db.query("UPDATE books SET title = $1, description = $2, rating = $3 WHERE id = $4", [post.title, post.description, post.rating, req.params.id]);
  res.json(post);
});

// DELETE a specific post by providing the post id
app.delete("/posts/:id", async (req, res) => {
  await db.query("DELETE FROM books WHERE id = $1", [req.params.id]);
  res.json({ message: "Post deleted" });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
