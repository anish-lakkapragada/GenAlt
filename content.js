import { describeImage } from './describe.js';
import { badSite } from './utils.js';

const LENGTH_MINIMUM = 15;
const DEFAULT_ALT = 'Generating Caption By GenAlt';
const USELESS_PHRASES = [
	'No photo description available.',
	'Image',
	'Logo'
];

let IMAGE_ALTS = {};
const ORIGINAL_ALTS = {}; // original alt-text
const ERROR_SRC = {}; // images known to cause trouble
const resetAlt = !badSite(window.location);

const rateLimiter = { numCalls: 0, date: new Date() }; // rate limit object (6 calls / 1s)

function useful(text) {
	// decides whether the alt text is useful or not based on the length;

	if (text == null) {
		return false;
	}

	if (text.length < LENGTH_MINIMUM || USELESS_PHRASES.includes(text)) {
		return false;
	}

	const titleTypes = [
		'h1',
		'h2'
	];

	titleTypes.forEach((type) => {
		const titles = document.querySelectorAll(type);
		titles.forEach((title) => {
			if (title.textContent == text) {
				return false;
			}
		});
	});

	return true;
}

function initialFix() {
	let images = document.querySelectorAll('img'); // access all images
	for (let i = 0; i < images.length; i++) {
		// iterate through all the images
		const image = images[i];
		if (ERROR_SRC[image.src] != undefined) {
			continue;
		}

		if (!useful(image.alt) && IMAGE_ALTS[image.src] == undefined) {
			// just set it to something, query later
			image.alt = DEFAULT_ALT;
		} else if (resetAlt && IMAGE_ALTS[image.src] == undefined) {
			image.alt = DEFAULT_ALT;
		}
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
					if (caption != null) {
						ORIGINAL_ALTS[image.src] = image.alt; // original 
						image.alt = caption.text;
						IMAGE_ALTS[image.src] = image.alt;
						console.log(IMAGE_ALTS);
						rateLimiter.numCalls++;
					} else if (caption === 'ERROR') {
						ERROR_SRC[image.src] = true;
					}
				})
			);
		} else if (
			image.alt == DEFAULT_ALT &&
			IMAGE_ALTS[image.src] != undefined &&
			IMAGE_ALTS[image.src] != image.alt
		) {
			image.alt = IMAGE_ALTS[image.src]; // if it's the same source, it's this caption
		}
		
		console.log(`done with this image`);
	}	

	console.log(IMAGE_ALTS);
	console.log('this is the deal');
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

	await new Promise((resolve) => {
		chrome.runtime.sendMessage({"purpose" : "params"}, (response) => {

			console.log("HEELOO"); 

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

// on load, solve all the images.
window.addEventListener('load', main); 

setInterval(main, 1500); // run this function every 1.5s 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request);
	sendResponse({"from" : "content"});
});