const express = require('express');
const app = express();
require("dotenv").config();
app.use(express.json());
const {connectDB} = require('./config/db.js');
const mainRouter = require('./router/main.route.js');

// Use main router
app.use('/api', mainRouter);

app.use(express.json());

// Connect to the database
connectDB();


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});