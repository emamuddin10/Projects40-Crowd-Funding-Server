const express = require("express")
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())
// crowdFunding
// F9TfQ7LsfKJ4Iunk


const uri = "mongodb+srv://crowdFunding:F9TfQ7LsfKJ4Iunk@cluster0.v28xn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const fundingDBCollection = client.db('fundingDB').collection('funding')
    // get for details 

    
    app.get('/details-campaign/:id', async(req,res)=>{
      const paramId = req.params.id 
      const query = {_id: new ObjectId(paramId)}
      const result = await fundingDBCollection.findOne(query)
      res.send(result)
    })
    // get for read that data
    app.get('/allCampaign',async(req,res)=>{
      const result =await fundingDBCollection.find().toArray()
      res.send(result)
    })
    // post 
    app.post('/addCampaign',async(req,res)=>{
      const data = req.body
      console.log(data)
      const result = await fundingDBCollection.insertOne(data)
      res.send(result)
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




app.get('/',(req,res)=>{
    res.send('the server is running successfuly browser')
})
app.listen(port,()=>{
    console.log(`server is running on port: ${port}`)
})