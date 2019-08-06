require('dotenv').config({ path: '../.env' });
const express = require('express');
const amqp = require('amqplib/callback_api');
const app = express();
const mongoose = require('mongoose');
const users = require('./route/api/users');
const User = require('./model/User');
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

//console.log(messageQueueConnectionString);
//create mongodb connection
mongoose
  .connect('mongodb://localhost:27017/rabbit-mq', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to DB');
    //connect to AMQP
    amqp.connect(messageQueueConnectionString, function(error0, connection) {
      if (error0) {
        throw error0;
      }
      //Create Channel
      connection.createChannel(function(error1, channel) {
        if (error1) throw error1;
        User.find()
          .sort({ name: 1 })
          .then(users => {
            const queue = 'users';
            const msg = users;
            console.log(msg);
            const newMsg = JSON.stringify(msg);
            console.log(newMsg);
            //Create Queue with name users
            channel.assertQueue(queue, {
              durable: false
            });
            //Send data to queue
            channel.sendToQueue(
              queue,
              Buffer.from(JSON.stringify(msg), 'utf-8')
            );
            console.log('sent users to queue');
          });
        //Close connection
        setTimeout(function() {
          connection.close();
          process.exit(0);
        }, 500);
      });
    });
  })
  .catch(err => console.log(err));

app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
