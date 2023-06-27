const mongoose = require("mongoose");


const connectDB=async ()=>{mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas');

    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });
}

    module.exports = connectDB;