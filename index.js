const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

// homepage category product collection api
    app.get('/products', async (req, res) => {
        const query = {}
        const cursor = productsCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
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
  