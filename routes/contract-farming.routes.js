const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require("../controller/contract-farming.controller");
const multer = require('multer');
const fireBase = require("../middleware/firebase");


var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({ storage: storage });




router.post("/contract-farming", upload.single('image'), fireBase.fireBaseStorage, userController.contract);

router.get("/view-requests", userController.viewList);

router.post("/update/:cid", userController.approved);

router.post("/cancel/:cid", userController.aborted);

router.get("/viewOne/:cid", userController.lookanyone);

router.get("/accepted-req", userController.verified);

router.get("/cancelled", userController.abortedlist);


module.exports = router;