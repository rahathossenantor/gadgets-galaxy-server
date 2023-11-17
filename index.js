const { MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@junior.tpsklbw.mongodb.net/?retryWrites=true&w=majority`;

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
        const cartItemsCollection = client.db("cartItemsDB").collection("cart");

        // post request
        app.post("/add-product", async (req, res) => {
            const product = req.body;
            const result = await gadgetsCollection.insertOne(product);
            res.send(result);
        });

        // get request
        app.get("/products/:brand", async (req, res) => {
            const brand = req.params.brand;
            const query = {brand: brand};
            const data = await gadgetsCollection.find(query).toArray();
            res.send(data);
        });

        // get single item
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await gadgetsCollection.findOne(query);
            res.send(result);
        });

        // update single item
        app.put("/update-product/:id", async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const option = {upsert: true};
            const product = req.body;
            const { productName, brand, productType, price, ratings, details, photo } = product;
            const updatedProduct = {
                $set: {
                    productName, brand, productType, price, ratings, details, photo
                }
            };
            const result = await gadgetsCollection.updateOne(filter, updatedProduct, option);
            res.send(result);
        });

        // cart functionalities
        // post single item
        app.post("/cart", async (req, res) => {
            const cartData = req.body;
            cartData._id = (new  ObjectId(cartData._id));
            const result = await cartItemsCollection.insertOne(cartData);
            res.send(result);
        });

        app.get("/cart/:email", async (req, res) => {
            const query = {};
            if (req.params?.email) {
                query.userEmail = req.params.email
            }

            let cartIds = await cartItemsCollection.find(query).toArray();
            cartIds = cartIds.map(item => item._id);

            const filter = {
                _id: {
                    $in: cartIds
                }
            };
            const data = await gadgetsCollection.find(filter).toArray();
            res.send(data);
        });

        // get cart item
        app.post("/cart-data", async (req, res) => {
            let cartIds = req.body;
            cartIds = cartIds.map(id => new ObjectId(id));
            const query = {
                _id: {
                    $in: cartIds
                }
            };
            const data = await gadgetsCollection.find(query).toArray();
            res.send(data);
        });

        // delete single cart item
        app.delete("/cart/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await cartItemsCollection.deleteOne(query);
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

app.get("/", (req, res) => {
    res.send("Gadgets Galaxy Server 1.0");
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

// gadgets-galaxy
// hka45tLynfXzTzOj
