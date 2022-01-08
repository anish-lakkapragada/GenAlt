/**
 * Content script to run all code. 
 */

import {updateData, main} from "./altify.js"; 

// on load, solve all the images.
window.addEventListener('load', async () => {
	await updateData(true); // first receive the stuff 
	await main(); 
}); 

setInterval(main, 1500); // run this function every 1.5s 
setInterval(() => {updateData(false);}, 3 * 60 * 1000); // update the data every 3 mins