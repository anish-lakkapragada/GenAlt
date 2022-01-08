/**
 * More util functions. 
 */

const badSites = [
	'https://www.facebook.com/',
	'https://www.etsy.com'
];

const USELESS_PHRASES = [
	'No photo description available.',
	'Image',
	'Logo'
];
export function useful(text) {
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
export function badSite(location) {
	const URL = location.origin;

	if (badSites.includes(URL)) {
		return true;
	}

	// detect if this is google images
	if (location.href.includes('search?q=images')) {
		return true;
	}

	return false;
}
