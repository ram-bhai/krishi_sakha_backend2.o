const router = require('express').Router();
const Service = require('../model/service.model');
const multer = require('multer');
const fireBase = require("../middleware/firebase");
var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({ storage: storage });

router.post("/add",
    upload.single('image'),
    fireBase.fireBaseStorage,
    (request, response) => {
        console.log(request.body);
        console.log(request.file);
        Service.create({
            name: request.body.name,
            charges: request.body.charges,
            travellingCharge: request.body.travellingCharge,
            description: request.body.description,
            adminDescription: request.body.adminDescription,
            image: "https://firebasestorage.googleapis.com/v0/b/krishi-sakha-f07d5.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba",
            video: request.body.video,

        }).then(result => {
            console.log(result);
            return response.status(200).json(result)
        }).catch(error => {
            console.log(error);
            return response.status(500).json(error)
        })
    })
router.get("/view-services", (request, response) => {
    Service.find().then(result => {
        // console.log(result);
        return response.status(200).json(result)
    }).catch(error => {
        console.log(error);
        return response.status(500).json(error)
    })
})

router.get("/view-services/:sid", (request, response) => {
    Service.findOne({ _id: request.params.sid }).then(result => {
        console.log(result);
        return response.status(200).json(result)
    }).catch(error => {
        console.log(error);
        return response.status(500).json(error)
    })
})
router.post("/update", upload.single('image'),
    fireBase.fireBaseStorage,
    (request, response) => {
        Service.updateOne({ _id: request.body.sid }, {
                $set: {
                    name: request.body.name,
                    charges: request.body.charges,
                    travellingCharge: request.body.travellingCharge,
                    description: request.body.description,
                    adminDescription: request.body.adminDescription,
                    image: "https://firebasestorage.googleapis.com/v0/b/krishi-sakha-f07d5.appspot.com/o/" + request.file.filename + "?alt=media&token=abcddcba",
                    video: request.body.video,
                }
            })
            .then(result => {
                console.log(result);
                return response.status(201).json(result);
            }).catch(err => {
                console.log(err);
                return response.status(500).json({ err: "server err.." })
            });
    })

router.post("/delete", (request, response) => {
    console.log(request.body);
    Service.deleteOne({ _id: request.body.id }).then(result => {
        console.log(result)
        return response.status(200).json({ message: "Deleted successfully" })
    }).catch(error => {
        console.log(error)
        return response.status(500).json(error)
    })
})

module.exports = router;