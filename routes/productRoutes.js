const express = require('express');
const router = express.Router();
const product = require('../models/Products');
const { authorizeRoles } = require('../Auth/auth');


router.get('/', authorizeRoles('user', 'Manager'), async (req, res) => {
  try {
    const products = await product.find({}); // Fetch all products

    if (req.user && req.user.role === 'user') {
      // Limited data for regular users
      const limitedData = products.map(product => ({
        name: product.name,
        price: product.price
      }));
      res.json(limitedData);
    } else {
      // Full data for Managers and admins
      res.json(products);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get a single product by ID
router.get('/:productCode', authorizeRoles('Manager'), (req, res) => {
    const productCode = req.params.productCode;
    product.findOne({ ProductCode: productCode }) // Using findOne to get the document by ProductCode
      .then((product) => {
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });

// Add a new product
router.post('/', authorizeRoles('Manager'), (req, res) => {
  const newProduct = new product(req.body); // Use 'product' as imported
  newProduct.save()
    .then(() => {
      res.status(201).json(newProduct); // Send status 201 for resource creation
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});


// UPDATE

router.put('/:productCode', authorizeRoles('Manager'), (req, res) => {
  const productCode = req.params.productCode;
  const update = req.body;
  product.findOneAndUpdate({ ProductCode: productCode }, update, { new: true })
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found with ProductCode ' + productCode });
      }
      res.json(updatedProduct);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});




// Update a product by ID
router.patch('/:productCode', authorizeRoles('Manager'), (req, res) => {
  const productCode = req.params.productCode;
  const updates = req.body;

  product.findOneAndUpdate(
      { ProductCode: productCode }, 
      { $set: updates }, 
      { new: true } // This option returns the modified document rather than the original
  )
  .then(updatedProduct => {
      if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found with ProductCode ' + productCode });
      }
      res.json(updatedProduct);
  })
  .catch(error => {
      res.status(500).json({ error: error.message });
  });
});


// Delete a product by ID
router.delete('/:productCode', authorizeRoles('Manager'),  (req, res) => {
    const productCode = req.params.productCode;
    product.findOneAndDelete({ ProductCode: productCode },{ maxTimeMS: 20000 })
      .then((product) => {
        if (!product) {
          return res.status(404).json({ message: 'Product not found with ProductCode ' + productCode });
        }
        res.status(200).json({ message: 'Product with ProductCode ' + productCode + ' was deleted successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
  




module.exports = router;
