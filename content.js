/**
 * This is the javascript file to fix up the page with alt text. 
 * 
 * 
 */

const LENGTH_MINIMUM = 15;
const DEFAULT_ALT = 'Generating Caption';
const USELESS_PHRASES = [
	'No photo description available.',
	'Image',
	'Logo'
];

// add the describe.js module
import { describeImage } from './describe.js';

function useful(text) {
	// decides whether the alt text is useful or not based on the length;

	if (text.length < LENGTH_MINIMUM) {
		return false;
	} // calculate whether or not the alt text is even useful
	// use metric to determine this

	return true;
}

function initialFix() {
	let images = document.getElementsByTagName('img'); // access all images
	for (let i = 0; i < images.length; i++) {
		// iterate through all the images
		let image = images[i];

		console.log(`this is image alt: ${image.alt}`);
		// basically if it doesn't have sufficient alt-text
		if (image.alt.length < LENGTH_MINIMUM) {
			// just set it to something, query later
			console.log(`setting ${image.src} to default alternate text`);
			image.alt = DEFAULT_ALT;
		}
	}
}

// fix all the images here
async function fix() {
	const images = document.querySelectorAll('img'); // access all images

	const promises = [];
	for (let i = 0; i < images.length; i++) {
		const image = images[i];
		if (image.alt == DEFAULT_ALT) {
			promises.push(
				describeImage(image.src).then((caption) => {
					console.log(`this is the push to text: ${caption} and ${caption.text}`);
					image.alt = caption.text;
				})
			);
		}
	}

	await Promise.all(promises);
}

// on load, solve all the images.
window.addEventListener('load', (event) =>
	setTimeout(() => {
		initialFix();
		fix();
	}, 1000)
);

// check when dom updates

const observer = new MutationObserver((mutations) => {
	// we can check when the DOM changes, okay just refire API calls
});

observer.observe(document.body, { attributes: true, childList: true, subtree: true });
