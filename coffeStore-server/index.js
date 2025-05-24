const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USR}:${process.env.DB_PASS}@cluster0.wld9ndi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const coffeCollection = client.db("coffeDB").collection("coffe");
    
    app.get('/coffe', async (req,res)=>{
      const cursor = coffeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/coffe', async(req,res)=>{
      const newCoffe =req.body;
      const result = await coffeCollection.insertOne(newCoffe);
      res.send(result);
    })

    app.delete('/coffe/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result= await coffeCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res)=>{
    res.send('coffe maker is running.')
})

app.listen(port);
