const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Gadgets Galaxy Server");
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
