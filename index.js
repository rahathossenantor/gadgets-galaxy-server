const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://gadgets-galaxy:hka45tLynfXzTzOj@junior.tpsklbw.mongodb.net/?retryWrites=true&w=majority";

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
        // await client.connect();

        const gadgetsCollection = client.db("gadgetsDB").collection("gadgets");

        // post request
        app.post("/add-product", async (req, res) => {
            const product = req.body;
            const result = await gadgetsCollection.insertOne(product);
            res.send(result);
        });

        // specific get request
        app.get("/products/:brand", async (req, res) => {
            const brand = req.params.brand;
            const query = {brand: brand};
            const result = await gadgetsCollection.find(query);
            const data = await result.toArray();
            res.send(data);
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

app.get("/", (req, res) => {
    res.send("Gadgets Galaxy Server 1.0");
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

// gadgets-galaxy
// hka45tLynfXzTzOj
