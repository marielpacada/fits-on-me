// authorize clarifai app
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
const key = require("./secrets/auth").key;
const model = "eeed0b6733a644cea07cf4c60f87ebb7"; // color model
metadata.set("authorization", "Key " + key);

// connect to mongoose
const fs = require("fs");
global.fetch = require("node-fetch");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/fitDB", { useNewUrlParser: true, useUnifiedTopology: true });
const fitSchema = new mongoose.Schema({ bytes: Buffer, color: String });
const Fit = mongoose.model("Fit", fitSchema);

const getColorTag = function (imageBytes) {
    var mainColor = "";
    stub.PostModelOutputs(
        {
            model_id: model,
            inputs: [{ data: { image: { base64: imageBytes } } }]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }
            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }
            mainColor = response.outputs[0].data.colors[0].w3c.name;
        }
    );
    return mainColor;
};

const upload = async function (file) {
    const imageBytes = fs.readFileSync(file);
    const subcolor = getColorTag(imageBytes);
    const color = await fetch("https://simple-colors-api.herokuapp.com/" + subcolor);
    Fit.insertMany([{ bytes: imageBytes, color: color[0] }]);
    return !color ? false : true;
};

module.exports = { upload: upload };