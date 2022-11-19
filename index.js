const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const colors = require("colors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conntect DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f3qt6qk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("database connected".yellow.italic);
  } catch (err) {
    console.log(err.name.bgRed, err.message.bold);
  }
}
// Call the server
connectDB();

// Select Database & Collections

const appointmentOptionsCollection = client
  .db("doctorsPortal")
  .collection("appointmentOptions");
const bookingsCollection = client.db("doctorsPortal").collection("bookings");

// Get all the appointment options

app.get("/appointmentOptions", async (req, res) => {
  try {
    const query = {};
    const cursor = await appointmentOptionsCollection.find(query).toArray();
    res.send(cursor);
  } catch (err) {
    console.log(err);
  }
});

// Send Bookin data to database

app.post("/bookings", async (req, res) => {
  try {
    const booking = req.body;
    console.log(booking);
    const result = await bookingsCollection.insertOne(booking);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.get("/", async (req, res) => {
  res.send("Doctors portal server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});