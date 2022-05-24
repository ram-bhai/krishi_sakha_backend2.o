const router = require('express').Router();
const Category = require('../model/storageCategory.model');
router.post('/add', (request, response) => {
    Category.create(request.body).then(result => {
        return response.status(200).json(result)
    }).catch(err => {
        return response.status(500).json(err)
    })
});
router.get('/view', (request, response) => {
    Category.find().then(result => {
        return response.status(200).json(result)
    }).catch(err => {
        return response.status(500).json(err)
    })
})

module.exports = router;