/**
 * Script with all the functions needed to make the page 
 * have alt-text. 
 */

import { describeImage } from './describe.js';
import { badSite, useful } from './utils.js';
import {OCR, needsOCR} from "./OCR.js"; 

const DEFAULT_ALT = 'Generating Caption By GenAlt';

const resetAlt = badSite(window.location);
let IMAGE_ALTS = {};
let ORIGINAL_ALTS = {}; // original alt-text
let ERROR_SRCS = {}; // images known to cause trouble


let REQUESTS_SENT = 0;
let NUM_REQUESTS_MAX = 250;
const rateLimiter = { numCalls: 0, date: new Date() }; // rate limit object (6 calls / 1s)

function initialFix() {
	let images = document.querySelectorAll('img'); // access all images
	for (let i = 0; i < images.length; i++) {
		// iterate through all the images
		const image = images[i];
		if (ERROR_SRCS[image.src] != undefined) {
			continue;
		}

		if (!useful(image.alt) && IMAGE_ALTS[image.src] == undefined) {
			// just set it to something, query later
			console.log(useful(image.alt));
			console.log("this src useless: " + image.src); 
			image.alt = DEFAULT_ALT;
		} else if (resetAlt && IMAGE_ALTS[image.src] == undefined) {
			image.alt = DEFAULT_ALT;
		}

		ORIGINAL_ALTS[image.src] = image.alt;
	}
}

// fix all the images here
async function fix(params) {
	const images = document.querySelectorAll('img'); // access all images

	const promises = [];

	for (let i = 0; i < images.length; i++) {
		if (rateLimiter.numCalls == 6) {
			await new Promise((resolve) => {
				setTimeout(resolve, 1000 - (new Date() - rateLimiter.date));
			});

			rateLimiter.numCalls = 0;
			rateLimiter.date = new Date();
		}

		const image = images[i];
		if (image.alt == DEFAULT_ALT && IMAGE_ALTS[image.src] == undefined) {
			promises.push(
				describeImage(image.src, params).then((caption) => {
					if (caption === null) {
						ERROR_SRCS[image.src] = true;
						image.alt = ORIGINAL_ALTS[image.src] || "";
					}

					else if (needsOCR(caption.text)) {
						promises.push(OCR(image.src).then(text => {
							if (text != null) {
								image.alt = text; 
								IMAGE_ALTS[image.src] = text; 
							}
						}))
					}

					else if (caption?.text != null) {			
						console.log(`${caption.text} doesn't require no ocr`); 
						image.alt = caption.text;
						IMAGE_ALTS[image.src] = image.alt;
						console.log(IMAGE_ALTS);
					} else if (caption === 'ERROR') {
						ERROR_SRCS[image.src] = true;
						image.alt = ORIGINAL_ALTS[image.src];
					}

					rateLimiter.numCalls++;
				})
			);
		} else if (
			image.alt == DEFAULT_ALT &&
			IMAGE_ALTS[image.src] != undefined &&
			IMAGE_ALTS[image.src] != image.alt
		) {
			image.alt = IMAGE_ALTS[image.src]; // if it's the same source, it's this caption
		}	
	}	

	await Promise.all(promises);
}

let pastEnabled = null; 
let pastLanguage = null;
let originalDocument = null; 

async function main() {	
	await new Promise((resolve) => {
		try {
			chrome.runtime.sendMessage({"purpose" : "runtimeId"}, (response) => {
				if (response.runtimeId == undefined) {
					console.log(response);
					console.log("leaving");
					resolve(); 
					return; 
				}

				resolve(); 
			});
		} catch (e) {
			console.log(e);
			if (e.message.includes("Extension context invalidated")){
				window.location.reload();
			}
		} 
	})

	if (originalDocument == null) {
		originalDocument = document.cloneNode(true);
	}

	// do the work (first check if we should) on all the images. 
	await new Promise((resolve) => {
		chrome.runtime.sendMessage({"purpose" : "params"}, (response) => {

			// we may know some of this 
			IMAGE_ALTS = Object.assign(IMAGE_ALTS, response.IMAGE_ALTS);
			ORIGINAL_ALTS = Object.assign(ORIGINAL_ALTS, response.ORIGINAL_ALTS);
			ERROR_SRCS = Object.assign(ERROR_SRCS, response.ERROR_SRCS);

			if (pastEnabled != response.enabled && pastEnabled != null) {
				// fix all images. 
				const images = document.querySelectorAll('img'); // access all images
				for (let i = 0; i < images.length; i++) {
					const image = images[i];
					if (ORIGINAL_ALTS[image.src] != undefined) {
						image.alt = ORIGINAL_ALTS[image.src];
					}
				}
			}

			if (pastLanguage != response.language && pastLanguage != null) {
				IMAGE_ALTS = {}; 
				REQUESTS_SENT = 0; 
				NUM_REQUESTS_MAX = Math.round(NUM_REQUESTS_MAX / 2); // exponential decay 
				// if it's enabled, fix all images. 
			}

			if (response.enabled) {
				initialFix(); 
				fix({maxCandidates: 1, language: response.language});
			}

			pastLanguage = response.language; 
			pastEnabled = response.enabled;

			resolve(); 
		});
	});
}

async function updateData(updateStoredImages) {
	// update background.js chrome.storage with new alts 

	await new Promise((resolve) => {
		chrome.runtime.sendMessage({"purpose" : "params"}, (response) => {
			if (response.IMAGE_ALTS != IMAGE_ALTS) {
				chrome.runtime.sendMessage({'purpose': 'update', 'needUpdate' : 'IMAGE_ALTS', "IMAGE_ALTS" : IMAGE_ALTS});
				if (updateStoredImages) {
					IMAGE_ALTS = response.IMAGE_ALTS;
					console.log("loaded IMAGE_ALTS"); 
					setInterval(() => {}, 1000 * 10); 
				}
			}

			else if (response.ORIGINAL_ALTS != ORIGINAL_ALTS) {
				chrome.runtime.sendMessage({'purpose': 'update', 'needUpdate' : 'ORIGINAL_ALTS', "ORIGINAL_ALTS" : ORIGINAL_ALTS});
				if (updateStoredImages) {
					ORIGINAL_ALTS = response.ORIGINAL_ALTS;
				}
			}

			else if (response.ERROR_SRCS != ERROR_SRCS) {
				chrome.runtime.sendMessage({'purpose': 'update', 'needUpdate' : 'ERROR_SRCS', "ERROR_SRCS" : ERROR_SRCS});
				if (updateStoredImages) {
					ERROR_SRCS = response.ERROR_SRCS;
				}
			}

			resolve(); 
		});
	})
}

/**
 * ON LOAD: 
 * 1) store all image objects with src
 * 2) describe the port.onMessage event listener
* 3) fix these images!
 */

const SRC_IMAGES = {}; 
for (const image of document.querySelectorAll("img")) {
	if (SRC_IMAGES[image.src] == undefined) {
		SRC_IMAGES[image.src] = [image]; 
		continue; 
	}

	SRC_IMAGES[image.src].push(image);
}

const port = chrome.runtime.connect({"name" : "background"});
port.onMessage.addListener((msg) => {
	const {url, caption} = msg; 
	const images = SRC_IMAGES[url];
	for (const image of images) {
		image.alt = caption; 
	}
}); 

window.addEventListener('load', async () => {
	await updateData(true); // first receive the stuff 
	await main(); 
}); 

setInterval(main, 1500); // run this function every 1.5s 
setInterval(() => {updateData(false);}, 3 * 60 * 1000); // update the data every 3 mins