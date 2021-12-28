<script> 
    // switch for whether or not to be on 

    import {MDCSwitch} from '@material/switch';
    import {onMount} from "svelte";
    import {createEventDispatcher} from "svelte"; 

    export let id; 
    export let on; // initial state 

    const dispatcher = createEventDispatcher(); 
    let INIT_CLASS; 
    
    onMount(() => {
        for (const el of document.querySelectorAll('.mdc-switch')) {
            const switchControl = new MDCSwitch(el);
        }
    });

    function initClass() {
        if (on) {
            INIT_CLASS = "mdc-switch mdc-switch--selected"; 
        } else {
            INIT_CLASS = "mdc-switch mdc-switch--unselected";
        }   
    }

    initClass(); 

    const onClickFunction = () => {
        // okay buddy, if you click this 
        dispatcher("message", {
            change:"used"
        });
    }
    

</script>

<button id={id} class={INIT_CLASS} type="button" role="switch" aria-checked={on ? "true" : "false"} on:click={onClickFunction}>
    <div class="mdc-switch__track"></div>
    <div class="mdc-switch__handle-track">
      <div class="mdc-switch__handle">
        <div class="mdc-switch__ripple"></div>
        <div class="mdc-switch__icons">
          <svg class="mdc-switch__icon mdc-switch__icon--on" viewBox="0 0 24 24">
            <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
          </svg>
          <svg class="mdc-switch__icon mdc-switch__icon--off" viewBox="0 0 24 24">
            <path d="M20 13H4v-2h16v2z" />
          </svg>
        </div>
      </div>
    </div>
  </button>
  
<style global lang="scss"> 
    @use '@material/switch/styles';
</style>