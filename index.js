//Install pg, express
const pg = require('pg');
const express = require('express');
const app = express();

const client = new pg.Client(process.env.DATABASE_URL || 'postgres://192.168.1.65/')