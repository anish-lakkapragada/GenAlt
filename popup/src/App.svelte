<script>	
	import "smelte/src/tailwind.css";
	import Switch from "smelte/src/components/Switch";
	import Select from "smelte/src/components/Select";

	const languages = ['English', 'Spanish','Japanese','Portuguese','Chinese'];
	const abbreviationLang = {'en' : 'English', 'es' : 'Spanish', 'ja' : 'Japanese', 'pt' : 'Portuguese', 'zh' : 'Chinese'};
	const langAbbrevations = {'English' : 'en', 'Spanish' : 'es', 'Japanese' : 'ja', 'Portuguese' : 'pt', 'Chinese' : 'zh'};
	
	let loaded = false;
	let firstTime = true; 
	let language; 
	let enabled; 
	let languageUsed; 
	
	chrome.storage.sync.get(['enabled', 'language'], (response) => {
		language = response.language; 
		enabled = response.enabled; 
		languageUsed = abbreviationLang[language];
		console.log(languageUsed);
		console.log(response); 
		console.log("we're here");
		loaded = true; 	
	}); 

	$: update("language") || languageUsed; // when languageUsed updates!
	$: update("enabled") || enabled; // when enabled updates, just store it!

	const update = (type) => {
		console.log("called update with")
		if (type === 'enabled' && !firstTime) {
			console.log("changed value here!");
			//enabled = !enabled;
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

<main> 
	{#if loaded}
		<body class="w-96 h-64 rounded-2xl"> 
			<div class="container mode-dark text-center font-inter px-2">

				<h1 id="title" class="font-bold text-3xl"> GenAlt Settings </h1>		
				<p id="plug" class="text-sm mx-8"> In this browser popup, you can re-enable or disable GenAlt as you please, and you can also change the language of GenAlt's image descriptions. <br> <em> Don't forget to drop a 5-star review, share with your friends, join our Discord server, star the GitHub repository, and chip in a few dollars to help support GenAlt's services. </em> </p>
						
				<div class="enabled-switch" aria-label={`Switch on whether to enable or disable GenAlt. GenAlt is currently ${enabled ? "enabled" : "disabled"}. Click to ${enabled ? "disable" : "enable"} GenAlt.`} role="button" tabindex="0">
					<Switch bind:value={enabled}> </Switch>
				</div>

				<div id="onoff" class="text-base my-2"> Enable or Disable GenAlt </div>

				<div class="lang-select dark text-base" on:change|capture={update("language")} aria-label={`You are currently on multiple choices on what language you want GenAlt to generate captions in. GenAlt can deliver captions in English, Spanish, Japanese, Portuguese, and Chinese. GenAlt is currently using ${languageUsed}`} tabindex="0" role="navigation">  
					<Select label={"Translation Language"} items={languages} autocomplete outlined bind:value={languageUsed}> </Select>	
				</div>
			</div>
		</body>
	{/if}
</main>

<style>
	
	/*
	#title{
		font-size: 3rem; 
		font-weight: bold;
	}

	#plug {
		margin-top: 0.5rem;
		margin-left: 2rem;
		margin-right: 2rem;
		font-size: 1.5rem;
	}

	.enabled-switch {
		margin-top: 0.5rem;
	}
	
	.container {
		text-align: center !important; 
		margin: 5rem;
		padding: 1rem;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}*/
</style>