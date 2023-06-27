const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../models/userModels');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const files = require('../models/imageModels');


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

//------------------------------------------------Register------------------------------------------------

router.post('/register', upload.single('pp'), async (req, res) => {
    try {

        const { un, em, pass, bio } = req.body;
        const profilePicture = req.file;
        const hashedPassword = await bcrypt.hash(req.body.pass, 10);
        const data = {
            username: un,
            email: em,
            password: hashedPassword,
        };

        const emailexist = await user.findOne({ email: em });

        if (emailexist) {
            res.send({ message: 'Email already exists' })
        }
        else {

            const newUser = await user.create(data);
            if (newUser) {
                sendverificationemail(un, em, newUser._id);
                console.log('Created User:', newUser);
            }
            if (profilePicture) {
                fs.readFile(req.file.path, async (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    const fileBuffer = data;
                    // Create a new document
                    const file = {
                        email: em,
                        filename: req.file.originalname,
                        size: req.file.size,
                        contentType: req.file.mimetype,
                        data: fileBuffer,
                    }

                    newfile = await files.create(file);
                    if (newfile) console.log("newfile created");
                    else console.log("error");

                    fs.unlink(req.file.path, (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                });

            }
            res.send({ message: 'User created successfully' })
        }

    }
    catch (error) {
        res.send({ message: error.message })
    }


});


//------------------------------------------------Verification------------------------------------------------

router.get('/verify/:email', async (req, res) => {
    console.log("hii " + req.params.email);
    const updated = await user.updateOne({ _id: req.params.email }, { $set: { is_verified: true } });
    if (updated) console.log(updated)
    else console.log("error");
    res.send('<h1>Account verified</h1>');
})


//------------------------------------------------get image------------------------------------------------

router.get('/image/:email', async (req, res) => {
    console.log("image requested")
    const file = await files.findOne({ email: req.params.email });
    if (file) {
        res.set('Content-Type', file.contentType);
        console.log(file.data)
        res.send(file.data);
    }
    else {
        res.send("error");
    }
})


module.exports = router;
