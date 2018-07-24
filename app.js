const express = require('express');
const morgan = require('morgan');
//const postBank = require('./postBank');
const postList = require('./views/postList');
const postDetails = require('./views/postDetails');
//const client = require('./db/index').client;
const seed = require('./db/index');

//Issued with Heroku deployment, with client export, temp workaround
const pg = require('pg');
const { Client } = pg;
const client = new Client(process.env.DATABASE_URL);
client.connect();

// Seed the data for our database (for Heroku deployment)
seed.syncAndSeed();

const app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res, next) => {
  try {
    const data = await client.query(`SELECT *, counting.upvotes
    FROM posts
    JOIN (SELECT postId, COUNT(*) as upvotes FROM upvotes GROUP BY postId) AS counting
    ON posts.id = counting.postId;`);
    const posts = data.rows;
    res.send(postList(posts));
  } catch (error) {
    next(error);
  }
});

app.get('/posts/:id', async (req, res, next) => {
  try {
    var post = await client.query(
      `SELECT * FROM posts where userid=${req.params.id}`
    );
    post = post.rows;
    res.send(postDetails(post[0]));
  } catch (error) {
    next(error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
