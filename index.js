const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0icjz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function mongodbCURD() {
  try {
    /* ------------------------------------- 
     checking connection with DB
    ------------------------------------- */
    await client.connect();
    console.log('db connected');
    /* ------------------------------------- 
    database name and collection init
    ------------------------------------- */
    const database = client.db('campMinds');
    const bookingCollection = database.collection('booking');
    const campCollection = database.collection('camps');
    /* ------------------------------------- 
    GET all camps API
    ------------------------------------- */
    app.get('/camps', async (req, res) => {
      const cursor = campCollection.find({});
      const camps = await cursor.toArray();
      res.send(camps);
    });
    /* ------------------------------------- 
    GET single camp API
    ------------------------------------- */
    app.get('/camps/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const camp = await campCollection.findOne(query);
      res.json(camp);
    });
    /* ------------------------------------- 
    POST single camp API
    ------------------------------------- */
    app.post('/camps', async (req, res) => {
      // Step 1. data
      const camp = req.body;
      // Step 2. insertOne
      const result = await campCollection.insertOne(camp);
      // console.log('post request comming', service);
      res.json(result);
    });
    /* ------------------------------------- 
    DELETE single camp API
    ------------------------------------- */
    app.delete('/camps/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await campCollection.deleteOne(query);
      res.json(result);
    });
    /* ------------------------------------- 
    GET All Users with Camp Booking API
    ------------------------------------- */
    app.get('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const allBookings = await bookingCollection.findOne(query);
      res.json(allBookings);
    });
    /* ------------------------------------- 
    POST single Camp Booking API
    ------------------------------------- */
    app.post('/booking', async (req, res) => {
      // Step 1. data
      const booking = req.body;
      // Step 2. insertOne
      const result = await bookingCollection.insertOne(booking);
      // console.log('post request comming', service);
      res.json(result);
    });
    /* ------------------------------------- 
    GET specific Users with All Camp Booking API
    ------------------------------------- */
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = bookingCollection.find(query);
      const userBookings = await cursor.toArray();
      res.send(userBookings);
    });
  } finally {
    // await client.close();
  }
}

mongodbCURD().catch(console.dir);

// server run
app.get('/', (req, res) => res.send('server runinng'));

app.listen(port, () => console.log(`Running Server on port ${port}`));
