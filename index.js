const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bihlgkr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const collegeCollection = client.db('collegeBooking').collection('collegeInfo');
    const myCollegeCollection = client.db('collegeBooking').collection('myCollege');

    app.get('/colleges', async(req, res)=>{
      const result = await collegeCollection.find().toArray();
      res.send(result)
    })

  

    app.get('/colleges/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await collegeCollection.findOne(query)
      res.send(result)
    });

    // app.get('/myCollege', async(req, res)=>{
    //   const result = await myCollegeCollection.find().toArray();
    //   res.send(result)
    // })

    app.get('/myCollege', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await myCollegeCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/myCollege', async (req, res) => {
      const selectedCollege = req.body;
      console.log(selectedCollege);
      const result = await myCollegeCollection.insertOne(selectedCollege);
      res.send(result);
    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('college server is running')
})
app.listen(port, ()=>{
    console.log(`server is running on port ${port} `);
})