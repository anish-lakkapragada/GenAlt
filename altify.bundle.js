const e=["https://www.facebook.com","https://www.etsy.com"],n=["No photo description available.","Image","Logo"];function t(e){if(null==e)return!1;if(e.length<15||n.includes(e))return!1;return["h1","h2"].forEach((n=>{document.querySelectorAll(n).forEach((n=>{if(n.textContent==e)return!1}))})),!0}const l="Generating Caption By GenAlt",s=function(n){const t=n.origin;return!!e.includes(t)||!!n.href.includes("search?q=images")}(window.location);let o={},c={},a={};const r=[];let i=0;const u={};let g=chrome.runtime.connect({name:"background"});function d(e){const n=document.querySelectorAll("img");for(let t=0;t<n.length;t++){const s=n[t];if(null!=a[s.src]){if(e){s.alt=l;continue}s.alt=a[s.src]}}}g.onMessage.addListener((e=>{const{url:n,caption:t}=e,l=u[n];let s=!1;for(const e of l)null!==t?"ERROR"!==t?(s=!0,o[e.src]=t,e.alt=t,e.title=t,console.log(`setting the alt to : ${t}`)):(c[e.src]=!0,e.alt=a[e.src]):(c[e.src]=!0,e.alt=a[e.src]||"");s&&i++}));let m=null,f=null,p=null;async function h(){await new Promise((e=>{try{chrome.runtime.sendMessage({purpose:"runtimeId"},(n=>{if(null==n.runtimeId)return console.log(n),console.log("leaving"),void e();e()}))}catch(e){console.log(e),e.message.includes("Extension context invalidated")&&window.location.reload()}})),null==p&&(p=document.cloneNode(!0)),await new Promise((e=>{chrome.runtime.sendMessage({purpose:"params"},(n=>{console.log("this is current image alts"),console.log(o),o=Object.assign(o,n.IMAGE_ALTS),a=Object.assign(a,n.ORIGINAL_ALTS),c=Object.assign(c,n.ERROR_SRCS),m!=n.enabled&&null!=m&&d(),f!=n.language&&null!=f&&(o={},i=0,d(!0)),n.enabled&&(console.log("fixing it up!"),function(){let e=document.querySelectorAll("img");for(let n=0;n<e.length;n++){const r=e[n];null==c[r.src]&&(t(r.alt)||null!=o[r.src]?s&&null==o[r.src]?r.alt=l:t(r.alt)&&(r.title=r.alt):(console.log(t(r.alt)),console.log("this src useless: "+r.src),r.alt=l),a[r.src]=r.alt)}}(),function(e){for(const n of document.querySelectorAll("img"))if(i>=300)n.alt=a[n.src],console.log(`exceeded limit: ${Object.keys(o).length}`);else if(!n.src.includes("data:image"))if(n.alt==l&&null==o[n.src]&&null==c[n.src]){if(console.log("running again on "+n.src),r.includes(n.src))continue;null==u[n.src]&&(u[n.src]=[n]),g.postMessage({url:n.src,language:e.language}),r.push(n.src)}else null!=o[n.src]&&o[n.src]!=n.alt&&(n.alt=o[n.src])}({maxCandidates:1,language:n.language})),f=n.language,m=n.enabled,e()}))}))}async function R(e){await new Promise((n=>{chrome.runtime.sendMessage({purpose:"params"},(t=>{t.IMAGE_ALTS!=o?(chrome.runtime.sendMessage({purpose:"update",needUpdate:"IMAGE_ALTS",IMAGE_ALTS:o}),e&&(o=t.IMAGE_ALTS)):t.ORIGINAL_ALTS!=a?(chrome.runtime.sendMessage({purpose:"update",needUpdate:"ORIGINAL_ALTS",ORIGINAL_ALTS:a}),e&&(a=t.ORIGINAL_ALTS)):t.ERROR_SRCS!=c&&(chrome.runtime.sendMessage({purpose:"update",needUpdate:"ERROR_SRCS",ERROR_SRCS:c}),e&&(c=t.ERROR_SRCS)),n()}))}))}function w(){for(const e of document.querySelectorAll("img"))null!=u[e.src]?u[e.src].push(e):u[e.src]=[e]}async function A(e){const n=new Image;n.src=e.src;let t=!0;return await new Promise((e=>{n.onload=()=>{(n.width<75||n.height<75)&&(t=!1),e()}})),t}window.addEventListener("load",(async()=>{w(),async function(){for(const e of document.querySelectorAll("img"))a[e.src]=e.alt,await A(e)||(c[e.src]=!0)}(),await new Promise((e=>{setTimeout(e,300)})),await R(!0),await h()})),setInterval(h,1500),setInterval(w,1500),setInterval((()=>{R(!1)}),18e4);
