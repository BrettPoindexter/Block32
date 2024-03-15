//Install pg, express
const pg = require('pg');
const express = require('express');
const app = express();

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_icecream_db');

app.use(express.json());
app.use(require('morgan')('dev'));

const init = async () => {
    await client.connect();
    let SQL = /*sql*/ `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            is_favorite BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
        );
        INSERT INTO flavors(id, name, is_favorite) VALUES (1, 'Vanilla', FALSE);
        INSERT INTO flavors(id, name, is_favorite) VALUES (2, 'Chocolate', TRUE);
        INSERT INTO flavors(id, name, is_favorite) VALUES (3, 'Strawberry', FALSE);
        INSERT INTO flavors(id, name, is_favorite) VALUES (4, 'Caramel', FALSE);
        INSERT INTO flavors(id, name, is_favorite) VALUES (5, 'Coffee', FALSE);
    `;

    await client.query(SQL);
    console.log('Tables Created');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}`));
};

init();