const e=["https://www.facebook.com","https://www.etsy.com"],n=["No photo description available.","Image","Logo"];function t(e){if(null==e)return!1;if(e.length<15||n.includes(e))return!1;return["h1","h2"].forEach((n=>{document.querySelectorAll(n).forEach((n=>{if(n.textContent==e)return!1}))})),!0}const o="Generating Caption By GenAlt",l=function(n){const t=n.origin;return!!e.includes(t)||!!n.href.includes("search?q=images")}(window.location);let s={},c={},r={};const a=[];let i=0;const u={};let g=chrome.runtime.connect({name:"background"});function d(e){const n=document.querySelectorAll("img");for(let t=0;t<n.length;t++){const l=n[t];if(null!=r[l.src]){if(e){l.alt=o;continue}l.alt=r[l.src]}}}g.onMessage.addListener((e=>{const{url:n,caption:t}=e,o=u[n];let l=!1;console.log(`for this url: ${n} getting this caption back: ${t}`);for(const e of o)null!==t?"ERROR"!==t?(l=!0,s[e.src]=t,e.alt=t,e.title=t,console.log(`setting the alt to : ${t}`)):(console.log("ERROR DAMNIST"),c[e.src]=!0,e.alt=r[e.src],console.log(r[e.src]),console.log("replaced")):(c[e.src]=!0,e.alt=r[e.src]||"");l&&SUCCESSFUL_CAPTIONS++}));let m=null,f=null,S=null;async function h(){await new Promise((e=>{try{chrome.runtime.sendMessage({purpose:"runtimeId"},(n=>{if(null==n.runtimeId)return console.log(n),console.log("leaving"),void e();e()}))}catch(e){console.log(e),e.message.includes("Extension context invalidated")&&window.location.reload()}})),null==S&&(S=document.cloneNode(!0)),await new Promise((e=>{chrome.runtime.sendMessage({purpose:"params"},(n=>{console.log("this is current image alts"),console.log(s),s=Object.assign(s,n.IMAGE_ALTS),r=Object.assign(r,n.ORIGINAL_ALTS),c=Object.assign(c,n.ERROR_SRCS),m!=n.enabled&&null!=m&&d(),f!=n.language&&null!=f&&(s={},SUCCESSFUL_CAPTIONS=0,i=0,d(!0)),n.enabled&&(console.log("fixing it up!"),function(){let e=document.querySelectorAll("img");for(let n=0;n<e.length;n++){const a=e[n];r[a.src]=a.alt,null==c[a.src]&&(t(a.alt)||null!=s[a.src]?l&&null==s[a.src]?a.alt=o:t(a.alt)&&(a.title=a.alt):(console.log(t(a.alt)),console.log("this src useless: "+a.src),a.alt=o))}}(),function(e){for(const n of document.querySelectorAll("img"))if(i>=100)n.alt=r[n.src],console.log(`exceeded limit: ${Object.keys(s).length}`),d();else if(!n.src.includes("data:image")&&!n.src.includes("svg"))if(n.alt==o&&null==s[n.src]&&null==c[n.src]){if(console.log("running again on "+n.src),console.log(c),console.log("error sources"),a.includes(n.src))continue;null==u[n.src]&&(u[n.src]=[n]),n.width>=75&&n.height>=75?(g.postMessage({url:n.src,language:e.language}),i++):console.log("SAVED"),a.push(n.src)}else null!=s[n.src]&&s[n.src]!=n.alt&&(n.alt=s[n.src])}({maxCandidates:1,language:n.language})),f=n.language,m=n.enabled,e()}))}))}async function p(e){await new Promise((n=>{chrome.runtime.sendMessage({purpose:"params"},(t=>{t.IMAGE_ALTS!=s?(chrome.runtime.sendMessage({purpose:"update",needUpdate:"IMAGE_ALTS",IMAGE_ALTS:s}),e&&(s=t.IMAGE_ALTS)):t.ORIGINAL_ALTS!=r?(chrome.runtime.sendMessage({purpose:"update",needUpdate:"ORIGINAL_ALTS",ORIGINAL_ALTS:r}),e&&(r=t.ORIGINAL_ALTS)):t.ERROR_SRCS!=c&&(chrome.runtime.sendMessage({purpose:"update",needUpdate:"ERROR_SRCS",ERROR_SRCS:c}),e&&(c=t.ERROR_SRCS)),n()}))}))}function A(){for(const e of document.querySelectorAll("img"))null!=u[e.src]?u[e.src].push(e):u[e.src]=[e]}async function R(e){const n=new Image;n.src=e.src;let t=!0;return await new Promise((e=>{n.onload=()=>{(n.width<75||n.height<75)&&(t=!1),e()}})),t}window.addEventListener("load",(async()=>{A(),async function(){for(const e of document.querySelectorAll("img"))r[e.src]=e.alt,await R(e)||(c[e.src]=!0)}(),await new Promise((e=>{setTimeout(e,300)})),await p(!0),await h()})),setInterval(h,1500),setInterval(A,1500),setInterval((()=>{p(!1)}),18e4);
