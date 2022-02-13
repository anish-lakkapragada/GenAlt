import {useful} from './utils';
const port = chrome.runtime.connect({ name: 'background' });
port.onMessage.addListener((msg) => {
  const {urls} = msg; 
  const srcUrl = urls[0];
  const linkUrl = urls[1];

  console.log(msg);
  for (const image of document.querySelectorAll('img')) {
    console.log(image);
    if (image.src.toUpperCase() == srcUrl.toUpperCase() || image.src.toUpperCase() == linkUrl?.toUpperCase()) {
      console.log('here');
      image.alt = msg.caption; 
      image.title = msg.caption; // set the message
    }
  }
});

// go through each existing image and set it's title to the alt-text
const titleImages = () => {
  for (const image of document.querySelectorAll('img')) {
    if (useful(image.alt)) {
      image.title = image.alt; 
    }
  }
};

window.addEventListener('load', titleImages); 
setInterval(titleImages, 2000);