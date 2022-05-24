const router = require('express').Router();
const { validator, validationResult } = require('express-validator');
const User = require('../model/customer.model');
const jwt = require('jsonwebtoken');
const fast2sms = require('fast-two-sms');

const nodemailer = require('nodemailer');
const config = require('config');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { printLogger } = require('../core/utility');
const { query } = require('express');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post('/signup',async (request, response) => {

    
        const errors = validationResult(request);
        if (!errors.isEmpty())
            return response.status(400).json({ errors: errors.array() });
        const { name, email, password, mobile, occupation, address } = request.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return response.status(400).json({ msg: "already exists" })
            }
            user = new User({ name, email, mobile, password, occupation, address });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.save().then(result => {
                console.log(result);
    
                var options = {authorization : "jbKmfDycSI0QUAankG5pruwXetOsiYPVJvE1zCx7d6oLg2NZFMthPWGFymDc0uKIzTVZ5482EsaQvi19" 
                , message : ' Welcome to khetikisani! You have successfully registered' ,  numbers : [result.mobile]} 
                console.log(options);
                fast2sms.sendMessage(options) //Asynchronous Function.

                var mailOptions = {
                    from: '"Krashi Sakha "<devikakushwah29@gmail.com>',
                    to: result.email,
                    subject: 'Registration successful',
                    text: 'Registration',
                    html: '<b>Welcome !' + result.name + ' to become member of <h3>Krashi Sakha</h3></b>'
                };
    
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        printLogger(2, `*********** send mail *************${JSON.stringify(result)}`, 'signup');
                        console.log("send sms");
     
                        return response.status(200).json({ msg: 'Welcome' + ' ' + result.name });
    
                    }
                })
                     
            }).catch(err => {
                console.log(err);
                printLogger(0, `*********** signup *************${JSON.stringify(err)}`, 'signup');
                return response.status(404).json({ msg: 'not saved' });
            })
        } catch (err) {
            console.log(err);
            printLogger(4, `*********** signup error  *************${JSON.stringify(err)}`, 'signup');
            return response.status(500).json({ msg: 'error find...' });
        }
});

router.post("/signin",async(request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    const { email, password } = request.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return response
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("invalid password");
            return response
                .status(400)
                .json({ errors: [{ msg: 'Invalid Password' }] });
        }

        const payload = {
            user: {
                id: user._id,
                email:user.email
            }
        };
        console.log(payload);

        jwt.sign(
            payload,
            config.get('jwtSecret'), { expiresIn: '5 days' },
            (err, token) => {
                if (err){
                    console.log(err);
                }
                console.log(token);
                response.status(200).json( {token:token , user: user});
            }
        );
    } catch (err) {
        console.error(err.message);
        response.status(500).json({msg:'Server error'});
    }

});

router.get('/view/:id',(request,response)=>{
    User.findOne({_id:request.params.id}).then(result=>{
        console.log(result);
        return response.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        return response.status(500).json(err);
    })
 })
 router.get("/view",(request,response)=>{
    User.find().then(result=>{
        console.log(result);
        return response.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        return response.status(500).json(err);
    })
 })
module.exports = router;