const express = require('express');
const db = require('./data/db');
const postRoutes = require('./posts/routes');

const server = express();

server.use(express.json());
server.use('/api/posts', postRoutes);


server.listen(3000, () => {
    console.log('\n*** Server Running on port 3000 ***\n');
})