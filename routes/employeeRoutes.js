const express = require("express");
const router = express.Router();
const Employee = require("../models/Employees");
const { authorizeRoles } = require("../Auth/auth");

// GET all employees
router.get("/", authorizeRoles("Manager"), (req, res) => {
  Employee.find()
    .then((employees) => {
      if (employees.length === 0) {
        return res.status(404).json({ message: "No employees found" });
      }
      res.json(employees);
    })
    .catch((error) => {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// GET a single employee by Empid
router.get("/:empId", authorizeRoles("Manager"), (req, res) => {
  const empId = req.params.empId;
  Employee.findOne({ Empid: empId })
    .then((employee) => {
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// POST a new employee
router.post("/", authorizeRoles("Manager"), (req, res) => {
  const newEmployee = new Employee(req.body);
  newEmployee
    .save()
    .then(() => {
      res.status(201).json(newEmployee);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// PATCH an employee by Empid
router.patch("/:empId", authorizeRoles("Manager"), (req, res) => {
  const empId = req.params.empId;
  const updates = req.body;

  Employee.findOneAndUpdate({ Empid: empId }, { $set: updates }, { new: true })
    .then((updatedEmployee) => {
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(updatedEmployee);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// PUT  an employee by Empid
router.put("/:empId", authorizeRoles("Manager"), (req, res) => {
  const empId = req.params.empId;
  Employee.findOneAndUpdate({ Empid: empId }, req.body, { new: true })
    .then((updatedEmployee) => {
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(updatedEmployee);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

router.delete("/:empId", authorizeRoles("Manager"), (req, res) => {
  const empId = req.params.empId;
  Employee.findOneAndDelete({ Empid: empId })
    .then((employee) => {
      if (!employee) {
        console.error("Employee not found for ID:", empId);
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(200).json({ message: "Employee deleted successfully" });
    })
    .catch((error) => {
      console.error("Error in deleting employee:", error);
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
