const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const registerRoutes = require('./routes/register');
const loginRouter = require('./routes/login');
const employeeRoutes = require('./routes/employeeRoutes');
const connectToDatabase = require('./Auth/connectdb');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api-docs.yaml');

const app = express();

// Connect to the database
connectToDatabase();

// Custom CORS options
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'https://google.com', 'http://google.com',
      'https://www.google.com', 'http://www.google.com',
      'https://google.com.au', 'http://google.com.au',
      'https://www.google.com.au', 'http://www.google.com.au'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-My-Custom-Header', 'X-Another-Custom-Header'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Apply CORS middleware globally
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/register', registerRoutes);
app.use('/login', loginRouter);
app.use('/employees', employeeRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({ status: 403, message: "CORS Error: Not allowed by CORS" });
    } else {
        res.status(statusCode).json({ status: statusCode, message: message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
}).on('error', (err) => {
    console.error('Error starting server:', err);
});
