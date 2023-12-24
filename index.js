const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//midlewere
app.use(cors());
app.use(express.json())




console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@rokon.tnm65c6.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
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
   
    await client.connect();

    const carCollection = client.db('carDB').collection('cars');

    app.get('/cars', async(req, res)=>{
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/cars/:brandName', async(req, res)=>{
      const cursor = await carCollection.find({brandName:req.params.brandName}).toArray()
      // const result = await cursor.toArray();
      console.log(cursor);
      res.send(cursor);
      
    })

    app.get('/cars/:brandName/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(query)
      

      // const result = await cursor.toArray();
      console.log(result);
      console.log(id);
      console.log(query);
      // res.send(result);
      
    })


    app.post('/cars', async(req, res)=> {
      const newCar = req.body;
      console.log(newCar);
      const result = await carCollection.insertOne(newCar)
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



app.get('/',(req, res)=>{
    res.send('SIMPLE CRUD IS RUNNING')
})
app.listen(port,()=>{
    console.log(`simple CRUD is running on port ${port}`);
})

