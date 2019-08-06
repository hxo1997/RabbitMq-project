require('dotenv').config({ path: '../.env' });
const amqp = require('amqplib/callback_api');
const express = require('express');
const app = express();
const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

app.get('/api/users', (req, res) => {
  amqp.connect(messageQueueConnectionString, function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = 'users';

      channel.assertQueue(queue, {
        durable: false
      });

      console.log(
        ' [*] Waiting for messages in %s. To exit press CTRL+C',
        queue
      );

      channel.consume(
        queue,
        function(msg) {
          console.log(' [x] Received %s', msg.content.toString());
          const newMsg = msg.content.toString();
          const reply = JSON.parse(newMsg);
          return res.json(reply);
        },
        {
          noAck: true
        }
      );
    });
  });
});

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server running on port ${port}`));
