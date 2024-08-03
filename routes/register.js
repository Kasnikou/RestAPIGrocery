const express = require('express');
const router = express.Router();
const Employee = require('../models/Employees'); // Adjust the path as necessary

router.post('/', async (req, res) => {
    console.log("Registering new employee. Request Body:", req.body);

    try {
      const { Empid, Username, Password } = req.body;
      const Role = 'Billing area employee'; // Default role for new employees

      console.log(`Checking if employee exists: ${Username}, Empid: ${Empid}`);
      const existingEmployee = await Employee.findOne({ Empid, Username });

      if (existingEmployee) {
        console.log(`Employee already exists: ${Username}, Empid: ${Empid}`);
        return res.status(400).json({ error: 'Employee already exists' });
      }

      const newEmployee = new Employee({ Empid, Username, Password, Role });
      console.log("Saving new employee:", newEmployee);
      await newEmployee.save();

      console.log(`Employee registration successful: ${Username}, Empid: ${Empid}`);
      res.status(201).json({ message: 'Employee registration successful' });
    } catch (error) {
      console.error("Employee registration error:", error);
      res.status(500).json({ error: 'Employee registration failed', details: error.message });
    }
});

module.exports = router;
