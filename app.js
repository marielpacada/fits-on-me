// authorize clarifai app
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key e68ac66f04164956a747592514e63ca0");

// require file system
const fs = require("fs");
const imageBytes = fs.readFileSync("test.jpeg");

stub.PostModelOutputs(
    {
        model_id: "eeed0b6733a644cea07cf4c60f87ebb7",
        inputs: [
            { data: { image: { base64: imageBytes } } }
        ]
    },
    metadata,
    (err, response) => {
        if (err) {
            throw new Error(err);
        }

        if (response.status.code !== 10000) {
            throw new Error("Post model outputs failed, status: " + response.status.description);
        }

        const output = response.outputs[0];
        // console.log(output);
        for (const color of output.data.colors) {
            console.log(color.w3c.hex);
        }
    }
);

