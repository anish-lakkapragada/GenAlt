<script>	
	import "smelte/src/tailwind.css";
	import Switch from "smelte/src/components/Switch";
	import Select from "smelte/src/components/Select";

	const languages = ['English', 'Spanish','Japanese','Portuguese','Chinese'];
	const abbreviationLang = {'en' : 'English', 'es' : 'Spanish', 'ja' : 'Japanese', 'pt' : 'Portuguese', 'zh' : 'Chinese'};
	const langAbbrevations = {'English' : 'en', 'Spanish' : 'es', 'Japanese' : 'ja', 'Portuguese' : 'pt', 'Chinese' : 'zh'};
	
	const discordLink = 'https://discord.com/invite/Xcft8CrXRq'; 
	const githubLink = 'https://github.com/anish-lakkapragada/GenAlt';
	const guideLink = chrome.runtime.getURL("usage.html");

	let loaded = false;
	let firstTime = true; 
	let language; 
	let enabled; 
	let languageUsed; 
	
	chrome.storage.local.get(['enabled', 'language'], (response) => {
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
			chrome.storage.local.set({'enabled' : enabled});
		} else if (type === 'language') {
			if (languageUsed != null) {
				console.log(`new language used : ${languageUsed}`);
				language = langAbbrevations[languageUsed];
				console.log(`this is the new language ${language}`);
				chrome.storage.local.set({'language' : language});
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
		<html lang="en" class="w-96 h-96 mode-dark bg-gray-900">  
			<body class="mode-dark bg-gray-900"> 
				<div class="container font-inter">

					<h1 id="title" class="font-bold text-center text-3xl"> GenAlt Settings </h1>		
					<p class="text-sm text-left mx-4"> In this browser popup, you can re-enable or disable GenAlt as you please, and you can also change the language of GenAlt's image descriptions. For further help, please check the usage guide by clicking <a class="text-sm underline" target="_blank" href={guideLink}> here</a>. <br> <br> </p>	

					<em> 
						<div class="text-sm text-left mx-4" > 
							<span> Don't forget to drop a 5-star review, join our </span> 
							<a href={discordLink}  target="_blank" class="underline"> Discord Server (click here)</a>,
							and star the <a href={githubLink}  target="_blank" class="underline"> GitHub repository (click here)</a>. 
						</div>
					</em>
					
					<p class="text-base inline-block float-left mx-4 my-2"> Enable or Disable GenAlt </p>
					
					<div class="enabled-switch inline-block my-2 float-right" aria-label={`Switch on whether to enable or disable GenAlt. GenAlt is currently ${enabled ? "enabled" : "disabled"}. Click to ${enabled ? "disable" : "enable"} GenAlt.`} role="button" tabindex="0">
						<Switch class="inline-block" bind:value={enabled}> </Switch>
					</div>
					
					<br> 
					<br> 
					<br> 

					<div class="lang-select text-base text-left mx-4" on:change|capture={update("language")} aria-label={`You are currently on multiple choices on what language you want GenAlt to generate captions in. GenAlt can deliver captions in English, Spanish, Japanese, Portuguese, and Chinese. GenAlt is currently using ${languageUsed}`} tabindex="0" role="navigation">  
						<Select label={"Translation Language"} items={languages} autocomplete outlined bind:value={languageUsed}> </Select>	
					</div>
				</div>
			</body>
		</html> 
	{/if}
</main>