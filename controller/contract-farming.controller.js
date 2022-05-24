const { validator, validationResult } = require('express-validator');
const contract = require('../model/contract_farming.model')
const nodemailer = require('nodemailer');
require('dotenv').config();
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});



exports.contract = (request, response, next) => {

    const errors = validationResult(request)
    if (!errors.isEmpty)
        return response.status(400).json({ errors: errors.array() });
    console.log(request.body);

    contract.create({
            name: request.body.name,
            email: request.body.email,
            mobile: request.body.mobile,
            address: request.body.address,
            description: request.body.description,
            image: "https://firebasestorage.googleapis.com/v0/b/krishi-sakha-f07d5.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba",
            Area: request.body.area,
            start_date: request.body.start_date,
            end_date: request.body.end_date,
        }).then(result => {
            console.log(result)
            try {
                var mailOptions = {
                    from: '"Krashi Sakha "<devikakushwah29@gmail.com>',
                    to: result.email,
                    subject: 'contract-farming registration',
                    text: 'Application has been sent successfully',
                    html: '<b>Welcome !</b>' + result.name + '<br> your application has been sent to the admin department of krishi sakha.<br> we will inform you as soon as possible regarding your application updation.</br> <br> Thank you <br><h3>Krashi Sakha</h3>'
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        printLogger(2, `*********** send mail *************${JSON.stringify(result)}`, 'contract-farming');
                        return response.status(200).json({ msg: 'you have mail notification on given email' + ' ' + result.name });

                    }

                })
            } catch (err) {
                console.log(err);
                printLogger(4, `***********  contract-error  *************${JSON.stringify(err)}`, 'contract-farming');
                return response.status(500).json({ msg: 'error find...' });
            }
            return response.status(200).json(result)
        })
        .catch(error => {
            console.log(error)
            return response.status(500).json({ error: "there is an unwanted error" })
        })
}


exports.viewList = (request, response) => {
    contract.find({ pending: true } && { pending: false }).then(result => {
        return response.status(200).json(result)
    }).catch(error => {
        return response.status(500).json(error)
    })
}


exports.lookanyone = (request, response) => {
    contract.findOne({ _id: request.params.cid }).then(result => {
        return response.status(200).json(result)
    }).catch(error => {
        return response.status(500).json(error)
    })
}

exports.approved = async(request, response) => {
    const data = await contract.findOne({ _id: request.params.cid })
    console.log(data)
    contract.updateOne({ _id: request.params.cid }, {
        $set: {
            pending: request.body.pending,
            verification: request.body.verification,
            isApproved: request.body.approved
        }
    }).then(result => {
        console.log(result);
        if (result.modifiedCount) {
            try {
                var mailOptions = {
                    from: '"Krashi Sakha "<devikakushwah29@gmail.com>',
                    to: data.email,
                    subject: 'contract-farming approval',
                    text: 'your documents are verified',
                    html: '<b>Dear </b>' + data.name + '<br> For your acknowledgement we ensure that your documents are verified.<br> and request has been approved by admin.</br> <br> Thank you</br> <br>Regards<br><h3>Krashi Sakha</h3>'
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        printLogger(2, `*********** send mail *************${JSON.stringify(result)}`, 'contract-farming');
                        return response.status(200).json({ msg: 'you have mail notification on given email' + ' ' + result.name });

                    }

                })
            } catch (err) {
                console.log(err);
                printLogger(4, `***********  contract-error  *************${JSON.stringify(err)}`, 'contract-farming');
                return response.status(500).json({ msg: 'error find...' });
            }
        } else {
            return response.status(201).json({ message: "Already approved" });
        }
    }).catch(error => {
        console.log(error);
        return response.status(500).json(error)
    })
}


exports.aborted = async(request, response) => {

    const data = await contract.findOne({ _id: request.params.cid })
    console.log(data);
    contract.updateOne({ _id: request.params.cid }, {
        $set: {
            pending: request.body.pending,
            verification: request.body.verification,
            isApproved: request.body.approved
        }
    }).then(result => {
        if (result.modifiedCount) {
            try {
                var mailOptions = {
                    from: '"Krashi Sakha "<devikakushwah29@gmail.com>',
                    to: data.email,
                    subject: 'contract-farming approval',
                    text: 'your documents are verified',
                    html: '<b>Dear </b>' + data.name + '<br> For your acknowledgement, we ensure that your documents are not verified.<br> and request has been rejected from admin.</br> <br> Thank you</br> <br>Regards<br><h3>Krashi Sakha</h3>'
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        printLogger(2, `*********** send mail *************${JSON.stringify(result)}`, 'contract-farming');
                        return response.status(200).json({ msg: 'you have mail notification on given email' + ' ' + result.name });

                    }

                })
            } catch (err) {
                console.log(err);
                printLogger(4, `***********  contract-error  *************${JSON.stringify(err)}`, 'contract-farming');
                return response.status(500).json({ msg: 'error find...' });
            }
            return response.status(201).json(result)
        } else {
            return response.status(200).json({ message: "Already aborted" });
        }
    }).catch(error => {
        return response.status(500).json(error)
    })
}


exports.abortedlist = (request, response) => {
    contract.find({
        pending: false,
        isApproved: false,
        verification: false
    }).then(result => {
        return response.status(200).json(result)
    }).catch(error => {
        return response.status(500).json(error)
    })
}

exports.verified = (request, response) => {
    contract.find({
        pending: false,
        isApproved: true,
        verification: true
    }).then(result => {
        return response.status(200).json(result)
    }).catch(error => {
        return response.status(500).json(error)
    })
}