const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.get('/', (req, res) => {
    db.find()
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.post('/', (req, res) => {
    if(!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        return;
    }
    db.insert(req.body)
    .then(data => {
        db.findById(data.id)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            throw error;
        })
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while saving the post to the database." })
    })
})
module.exports = router;
