/**
 * Node application, to get the api. 
 * Deploy to Oracle Server. 
 */

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

const key = process.env.API_KEY; // to not show it in public code
const endpoint = 'https://genalt-api.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
	new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
	endpoint
);

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World! "); // response back 
})

app.get("/describeImage", async (req, res) => {
    console.log(req.query);
    const {url, maxCandidates, lang} = req.query;
 
    await computerVisionClient.describeImage(url, {maxCandidates: parseInt(maxCandidates), language: lang}).then((response) => {
        const captions = response.captions;
        const caption = captions[0];
        res.send(caption);
    })
});

app.listen(3000)