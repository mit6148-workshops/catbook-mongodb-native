// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

const mongo = require('../db');
const ObjectId = require('mongodb').ObjectID;

const router = express.Router();

// api endpoints
router.get('/whoami', function(req, res) {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send({});
  }
});


router.get('/user', function(req, res) {
  const users = mongo.getDb().collection('users');
  users.findOne({_id: ObjectId(req.query._id)})
    .then(user => {
      res.send(user);
    }).catch(err => console.log);
});

router.get('/stories', function(req, res) {
  const stories = mongo.getDb().collection('stories');
  stories.find({}).toArray()
    .then(stories => {
      res.send(stories);
    })
    .catch(err => console.log);
});

router.post(
  '/story',
  connect.ensureLoggedIn(),
  function(req, res) {
    const stories = mongo.getDb().collection('stories');
    const users = mongo.getDb().collection('users');

    const newStory = {
      'creator_id': req.user._id,
      'creator_name': req.user.name,
      'content': req.body.content,
    };

    stories.insertOne(newStory)
      .then(result => result.ops[0]) // extract the story from mongo response
      .then(story => {
        const io = req.app.get('socketio');
        io.emit('story', story);

        // Chain a new promise to find user
        return users.findOneAndUpdate({_id: ObjectId(req.user._id)},
                                      {$set: {last_post: story.content}})
      })
      .then(user => {
        console.log("insert success");
      })
      .catch(err => console.log);
    
    res.send({});
  }
);

router.get('/comment', function(req, res) {
  const comments = mongo.getDb().collection('comments');

  comments.find({parent: req.query.parent}).toArray()
    .then(comments => {
      res.send(comments);
    })
    .catch(err => console.log);
});

router.post(
  '/comment',
  connect.ensureLoggedIn(),
  function(req, res) {
    const comments = mongo.getDb().collection('comments');
    const newComment = {
      'creator_id': req.user._id,
      'creator_name': req.user.name,
      'parent': req.body.parent,
      'content': req.body.content,
    };

    comments.insertOne(newComment)
      .then(result => result.ops[0]) // get comment from mongo response
      .then(comment => {
        const io = req.app.get('socketio');
        io.emit("comment", comment);
      })
      .catch(err => console.log);

    res.send({});
  }
);
module.exports = router;
