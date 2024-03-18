//Install pg, express
const pg = require('pg');
const express = require('express');
const app = express();

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_icecream_db');

app.use(express.json());
app.use(require('morgan')('dev'));

app.get('/api/flavors', async (req, res, next) => {
    try {
        const SQL = /*sql*/ `
            SELECT * FROM flavors ORDER BY created_at DESC;
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (err) {
        next(err);
    }
});

app.get('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = `
            SELECT * FROM flavors WHERE id=$1;
        `;
        const response = await client.query(SQL, [req.params.id]);
        res.send(response.rows[0]);
    } catch (err) {
        next(err);
    }
});

app.post('/api/flavors', async (req, res, next) => {
    try {
        const SQL = `
            INSERT INTO flavors (id, name, is_favorite, created_at, updated_at)
            VALUES ($1, $2, $3, now(), now())
            RETURNING *;
        `;
        const response = await client.query(SQL, [req.body.id, req.body.name, req.body.is_favorite]);
        res.send(response.rows[0]);
    } catch (err) {
        next(err);
    }
});

app.delete('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = `
            DELETE FROM flavors
            WHERE id=$1;
        `;
        const response = client.query(SQL, [req.params.id]);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

app.put('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = `
            UPDATE flavors
            SET name=$1, is_favorite=$2, updated_at=now()
            WHERE id=$3
            RETURNING *;
        `;
        const response = await client.query(SQL, [req.body.name, req.body.is_favorite, req.params.id]);
        res.send(response.rows[0]);
    } catch (err) {
        next(err);
    }
})

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