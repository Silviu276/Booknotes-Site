// this project is a local blog repurposed to a book review website
// it works through REST APIs and PostgreSQL databases
//try it out

// SQL CODE TO RUN THE SITE 
CREATE TABLE books(
    id serial primary key,
    title text,
    description text,
    rating int
);

INSERT INTO books VALUES(1, 'book1', 'description1', 7);
INSERT INTO books VALUES(2, 'book2', 'description2', 9);
INSERT INTO books VALUES(3, 'book3', 'description3', 10);

// in the index.js complete with your info on line 8