const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();

const { connectDB } = require('./config/db.js');
const mainRouter = require('./router/main.route.js');

//Enable CORS
app.use(cors({
  origin: "http://localhost:5173", //frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// routes
app.use('/api', mainRouter);

// connect DB
connectDB();

app.listen(3000, () => {
  console.log('Server is running on : http://localhost:3000');
});