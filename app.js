const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;
const path = require('path');
const adminRouter = require('./routes/admin.route');
const customerRouter = require('./routes/customer.route');
const servicesRouter = require('./routes/service.route');
const orderRouter = require('./routes/order.route');
const storageCategoryRouter = require('./routes/storagecategory.route');
const storageRouter = require('./routes/storage.route');
const contractRouter = require('./routes/contract-farming.routes');
const bookedStorageRouter = require('./routes/storageBooked.route');
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://devikakushwah:Radhakrishna%4029@newcluster.7o13k.mongodb.net/khetikisani").then(result => {
    console.log("Database has been connected")
}).catch(error => {
    console.log("Unable to connect from database")
})
const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/contracts", contractRouter);
app.use("/booked-storage", bookedStorageRouter);
app.use("/storage", storageRouter);
app.use("/storageCategory", storageCategoryRouter);
app.use("/order", orderRouter);
app.use("/service", servicesRouter);
app.use("/customer", customerRouter);
app.use("/admin", adminRouter);

app.listen(port, () => {
    console.log("server running at port no." + port)
});