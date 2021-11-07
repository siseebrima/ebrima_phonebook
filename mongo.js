const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://ebrima:${password}@cluster0.dhvgc.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const name = process.argv[3];
const number = process.argv[4];
const person = new Person({
  name,
  number,
});

if (process.argv.length === 3 && process.argv[2] === password) {
  Person.find({}).then((result) => {
    console.log(`phonebook:`);
    result.forEach((p) => {
      console.log(p.name, p.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length < 4) {
  console.log(
    `the arguments should not be less than 4 including name and password`
  );
  process.exit(1);
}

person.save().then((result) => {
  console.log(`added ${name} number ${number} to phonebook`);
  mongoose.connection.close();
});
