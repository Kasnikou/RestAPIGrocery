const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Empid: { type: Number, required: true },
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Role: { type: String, required: true },
});

const Employee = mongoose.model("Employee", userSchema, "Employees");

module.exports = Employee;
