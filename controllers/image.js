const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const PAT = process.env.PAT_CLARIFAI;
const USER_ID = 'eko_1722';       
const APP_ID = 'demo';
const MODEL_ID = 'face-detection';
// const IMAGE_URL = imageUrl;

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            // version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: req.body.input, allow_duplicate_url: true } } }
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
    
            // Since we have one input, one output will exist here
            const output = response.outputs[0];
    
            console.log("Predicted concepts:");
            for (const concept of output.data.concepts) {
                console.log(concept.name + " " + concept.value);
            }
            res.json(response);
        }
    );
}

const handleImage = (request, response, db) => {
    console.log(request.body.input);
    const { id } = request.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(user => {
            response.json(user[0].entries);
        })
        .catch(err => response.status(400).json('No Entries'));
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}