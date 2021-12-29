<script>	
	import "smelte/src/tailwind.css";
	import {Switch, Select} from "smelte";

	// get all values from chrome extension. 

	const languages = ['English', 'Spanish','Japanese','Portuguese','Chinese'];
	const abbreviationLang = {'en' : 'English', 'es' : 'Spanish', 'ja' : 'Japanese', 'pt' : 'Portuguese', 'zh' : 'Chinese'};
	const langAbbrevations = {'English' : 'en', 'Spanish' : 'es', 'Japanese' : 'ja', 'Portuguese' : 'pt', 'Chinese' : 'zh'};
	
	let loaded = false;
	let language, enabled; 
	let languageUsed; 

	chrome.storage.sync.get(['enabled', 'language'], (response) => {
		language = response.language; enabled = response.enabled;
		languageUsed = abbreviationLang[language];
		loaded = true; 	
	}); 

	
	$ : chrome.storage.sync.set({"enabled" : enabled});
	$ : language = langAbbrevations[languageUsed]; 
	$ : chrome.storage.sync.set({"language" : language});


</script>

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	
	{#if loaded}
		<div class="container">
			<h1> GenAlt Settings </h1>	
			<h3> Don't forget to drop a 5-star review, share with your friends, join our Discord server, star the GitHub repository, and chip in a few dollars to help fund future projects (stay tuned)! </h3>
			<div class="switch-container" on:click|capture={update("state")}>
				<Switch color="primary" bind:value={enabled}> </Switch>
			</div>

			<Select label={"Translation Language"} autocomplete items={languages} bind:value={languageUsed}></Select>
		</div>
	{/if}

<style>
	.container {
		text-align: center; 
		position: relative;
	}
</style>