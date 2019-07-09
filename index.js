const express = require('express');
const db = require('./data/db');

const server = express();

server.use(express.json());


server.listen(3000, () => {
    console.log('\n*** Server Running on port 3000 ***\n');
})