const express = require('express');
const router = express.Router();
const Order = require('../models/Orders'); 
const { authorizeRoles } = require('../Auth/auth'); 



// GET all orders
router.get('/', authorizeRoles('Manager','Billing area employee'), (req, res) => {
    Order.find({})
      .then((orders) => {
        if (orders.length === 0) {
          // No orders found in the database
          return res.status(404).json({ message: 'No orders found' });
        }
        // Successfully found and returning orders
        res.json(orders);
      })
      .catch((error) => {
        // Error during the database query
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal server error when fetching orders' });
      });
});

// GET a single order by orderNo
router.get('/:orderNo',authorizeRoles('Manager','Billing area employee'), (req, res) => {
  const orderNo = req.params.orderNo;
  Order.findOne({ OrderNo: orderNo })
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found with OrderNo ' + orderNo });
      }
      res.json(order);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// CREATE a new order
router.post('/',authorizeRoles('Manager','Billing area employee'), (req, res) => {
  const newOrder = new Order(req.body); // Changed variable name from 'order' to 'newOrder' to avoid confusion
  newOrder.save()
    .then((order) => { // Now 'order' refers to the saved order document
      res.status(201).json(order); // Return the created order with status 201
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// UPDATE an existing order by OrderNo
router.put('/:orderNo',authorizeRoles('Manager','Billing area employee'), (req, res) => {
  const orderNo = req.params.orderNo;
  const update = req.body;
  Order.findOneAndUpdate({ OrderNo: orderNo }, update, { new: true })
    .then((updatedOrder) => {
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found with OrderNo ' + orderNo });
      }
      res.json(updatedOrder);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error updating order: ' + error.message });
    });
});

// PATCH an existing order by OrderNo (assuming you want to use OrderNo here instead of :id)
router.patch('/:orderNo', authorizeRoles('Manager','Billing area employee'), (req, res) => {
  const orderNo = req.params.orderNo;
  const updates = req.body;
  Order.findOneAndUpdate({ OrderNo: orderNo }, updates, { new: true })
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found with OrderNo ' + orderNo });
      }
      res.json(order);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// DELETE an order by OrderNo
router.delete('/:orderNo', authorizeRoles('Manager'), (req, res) => {
  const orderNo = req.params.orderNo;
  Order.findOneAndDelete({ OrderNo: orderNo })
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Order not found with OrderNo ' + orderNo });
      }
      res.status(200).json({ message: 'Order with OrderNo ' + orderNo + ' was deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
