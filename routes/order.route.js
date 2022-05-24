const router = require('express').Router();
const routeCache = require('route-cache');
const Order = require('../model/order.model');
const fast2sms = require('fast-two-sms');
const nodemailer = require('nodemailer');
require('dotenv').config();
const auth = require('../middleware/customer.auth');
const { printLogger } = require('../core/utility');
const Razorpay = require("razorpay");
var instance = new Razorpay({ key_id: 'rzp_test_7mhArK6g7mgek0', key_secret: 'Pn50vQs9YfV6fKv2SL8OpqCd' });
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
router.post("/place-order", auth, (request, response) => {
    const { userId, total, address, mobile, shipping, payment, duration } = request.body;
    const orderItem = { userId, total, address, mobile, shipping, payment, duration }
    var order = new Order(orderItem);
    for (i = 0; i < request.body.orderList.length; i++) {
        var tool_id = request.body.orderList[i].tool_id;
        var bookingDate = request.body.orderList[i].bookingDate;
        order.orderList.push({ tool_id: tool_id, bookingDate: bookingDate });
    }
    order.save()
        .then(result => {
            console.log("order" + result);

            var options = {
                authorization: "jbKmfDycSI0QUAankG5pruwXetOsiYPVJvE1zCx7d6oLg2NZFMthPWGFymDc0uKIzTVZ5482EsaQvi19",
                message: ' Welcome to khetikisani! You have successfully placed order',
                numbers: [result.mobile]
            }
            console.log(options);
            fast2sms.sendMessage(options) //Asynchronous Function.

            var mailOptions = {
                from: '"Krashi Sakha "<devikakushwah29@gmail.com>',
                to: request.user.email,
                subject: 'Registration successful',
                text: 'Registration',
                html: '<b>Welcome !' + ' to become member of <h3>Krashi Sakha</h3></b>'
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    printLogger(2, `*********** send mail *************${JSON.stringify(result)}`, 'signup');
                    console.log("send sms and otp");

                    return response.status(200).json({ msg: 'Welcome' + ' ' + result.name });

                }

            })
        }).catch(err => {
            console.log(err);

            return response.status(500).json(err);
        });

});
router.post("/pay", (req, res) => {
    try {
        let reqBody = request.body;
        printLogger(2, `*********** payment *************${JSON.stringify(reqBody)}`, 'order');
        instance.orders.create({
            amount: request.body.amount,
            currency: "INR"
        }, (err, order) => {
            if (err) {
                printLogger(0, `*********** payment *************${JSON.stringify(err)}`, 'order');
                console.log(err);
                res.status(200).json(err);
            } else
                console.log(order);
            printLogger(2, `*********** place order *************${JSON.stringify(order)}`, 'order');
            res.status(200).json(order);
        })
    } catch (err) {
        printLogger(4, `*********** payment api *************${JSON.stringify(err)}`, 'order');
        res.status(200).json(err);
    }
});

router.post('/payment-status', (req, res) => {
    try {
        instance.payments.fetch(req.body.razorpay_payment_id).then((result) => {
            console.log(result);
            printLogger(2, `*********** payment *************${JSON.stringify(result)}`, 'order');
            res.send("payment success");
        }).catch((err) => {
            console.log(err);
            printLogger(0, `*********** payment *************${JSON.stringify(err)}`, 'order');
            res.status(404).json(err);
        });
    } catch (err) {
        printLogger(4, `*********** payment *************${JSON.stringify(err)}`, 'order');
        res.status(500).json(err);
    }
});

router.get('/view-order', (request, response) => {
    try {
        Order.find().populate("orderList.tool_id").populate("userId").then(result => {
            console.log(result);

            response.status(200).json(result);
        }).catch(err => {
            console.log(err);

            return response.status(404).json({ err: 'Server error' });
        })
    } catch (err) {
        console.log(err);

        response.status(500).json(order);
    }
});
router.get('/view-order/:uid', (request, response) => {
    try {
        Order.find({ userId: request.params.uid }).populate("orderList.tool_id").then(result => {
            console.log(result);

            response.status(200).json(result);
        }).catch(err => {
            console.log(err);

            return response.status(404).json({ err: 'Server error' });
        })
    } catch (err) {
        console.log(err);

        response.status(500).json(order);
    }
});

module.exports = router;