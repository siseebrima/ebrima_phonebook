const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  return res.send("hello phonebook user");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
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
  const id = Number(req.params.id);

  const person = persons.find((p) => p.id === id);

  if (person) {
    persons = persons.filter((p) => p.id !== id);
    res.status(204).end();
  } else {
    return res
      .status(404)
      .send("the person you are trying to delete does not exist!");
  }
});

app.post("/api/persons", morgan("tiny"), (req, res) => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;

  const body = req.body;
  if (body.name && body.number) {
    const name = persons.find((p) => p.name === body.name);

    if (name) {
      return res.status(504).json({ error: "name must be unique" });
    }
    const person = {
      name: body.name,
      number: body.number,
      id: maxId + 1,
    };
    persons = persons.concat(person);
    res.json(person);
  } else if (!body.name || !body.number) {
    return res.status(404).send("Please insert both name and number");
  } else {
    res.status(404).send("no valid data was inserted");
  }
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
