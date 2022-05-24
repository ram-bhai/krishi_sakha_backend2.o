const { Storage } = require('@google-cloud/storage');
const path = require('path');


const storage = new Storage({
    projectId: "krishi-sakha-f07d5",
    keyFilename: "krishi-sakha-f07d5-firebase-adminsdk-6sruj-c584bf63fd.json"
})


let bucketName = "gs://krishi-sakha-f07d5.appspot.com";


exports.fireBaseStorage = async(request, response, next) => {
    try {
        console.log("happy");
        console.log(request.file.filename);
        await storage.bucket(bucketName).upload(path.join(__dirname, '../', "public/images/") + request.file.filename, {
            gzip: true,
            metedata: {
                metedata: {
                    firebaseStorageDownloadTokens: "abcddcba "
                }
            }
        })

    } catch (error) {
        console.log(error)
    }
    next();
}