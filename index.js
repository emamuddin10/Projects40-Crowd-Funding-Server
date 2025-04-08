const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors({
  origin: ["http://localhost:5173"]
}));
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.userDB}:${process.env.userPass}@cluster0.v28xn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const fundingDBCollection = client.db("fundingDB").collection("funding");
    const donationCollection = client.db("fundingDB").collection("donation");

    // get api for my campaign

    app.get("/my-campaign/:email", async (req, res) => {
      const params = req.params.email;
      const query = { email: params };
      const result = await fundingDBCollection.find(query).toArray();
      res.send(result);
    });
    // get for details
    app.get("/details-campaign/:id", async (req, res) => {
      const paramId = req.params.id;
      const query = { _id: new ObjectId(paramId) };
      const result = await fundingDBCollection.findOne(query);
      res.send(result);
    });

    // get for read that data
    app.get("/allCampaign", async (req, res) => {
      const result = await fundingDBCollection.find().toArray();
      res.send(result);
    });
    // post
    app.post("/addCampaign", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await fundingDBCollection.insertOne(data);
      res.send(result);
    });


    // update campaign
    app.patch('/update/:id',async(req,res)=>{
      const paramsId = req.params.id 
      const filter = {_id: new ObjectId(paramsId)}
      const options = { upsert: true };
      const campaign = req.body;
      const updateData = {
        $set: {
          name:campaign.name,
          description: campaign.description,
          type: campaign.type,
          photo: campaign.photo,
          userName: campaign.userName,
          email: campaign.email,
          amount: campaign.amount
        }
      }

      const result = await fundingDBCollection.updateOne(filter,updateData,options)
      res.send(result)
    }) 


    //  delete for my campaign
     app.delete("/delete-campaign/:id", async (req, res) => {
      const paramsId = req.params.id;
      const query = { _id: new ObjectId(paramsId) };
      const result = await fundingDBCollection.deleteOne(query);
      res.send(result);
    });


    // donation 
    app.post('/add-donation',async(req,res)=>{
      const donationData = req.body;
      console.log(donationData)
      const result = await donationCollection.insertOne(donationData)
      res.send(result)
    })


    // get donation data for specefic user 
    app.get('/myDonation/:email',async(req,res)=>{
      const email = req.params.email;
      console.log(email)
      const query = {userEmail: email}
      const result = await donationCollection.find(query).toArray()
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("the server is running successfuly browser");
});
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
