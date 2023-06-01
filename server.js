const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        host : process.env.DATABASE_HOST,
        port : 5432,
        user : process.env.DATABASE_USER,
        password : process.env.DATABASE_PW,
        database : process.env.DATABASE_DB
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (request, response) => {
    response.send('successfully connected');
})

app.post('/signin', (request, response) => { signin.handleSignIn(request, response, db, bcrypt) });
app.post('/register', (request, response) => { register.handleRegister(request, response, db, bcrypt) });
app.get('/profile/:id', (request, response) => { profile.handleProfile(request, response, db) });
app.put('/image', (request, response) => { image.handleImage(request, response, db) });
app.post('/imageurl', (request, response) => { image.handleApiCall(request, response) });

app.listen(3000, () => {
    console.log('Listening to port 3000');
});