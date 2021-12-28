<script>
	import Switch from "./Switch.svelte";

	function handleMessage(event) {
		// update chrome storage with the event here 
	}
</script>

	<div class="container">
		<h1 class="title"> GenAlt Settings </h1>
		<h3> plug </h3>	
		<Switch id="on-switch" on={true} on:message={handleMessage}></Switch>
		<h2> On / Off </h2>

		<!-- include now a list of all languages -->
	</div>

<style global lang="scss">
	@use '@material/switch/styles';

	.container {
		text-align: center;
	}
	.title {
		font-size: 2rem;
	}

</style>