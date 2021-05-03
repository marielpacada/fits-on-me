// authorize clarifai app
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key e68ac66f04164956a747592514e63ca0");

const fs = require("fs");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/fitDB", { useNewUrlParser: true, useUnifiedTopology: true });

const fitSchema = new mongoose.Schema({
    bytes: Buffer,
    color: String
});

const Fit = mongoose.model("Fit", fitSchema);

Fit.insertMany([
    { bytes: fs.readFileSync("test.jpeg"), color: "red" },
    { bytes: fs.readFileSync("test.jpeg"), color: "blue" }
]);



// Fit.find(function(error, fits) {
//     if (error) { 
//         console.log(error)
//     } else { 
//         mongoose.connection.close();
//         for (var fit in fits) { 
//             console.log(fits[fit].color);
//         }
//     }
// });







// stub.PostModelOutputs(
//     {
//         model_id: "eeed0b6733a644cea07cf4c60f87ebb7",
//         inputs: [
//             { data: { image: { base64: imageBytes } } }
//         ]
//     },
//     metadata,
//     (err, response) => {
//         if (err) {
//             throw new Error(err);
//         }

//         if (response.status.code !== 10000) {
//             throw new Error("Post model outputs failed, status: " + response.status.description);
//         }

//         const output = response.outputs[0];
//         for (const color of output.data.colors) {
//             console.log(color.w3c.name);
//         }
//     }
// );

