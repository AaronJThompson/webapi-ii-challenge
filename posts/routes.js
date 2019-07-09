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
        res.status(400).json({ error: "Please provide title and contents for the post." });
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

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(data => {
        if(!data || data.length === 0) {
            throw new Error("Couldn't find post");
        }
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(404).json({ error: "The post with the specified ID does not exist." })
    })
})
module.exports = router;
