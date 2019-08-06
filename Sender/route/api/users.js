const express = require('express');
const mongoose = require('mongoose');
const User = require('../../model/User');
const router = express.Router();

router.post('/', (req, res) => {
  const newUser = new User({
    name: req.body.name
  });
  newUser.save().then(user => res.json(user));
});

module.exports = router;
