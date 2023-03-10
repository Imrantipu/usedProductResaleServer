const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z2xprxb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client
      .db("mobileHunt")
      .collection("productsItem");
    const usersCollection = client.db("mobileHunt").collection("users");
    const bookingsCollection = client.db("mobileHunt").collection("bookings");
    const sellerProductsCollection = client
      .db("mobileHunt")
      .collection("sellerProducts");

    // homepage category product collection api
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // homepage category product single category route to show category items
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    //  buyer booking a product
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    // user created in db while signup
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
  });
  // see booked items with specific email
  app.get('/bookings', async (req, res) => {
    const email = req.query.email;

    const query = { email: email };
    const bookings = await bookingsCollection.find(query).toArray();
    res.send(bookings);
  });

  //  seller product uplode in database
  app.post('/sellerproducts', async (req, res) => {
    const product = req.body;
    const result = await sellerProductsCollection.insertOne(product);
    res.send(result);
  });

  //  seller get all his product
  app.get('/sellerproducts', async (req, res) => {
      
    let query = {};
    if (req.query.email) {
      query = {
        email: req.query.email
      }
    }
    const cursor = sellerProductsCollection.find(query);
    const sellerProducts = await cursor.toArray(); 
    res.send(sellerProducts);
  });
  // seller can delete his product
  app.delete('/sellerproducts/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await sellerProductsCollection.deleteOne(query);
    res.send(result);
});
// see all the byers
app.get('/allbuyers', async (req, res) => {
  const query = {category:"buyer"}
  const cursor = usersCollection.find(query);
  const buyers = await cursor.toArray();
  res.send(buyers);
});
// delete single byer
app.delete('/allbuyers/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
});
// get all rellers
app.get('/allsellers', async (req, res) => {
  const query = {category:"seller"}
  const cursor = usersCollection.find(query);
  const sellers = await cursor.toArray();
  res.send(sellers);
});

app.delete('/allsellers/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
});
//  checking user is seller
app.get('/users/seller/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email }
  const user = await usersCollection.findOne(query);
  res.send({ isSeller: user?.category === 'seller' });
});
// checking user is admin
    app.get('/users/admin/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email }
        const user = await usersCollection.findOne(query);
        res.send({ isAdmin: user?.category === 'admin' });
      });

  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("MobileHunt server is running");
});

app.listen(port, () => {
  console.log(`MobileHunt server is running on ${port}`);
});
