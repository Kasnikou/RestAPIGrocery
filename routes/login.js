const express = require('express');
const router = express.Router();
const Employee = require('../models/Employees');
const { generateToken } = require('../Auth/auth'); 

router.post('/', async (req, res) => {
  try {
    const { Username, Password } = req.body;

    // Search for the employee in the "Employees" collection
    const employee = await Employee.findOne({ Username });
    console.log("Received:", { Username, Password });

    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log("Found in DB:", { user: employee.Username, pass: employee.Password });

    // Check if the provided password matches the stored password
    if (employee.Password === Password) {
      // Generate a JWT token with the employee's data
      // Pass the employee object with both Username and Role
      const token = generateToken(employee); // Pass the entire employee object
      console.log("Token Generated==> ", token);

      // Send the token as a response
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;



