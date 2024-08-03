const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  ProductCode: {
    type: Number,
    required: true
  },
  ProductName: {
    type: String,
    required: true
  },
  ProductQuantity: {
    type: Number,
    required: true
  },
  ProductPrice: {
    type: Number,
    required: true
  }
  
});

const Product = mongoose.model('Product', productSchema,'Products');

module.exports = Product;