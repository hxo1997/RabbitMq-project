# RabbitMq-project

- You should create .env file inside project folder and paste AMQP credentials into this file.
- You should create some users for the UserSchema by using Postman and send Post request to 
```
http://localhost:5000/api/users
```
```json
{
 "name":"blabla"
}
 ```

## Steps to run:
```bash
npm install
cd Sender
node sender.js
```
Then open a new terminal 
```bash
cd Receiver
node receiver.js
```
