//Express Stuffs...
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Mongoose Stuffss....
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/userData")
  .then(() => {
    console.log("Mongo Server Started");
  })
  .catch((err) => {
    console.log(err.message);
  });

//MyStuffs rquirement
const Address = require("./model/models");

app.get("/", (req, res) => {
  return res.json({ success: true }).status(200);
});

app.post("/createDetails", (req, res) => {
  for (const i of ["name", "email", "phone", "place"]) {
    if (req.body[i] === undefined)
      return res
        .json({ success: false, msg: `${i} data not sent by client` })
        .status(400);
  }
  const { name, phone, email, place } = req.body;

  const insertToDb = async () => {
    try {
      const data = new Address({
        phone,
        email,
        place,
        name,
      });
      const result = await data.save();
      return res.json({ success: true, dataInserted: result }).status(200);
    } catch (err) {
      console.log(err.message);
      return res.json({ success: false, res: err.message }).status(400);
    }
  };
  insertToDb();
});

app.get("/readContact/:id", (req, res) => {
  // if (req.params.id === undefined)
  //   return res.json({ success: false, msg: "User ID not provided" });
  Address.findById(req.params.id, (err, data) => {
    !err
      ? res.json({ data: data }).status(200)
      : res.json({ success: false, msg: "Wrong UID or User not exist" });
  });
});

app.put("/update/:id", (req, res) => {
  const address = {};
  for (const i of ["name", "email", "phone", "place"])
    if (req.body[i]) address[i] = req.body[i];

  if (Object.keys(address).length === 0)
    return res
      .json({ success: false, msg: "Provide atleast one field update" })
      .status(400);

  Address.updateOne({ _id: req.params.id }, address)
    .then(() => {
      return res.json({ success: true, data: address }).status(200);
    })
    .catch((err) => {
      return res.json({ success: false, error: err.message });
    });
});

app.delete("/delete/:id", (req, res) => {
  Address.deleteOne({ _id: req.params.id })
    .then(() => {
      return res.json({ success: true, msg: "User deleted" });
    })
    .catch((err) => {
      return res.json({ success: false, msg: err.message });
    });
});

server.listen(3000, (err) => {
  !err
    ? console.log("Express Server Started")
    : console.log("There was some error...");
});
