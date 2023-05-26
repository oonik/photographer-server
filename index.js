const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bwrtzwz.mongodb.net/?retryWrites=true&w=majority`;

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
    const serviceCollection = client.db("photographer").collection("services");
    const reviewAddCollection = client.db("photographer").collection("review");

     app.get('/services', async(req, res)=>{
         const query = {};
         const cursor = serviceCollection.find(query);
         const services = await cursor.toArray();
         res.send(services)
     })

     app.get('/services/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.send(service)
     })

     app.get('/review', async(req, res)=>{
       let query = {};
       if(req.query.email){
         query = {
           email : req.query.email
         };
       }
       const cursor = reviewAddCollection.find(query);
       const reviews = await cursor.toArray();
       res.send(reviews)
     })

    //data create to db

     app.post('/review', async(req, res)=>{
         const review = req.body;
         const result = await reviewAddCollection.insertOne(review);
         res.send(result)
     })

    
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('photographer api is running')
});

app.listen(port, ()=>{
    console.log('photographer api running by port: ', port)
})