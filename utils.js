const badSites = [
	'https://www.facebook.com/'
];

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
