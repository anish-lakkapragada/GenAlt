<script>	
	import "smelte/src/tailwind.css";
	import Switch from "smelte/src/components/Switch";
	import Select from "smelte/src/components/Select";

	// get all values from chrome extension. 

	const languages = ['English', 'Spanish','Japanese','Portuguese','Chinese'];
	const abbreviationLang = {'en' : 'English', 'es' : 'Spanish', 'ja' : 'Japanese', 'pt' : 'Portuguese', 'zh' : 'Chinese'};
	const langAbbrevations = {'English' : 'en', 'Spanish' : 'es', 'Japanese' : 'ja', 'Portuguese' : 'pt', 'Chinese' : 'zh'};
	
	let loaded = true;
	let firstTime = true; 
	let language; 
	let enabled; 
	let languageUsed; 

	chrome.storage.sync.get(['enabled', 'language'], (response) => {
		language = response.language; 
		//enabled = response.enabled;
		enabled = true; 
		languageUsed = abbreviationLang[language];
		console.log(languageUsed);
		console.log(response); 
		console.log("we're here");
		loaded = true; 	
	}); 

	$: update("language") || languageUsed; // when languageUsed updates!
	
	const update = (type) => {
		if (type === 'enabled' && !firstTime) {
			console.log("changed value here!");
			enabled = !enabled;
			chrome.storage.sync.set({'enabled' : enabled});
		} else if (type === 'language') {
			if (languageUsed != null) {
				console.log(`new language used : ${languageUsed}`);
				language = langAbbrevations[languageUsed];
				console.log(`this is the new language ${language}`);
				chrome.storage.sync.set({'language' : language});
			}
		}

		if (firstTime) {
			firstTime = false;
		}
	}
</script>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<div class="container">
	<h1> GenAlt Settings </h1>	
	<p> Don't forget to drop a 5-star review, share with your friends, join our Discord server, star the GitHub repository, and chip in a few dollars to help fund future projects (stay tuned)! </p>
	
	<div class="enabled-switch" aria-label={`Switch on whether to enable or disable GenAlt. GenAlt is currently ${enabled ? "enabled" : "disabled"}. Click to ${enabled ? "disable" : "enable"} GenAlt.`} role="button" tabindex="0">
		<Switch bind:value={enabled} onChange={update('enabled')} aria-label="this fun tho"/>
	</div>

	<div id="onoff"> On / Off </div>
	<div class="lang-select" on:change|capture={update("language")} aria-label={`Multiple choices on what language you want GenAlt to generate captions in. GenAlt can deliver captions in English, Spanish, Japanese, Portuguese, and Chinese. GenAlt is currently using ${languageUsed}`} tabindex="0" role="navigation">  
		<Select label={"Translation Language"} items={languages} autocomplete bind:value={languageUsed}> </Select>	
	</div>
</div>

<style>
	.container {
		text-align: center; 
	}
</style>