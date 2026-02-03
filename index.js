import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;
const API_URL = "https://covers.openlibrary.org/b/olid/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

let items = [];

async function getItems(sort, order) {
  try {
    let result = await db.query(
      `
      SELECT * 
      FROM books as b 
      JOIN read_books AS rb 
      ON b.id = rb.book_id 
      ORDER BY ${sort} ${order}
      `,
    );

    let data = result.rows;
    data.forEach((item) => {
      item.cover = API_URL + item.ol_id + "-M.jpg";
    });

    return data;
  } catch (err) {
    console.log("Failed to fetch items from database.", err);
  }
}

async function getBookId(title) {
  try {
    let result = await db.query(
      `
      SELECT id 
      FROM books 
      WHERE LOWER(books.title) = LOWER($1)
      `,
      [title],
    );
    return result.rows[0]["id"];
  } catch (err) {
    console.log("Failed to get book ID. Please check the book title.", err);
  }
}

app.get("/", async (req, res) => {
  let { sort = "date_read", order = "ASC" } = req.query;

  items = await getItems(sort, order);

  res.render("index.ejs", { listItems: items, sort, order });
});

app.get("/api/search", async (req, res) => {
  let { q } = req.query;
  if (!q || q.length < 2) {
    return res.json([]);
  }

  try {
    let result = await db.query(
      `
      SELECT title
      FROM books
      WHERE title ILIKE $1
      `,
      [`%${q}%`],
    );
    res.json(result.rows);
  } catch (err) {
    console.log("Failed to fetch suggestions", err);
    res.status(500).json([]);
  }
});

app.post("/add", async (req, res) => {
  console.log(req.body);

  let { title, date, rating, review } = req.body;
  let bookId = await getBookId(title);

  try {
    await db.query(
      `
      INSERT INTO read_books (date_read, rating, review, book_id) 
      VALUES ($1, $2, $3, $4)
      `,
      [date, rating, review, bookId],
    );
  } catch (err) {
    console.log("Failed to add book to database.", err);
  }

  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  let { id, date, rating, review } = req.body;
  console.log("target is ", req.body);

  try {
    await db.query(
      `
      UPDATE read_books
      SET date_read = $1, rating = $2, review = $3
      WHERE id = $4
      `,
      [date, rating, review, id],
    );
    res.redirect("/");
  } catch (err) {
    console.log("Failed to update record", err);
  }
});

app.post("/delete", async (req, res) => {
  let target = req.body.targetId;

  try {
    await db.query("DELETE FROM read_books WHERE id = $1", [target]);
    res.redirect("/");
  } catch (err) {
    console.log("Failed to delete record.", err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
