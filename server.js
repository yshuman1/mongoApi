const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Bear = require(`./Bears/BearModel.js`);

const server = express();

server.use(bodyParser.json());

server.get("/", (req, res) => {
  res.status(200).json("hello world");
});

server.get("/api/bears", (req, res) => {
  Bear.find({})
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The information could not be retrieved." });
    });
});

server.get("/api/bears/:id", (req, res) => {
  const { id } = req.params;
  Bear.findById(id)
    .then(bear => {
      res.status(200).json(bear);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The information could not be retrieved." });
    });
});

server.post("/api/bears", (req, res) => {
  const bearInformation = req.body;
  if (!bearInformation.species || !bearInformation.latinName) {
    res.status(400).json({
      errorMessage: "Pleaee provide bot species and latinName for the bear"
    });
  } else {
    const bear = new Bear(bearInformation);
    bear
      .save()
      .then(newBear => {
        res.status(201).json(newBear);
      })
      .catch(error => {
        res.status(500).json({
          error: "there was an error while saving bear to the database"
        });
      });
  }
});

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/bears", { useMongoClient: true })
  .then(() => {
    server.listen(5000, () => {
      console.log("Database connected and server fired up on port 5000");
    });
  })
  .catch(error => {
    console.log("database connection failed");
  });
