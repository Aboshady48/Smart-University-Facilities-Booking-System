const express = require('express');
const app = express();
require("dotenv").config();

const  { connectDB }  = require('./config/db.js');
const mainRouter = require('./router/main.route.js');

app.use(express.json());

// routes
app.use('/api', mainRouter);

// connect DB
connectDB();

app.listen(3000, () => {
  console.log('Server is running on : http://localhost:3000');
});
