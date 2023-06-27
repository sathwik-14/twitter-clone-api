const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv').config();
const connectDB=require('./config/dbConnection');
const port=process.env.PORT||8000;
//------------------------------------------------Middlewares------------------------------------------------


app.use(express.json());
app.use(cors());
app.use("/",require('./routers/routes'));


//------------------------------------------------Connect to MongoDB Atlas------------------------------------------------

connectDB();




//------------------------------------------------App routes------------------------------------------------

app.listen(port, () => {
    console.log("Server listening on port 8000");
});


