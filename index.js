const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

app.use(cors());

app.use(express.static("build"));

app.use(express.json());

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  console.log("----");
  next();
};

// app.use(morgan("tiny"));

app.use(requestLogger);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send("the person you are looking for is not available");
  }
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(202).end;
    })
    .catch((error) => res.status(500).end());
});

app.post("/api/persons", morgan("tiny"), (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: "missing name" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  const text = `<div>
    Phonebook has info for ${persons.length} people
    <p>
      ${new Date()}
    </p>
  </div>`;
  res.send(text);
});

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({
    error: "unknown endpoint",
  });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
