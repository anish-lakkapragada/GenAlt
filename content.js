/**
 * This is the javascript file to fix up the page with alt text. 
 * 	
 * Objective: 
 * - reduce amount of API calls that are unnecessary
 * - do we really need to call for each image? what if their are 1000 images on the page? 
 **/

// add the describe.js module
import { describeImage } from './describe.js';
import { badSite } from './utils.js';

const LENGTH_MINIMUM = 15;
const DEFAULT_ALT = 'Generating Caption By GenAlt';
const USELESS_PHRASES = [
	'No photo description available.',
	'Image',
	'Logo'
];

const IMAGES_SRC = {};
const ERROR_SRC = {}; // images known to cause trouble
let iterations = 0;
const resetAlt = !badSite(window.location);

const rateLimiter = { numCalls: 0, date: new Date() };

function useful(text) {
	// decides whether the alt text is useful or not based on the length;

	if (text == null) {
		return false;
	}

	if (text.length < LENGTH_MINIMUM || USELESS_PHRASES.includes(text)) {
		return false;
	} // calculate whether or not the alt text is even useful
	// use metric to determine this
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

		if (!useful(image.alt) && IMAGES_SRC[image.src] == undefined) {
			// just set it to something, query later
			image.alt = DEFAULT_ALT;
		} else if (resetAlt && IMAGES_SRC[image.src] == undefined) {
			image.alt = DEFAULT_ALT;
		}
	}
}

// fix all the images here
async function fix() {
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
		if (image.alt == DEFAULT_ALT && IMAGES_SRC[image.src] == undefined) {
			promises.push(
				describeImage(image.src).then((caption) => {
					if (caption != null) {
						image.alt = caption.text;
						IMAGES_SRC[image.src] = image.alt;
						console.log(IMAGES_SRC);
						rateLimiter.numCalls++;
					} else if (caption === 'ERROR') {
						ERROR_SRC[image.src] = true;
					}
				})
			);
		} else if (
			image.alt == DEFAULT_ALT &&
			IMAGES_SRC[image.src] != undefined &&
			IMAGES_SRC[image.src] != image.alt
		) {
			image.alt = IMAGES_SRC[image.src]; // if it's the same source, it's this caption
		}

		console.log(`done with this image`);
	}

	console.log(IMAGES_SRC);
	console.log('this is the deal');
	await Promise.all(promises);
}

// on load, solve all the images.
window.addEventListener('load', (event) =>
	setTimeout(() => {
		initialFix();
		fix();
		iterations++;
	}, 1000)
);

// only run the setInterval not on the first
setInterval(() => {
	if (iterations > 0) {
		initialFix();
		fix();
		iterations++;
	}
}, 2000);
