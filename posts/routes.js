const express = require('express');
const db = require('../data/db');

const router = express.Router();

const getPost = (id) => {
    return new Promise((resolve, reject) => {
        db.findById(id)
        .then(post => {
            if(!post || post.length === 0) {
                reject("Post doesn't exist");
            } else {
                resolve(post[0]);
            }
        })
        .catch(error => {
            reject(error);
        })
    })
}

router.get('/', (req, res) => {
    db.find()
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json({ error: "The posts information could not be retrieved." });
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
        res.status(500).json({ error: "There was an error while saving the post to the database." });
    })
})

router.get('/:id', (req, res) => {
    getPost(req.params.id)
    .then(post => {
        res.status(200).json(post);
    })
    .catch(error => {
        res.status(404).json({ error: "The post with the specified ID does not exist." });
    })
})

router.get('/:id/comments', (req, res) => {
    getPost(req.params.id)
    .then(() => {
        db.findPostComments(req.params.id)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved." });
        })
    })
    .catch(error => {
        res.status(404).json({ error: "The post with the specified ID does not exist." });
    })
})

router.post('/:id/comments', (req, res) => {
    if(!req.body.text) {
        res.status(400).json({ error: "Please provide text for the comment." });
        return;
    }
    getPost(req.params.id)
    .then(() => {
        const comment = {...req.body, post_id: req.params.id};
        db.insertComment(comment)
        .then(data => {
            db.findCommentById(data.id)
            .then(dbComment => {
                res.status(201).json(dbComment);
            })
            .catch(error => {
                throw new Error("Error adding comment");
            })
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the comment to the database" });
        })
    })
    .catch(error => {
        res.status(404).json({ error: "The post with the specified ID does not exist." });
    })
})

router.delete('/:id', (req, res) => {
    getPost(req.params.id)
    .then(post => {
        db.remove(post.id)
        .then(data => {
            res.status(200).json(post);
        })
        .catch(error => {
            res.status(500).json({ error: "The post could not be removed" });
        })
    })
    .catch(error => {
        res.status(404).json({ error: "The post with the specified ID does not exist." });
    })
})

router.put('/:id', (req, res) => {
    if(!req.body.title || !req.body.contents) {
        res.status(400).json({ error: "Please provide title and contents for the post." });
        return;
    }
    getPost(req.params.id)
    .then(post => {
        db.update(post.id, req.body)
        .then(data => {
            getPost(post.id)
            .then(newPost => {
                res.status(200).json(newPost);
            })
        })
        .catch(error => {
            res.status(500).json({ error: "The post information could not be modified." });
        })
    })
    .catch(error => {
        res.status(404).json({ error: "The post with the specified ID does not exist." });
    })
})
module.exports = router;
