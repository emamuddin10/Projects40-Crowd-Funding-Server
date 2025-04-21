// db.js
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// console.log("user",process.env.userDB)

const uri = `mongodb+srv://${process.env.userDB}:${process.env.userPass}@cluster0.v28xn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = connectToDatabase;
