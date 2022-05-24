const router = require('express').Router();
const StorageBooked = require('../model/storageBooked.model');

const routeCache = require('route-cache');
const { printLogger } = require('../core/utility');


router.post('/add', async(request, response) => {
    try {

        const { payment, duration, mobile, total } = request.body;
        const userId = request.body.uid;
        const storage_id = request.body.sid;
        const storageItem = { userId, storage_id, payment, duration, mobile, total };
        console.log(request.body.items.length);
        var storageBooked = new StorageBooked(storageItem);
        for (i = 0; i < request.body.items.length; i++) {
            var name = request.body.items[i].name;
            var weight = request.body.items[i].weight;
            storageBooked.items.push({ name: name, weight: weight });
        }


        storageBooked.save()
            .then(result => {
                console.log("order" + result);
                printLogger(2, `*********** place order *************${JSON.stringify(result)}`, 'order');
                return response.status(200).json(result);
            }).catch(err => {
                console.log(err);
                printLogger(0, `*********** place order *************${JSON.stringify(err)}`, 'order');
                return response.status(500).json({ err: 'Server error' });
            });
    } catch (error) {
        printLogger(4, `CONTROLLER:- punchIn Error:- ${JSON.stringify(error)}`, 'order');
        console.log(error);
    }
});


router.get('/view-booked', (request, response) => {
    try {
        StorageBooked.find().populate("items").populate("storage_id").populate("userId").then(result => {
            console.log(result);
            printLogger(2, `*********** view order *************${JSON.stringify(result)}`, 'order');
            response.status(200).json(result);
        }).catch(err => {
            console.log(err);
            printLogger(0, `*********** view order *************${JSON.stringify(err)}`, 'order');
            return response.status(404).json(err);
        })
    } catch (err) {
        console.log(err);
        printLogger(4, `*********** view order *************${JSON.stringify(err)}`, 'order');
        response.status(500).json(err);
    }
});
router.get('/views/:bid', (request, response) => {
    try {
        StorageBooked.find({ _id: request.params.bid }).populate("storage_id").populate("userId").then(result => {
            console.log(result);
            printLogger(2, `*********** view order *************${JSON.stringify(result)}`, 'order');
            response.status(200).json(result);
        }).catch(err => {
            console.log(err);
            printLogger(0, `*********** view order *************${JSON.stringify(err)}`, 'order');
            return response.status(404).json(err);
        })
    } catch (err) {
        console.log(err);
        printLogger(4, `*********** view order *************${JSON.stringify(err)}`, 'order');
        response.status(500).json(err);
    }
});


router.get('/view-booked/:uid', (request, response) => {
    try {
        StorageBooked.find({ userId: request.params.uid }).then(result => {
            console.log(result);
            printLogger(2, `*********** view order *************${JSON.stringify(result)}`, 'order');
            response.status(200).json(result);
        }).catch(err => {
            console.log(err);
            printLogger(0, `*********** view order *************${JSON.stringify(err)}`, 'order');
            return response.status(404).json(err);
        })
    } catch (err) {
        console.log(err);
        printLogger(4, `*********** view order *************${JSON.stringify(err)}`, 'order');
        response.status(500).json(err);
    }
});



router.get('/update-empty/:uid/:bid', (request, response) => {
    StorageBooked.find({ userId: request.params.uid }).then(result => {
        console.log(result);
        StorageBooked.updateOne({ _id: request.params.bid }, {
            $set: {
                isEmpty: false
            }
        }).then(result => {

            printLogger(2, `*********** view order *************${JSON.stringify(result)}`, 'order');
            response.status(200).json(result);
        }).catch(err => {
            console.log(err);
            printLogger(0, `*********** view order *************${JSON.stringify(err)}`, 'order');
            return response.status(404).json(err);
        })
    }).catch(err => {
        return response.status(404).json({ msg: "user not booked" });
    });
});

module.exports = router;