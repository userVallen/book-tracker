# Book Tracker
A server-rendered web application built with Express.js and EJS that allows users to track books they have read and manage their reading records. This project focuses on implementing full CRUD operations, EJS templating, and PostgreSQL database integration.

The application demonstrates how server-side rendering works together with persistent database storage. All book operations (CRUD) are synchronized with the database, ensuring that changes are permanently stored.

This project was created as a part of the fifth capstone project for the [Complete Full-Stack Web Development Bootcamp](https://www.udemy.com/course/the-complete-web-development-bootcamp/) by Angela Yu on Udemy.

## Features
- Allows the user to view, create, edit, and delete book records.
- Peristent data storage with PostgreSQL
- Book covers loaded dynamically using the [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers).
- Built with Express.js, EJS, and vanilla CSS.

## API Endpoints
Below are the routes used in this book tracking application.
### GET /
Renders the homepage and displays all tracked books. All interactions such as adding or editing books are handled through modal forms on this page.
### POST /add
Creates a new book entry and inserts the corresponding records into the database.
```
{
  "title": "And Then There Were None",
  "author": "Agatha Christie",
  "date_read": "2025-08-16",
  "rating": 5,
  "review": "An intriguing detective story!"
}
```
### POST /edit
Updates an existing book entry using data submitted from the edit modal.
### POST /delete
Deletes an existing book entry from the database.

## Database Structure
The application uses PostgreSQL with two related tables:

**books**

Stores the list of available books.
| Column | Type | Description |
| ---------- | ---------- | --------- |
| id (PK) | Integer | Unique identifier for the book |
| title | Character Varying (100) | Book title |
| author | Character Varying (100) | Book author |
| olid | Character Varying (15) | Open Library ID (OLID) used to load book covers |

**read_books**

Stores the user's reading information.
| Column | Type | Description |
| ---------- | ---------- | --------- |
| id (PK) | Integer | Unique identifier for the book |
| book_id (FK) | Integer | References `books.id` |
| date_read | Date | Date the book was read & added |
| rating | Double Precision | User rating |
| review | Text | User review |

## Tech Stack
| Component | Technology |
|----------|------------|
| Backend | Node.js + Express.js |
| Frontend | HTML + CSS + JS |
| Templating | EJS |
| Database | PostgreSQL |    
| Rendering | Server-side Rendering (SSR) |

## Getting Started
### Database Setup
This project requires a PostgreSQL database with the following tables.

Run the following SQL commands before starting the application:

```
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  olid VARCHAR(15) NOT NULL UNIQUE
);

CREATE TABLE read_books (
  id SERIAL PRIMARY KEY,
  date_read DATE NOT NULL,
  rating NUMERIC(2,1) NOT NULL,
  review TEXT NOT NULL,
  book_id INTEGER NOT NULL UNIQUE
    REFERENCES books(id)
    ON DELETE CASCADE
);
```

### Local Setup
- Clone the repository:
    - ```git clone https://github.com/userVallen/book-tracker.git```
    - ```cd book-tracker```

- Install the dependencies:
    - ```npm install```
 
- Create a `.env` file listing the credentials for your database in the following format:
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=<your_username>
  DB_PASSWORD=<your_password>
  DB_NAME=<your_db_name>
  ```

- Start the server:
    - ```npm start```

Then you can check the web app on http://localhost:3000

## How it Works
This project follows a server-side rendering (SSR) architecture:

* **Routing**: Express.js serves a single main page while handling CRUD operations through POST requests.
* **Templating**: EJS templates render book data dynamically on the server.
* **Modal-Based Interaction**: Adding and editing books are handled through modal forms instead of separate pages, improving user flow while maintaining SSR. The data (ID) is not directly passed through the form request. Instead, the client-side script (`client.js`) listens for which edit button was clicked on the page. Each book entry is rendered as a card containing edit and delete button, and the selected entry is determined on the client side before submitting the update request.
* **Database Synchronization**: All CRUD operations directly interact with PostgreSQL, ensuring persistent storage and consistency between the UI and database.
* **External API Usage**: Book covers are retrieved using the [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers) based on the stored OLID value.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
