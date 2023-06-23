const express = require('express');
const bcrypt = require('bcrypt');
const user = require('./users');
const mongoose = require("mongoose");
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 
const app = express();
const uri = "mongodb+srv://admin:kywagle547@cluster0.rrqqlus.mongodb.net/?retryWrites=true&w=majority";
app.use(express.json());
app.use(cors());



//------------------------------------------------Connect to MongoDB Atlas------------------------------------------------


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas');

    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });


//------------------------------------------------Send verification email------------------------------------------------

const sendverificationemail = async (un, em, id) => {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'kywagle@gmail.com',
            pass: 'kyirnqmiixjeihnr'
        }
    })
    const mailOptions = {
        from: 'kywagle@gmail.com',
        to: em,
        subject: 'Verify Email ',
        html: `<h1>Hi ${un}</h1><br><p>Click on the link to verify your email</p><br><a href="http://localhost:8000/verify/${id}">Verify</a>`
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    })

}


//------------------------------------------------App routes------------------------------------------------

app.listen(8000, () => {
    console.log("Server listening on port 8000");
});


//------------------------------------------------Register------------------------------------------------

app.post('/register', upload.single('pp'), async (req, res) => {
    try {

        const { un, em, pass, bio } = req.body;
        const profilePicture = req.file;
        const hashedPassword = await bcrypt.hash(pass, 10);
        const data = {
            username: un,
            email: em,
            password: hashedPassword,
        };

        const emailexist = await user.findOne({ email: em });

        if (emailexist) {
            throw new Error("Email already exist");
        }
        else {

            const newUser = await user.create(data);
            if (newUser) {
                sendverificationemail(un, em, newUser._id);
                console.log('Created User:', newUser);
            }
        }
        res.send({ message: 'Form submitted successfully' });

    }
    catch (error) {
        console.log(error);
        res.send(error.message);
    }


});


//------------------------------------------------Verification------------------------------------------------

app.get('/verify/:email', async (req, res) => {
    console.log("hii " + req.params.email);
    const updated = await user.updateOne({ _id: req.params.email }, { $set: { is_verified: true } });
    if (updated) console.log(updated)
    else console.log("error");
    res.send('<h1>Account verified</h1>');
})




