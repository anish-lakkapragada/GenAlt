"use strict";console.log("here yay!");const e={numCalls:0,date:new Date};chrome.runtime.onConnect.addListener((o=>{const t=o;console.log(`the name for this port is: ${t.name}`),t.onMessage.addListener((async o=>{const{url:a,language:n}=o;console.log(`using this language: ${n}`),6==e.numCalls&&(console.log("waiting"),await new Promise((o=>setTimeout(o,1e3-(new Date-e.date)))),console.log("done waiting"),e.numCalls=0,e.date=new Date);const s=await async function(e,o){const t="https://poggers-image-captioning-api.cognitiveservices.azure.com/vision/v3.2/describe?maxCandidates=1&language="+o.language,a=await fetch(t,{method:"POST",mode:"cors",headers:{"Content-Type":"application/json","Ocp-Apim-Subscription-Key":"78e4e95e416348b6b841a36cd2f7ac50"},body:JSON.stringify({url:e})}),n=await a.json();return console.log(n),null==n.description||0==n?.description.captions.length?(console.log("probably an error"),console.log(n),"ERROR"):n.description.captions[0].text}(a,{maxCandidates:1,language:n});if(e.numCalls++,"ERROR"!==s){if(function(e){if(null==e)return!1;const o=["Text".toUpperCase(),"Image".toUpperCase(),"Letter".toUpperCase(),"Application".toUpperCase(),"Logo".toUpperCase(),"Diagram".toUpperCase(),"chart".toUpperCase(),"graph".toUpperCase(),"graphical user interface, website".toUpperCase(),"graphical user interface, text, application".toUpperCase(),"graphical user interface".toUpperCase()],t=e.toUpperCase();if(o.includes(t))return!0;for(const e of o)if(e.includes(t))return!0;return!1}(s)){e.numCalls++;const o=await async function(e){let o="OCR Description: ";const t=(await fetch("https://poggers-image-captioning-api.cognitiveservices.azure.com/vision/v3.2/read/analyze",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json","Ocp-Apim-Subscription-Key":"78e4e95e416348b6b841a36cd2f7ac50"},body:JSON.stringify({url:e})})).headers.get("Operation-Location");setTimeout((()=>{}),4e3);let a=!0;const n=e=>new Promise((o=>setTimeout(o,e)));for(;a;)await n(1500),fetch(t,{headers:{"Ocp-Apim-Subscription-Key":"78e4e95e416348b6b841a36cd2f7ac50"}}).then((e=>e.json())).then((t=>{if(console.log(t.status),"succeeded"===t.status){for(const e of t.analyzeResult.readResults[0].lines)o+=e.words.map((e=>e.text)).join(" ")+" .";a=!1}else"failed"===t.status&&(a=!1,console.log(`failed ocr on this url: ${e}`));console.log("retrying again")}));return o}(a);return console.log("received OCR: "+o),void t.postMessage({url:a,caption:o})}t.postMessage({url:a,caption:s})}else t.postMessage({url:a,caption:s})}))})),chrome.runtime.onInstalled.addListener((e=>{console.log(`runtime id: ${chrome.runtime.id}`),"install"==e.reason&&chrome.tabs.create({url:chrome.runtime.getURL("usage.html")}),chrome.storage.local.set({enabled:!0,language:"en"});for(const e of["IMAGE_ALTS","ERROR_SRCS","ORIGINAL_ALTS"]){const o={};o[e]={},chrome.storage.local.set(o)}})),chrome.runtime.onMessage.addListener(((e,o,t)=>{if("params"===e.purpose)chrome.storage.local.get(["enabled","language","IMAGE_ALTS","ERROR_SRCS","ORIGINAL_ALTS"],(e=>{console.log("this lang from background script: "+e.language),t(e)}));else if("update"===e.purpose){const{needUpdate:o}=e;try{chrome.storage.local.set({needUpdate:e[o]})}catch(e){console.log("error with background storage : "+e)}}else"runtimeId"===e.purpose&&t({runtimeId:chrome.runtime.id});return!0}));