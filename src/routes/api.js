// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

// models
const User = require('../models/user');
const Story = require('../models/story');
const Comment = require('../models/comment');

const router = express.Router();

// api endpoints
router.get('/whoami', function(req, res) {
  
  if(req.isAuthenticated()){
    res.send(req.user);
  }
  else{
    res.send({});
  }
});


router.get('/user', function(req, res) {
  User.findOne({ _id: req.query._id }).then(user => {
    res.send(user);
  });
});

router.get('/stories', function(req, res) {
  Story.find({}).then(stories => {
    res.send(stories);
  });
});

router.post(
  '/story',
  connect.ensureLoggedIn(),
  function(req, res) {
    const newStory = new Story({
      'creator_id': req.user._id,
      'creator_name': req.user.name,
      'content': req.body.content,
    });

    newStory.save()
      .then(story => {
        const io = req.app.get('socketio');
        io.emit('story', story);

        // Chain a new promise to find user
        return User.findOne({_id: req.user._id});
      })
      .then(user => {
        user.last_post = req.body.content;
        user.save(); 
      })
      .catch(err => {
        // An error occurred!
        console.log(err);
      });
    
    res.send({});
  }
);

router.get('/comment', function(req, res) {
  Comment.find({ parent: req.query.parent }).then(comments => {
    res.send(comments);
  });
});

router.post(
  '/comment',
  connect.ensureLoggedIn(),
  function(req, res) {
    const newComment = new Comment({
      'creator_id': req.user._id,
      'creator_name': req.user.name,
      'parent': req.body.parent,
      'content': req.body.content,
    });

    newComment.save().then(comment => {
      const io = req.app.get('socketio');
      io.emit("comment", comment);
    }).catch(err => {
      console.log(err);
    });

    res.send({});
  }
);
module.exports = router;
