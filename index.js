const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// server run
app.get('/', (req, res) => res.send('server runinng'));

app.listen(port, () => console.log(`Running Server on port ${port}`));
