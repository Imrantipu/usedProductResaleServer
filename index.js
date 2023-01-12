
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


async function run()
{
  try
  {
    
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
  