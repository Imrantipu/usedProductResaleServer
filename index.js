const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z2xprxb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run()
{
  try
  {

    const productsCollection = client.db('mobileHunt').collection('productsItem');
    const usersCollection = client.db('mobileHunt').collection('users');
    const bookingsCollection = client.db('mobileHunt').collection('bookings');

// homepage category product collection api
    app.get('/products', async (req, res) => {
        const query = {}
        const cursor = productsCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
    });
// user created in db while signup
    app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
    });

    // homepage category product single category route to show category items
    app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const product = await productsCollection.findOne(query);
        res.send(product);
      });
//  buyer booking a product
      app.post('/bookings', async(req, res) => {
        const booking = req.body;
        const result = await bookingsCollection.insertOne(booking);
        res.send(result);
    });

    // see booked items with specific email
    app.get('/bookings', async (req, res) => {
        const email = req.query.email;
    
        const query = { email: email };
        const bookings = await bookingsCollection.find(query).toArray();
        res.send(bookings);
      });
//  checking user is seller
      app.get('/users/seller/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email }
        const user = await usersCollection.findOne(query);
        res.send({ isSeller: user?.category === 'seller' });
    });
    
  }
  finally{

  }
}
run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('MobileHunt server is running');
  });

app.listen(port, () => {
    console.log(`MobileHunt server is running on ${port}`);
  });
  