<div id="app" class="h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-900">
  <div class="flex lg:flex-col items-left w-full lg:w-1/3 bg-gray-800 lg:h-full p-8">
    <img class="w-32 h-32 rounded-full mb-4 mr-4" src="pomeranian.png" alt="">
    <div class="text-white">
      <p class="text-4xl font-bold">Email inliner! <span class="text-2xl font-light">v0.2</span></p>
      <p class="text-xl font-bold">By newshore_</p>
      <p class="text-xl mb-2">Select <span class="font-bold">options:</span></p>
      <br>
      <button on:click="{ () => activeTab="code" }" class="w-full font-bold flex-shrink-0 mt-2 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
        HTML (lodash support)
      </button>
      <button on:click="{ () => activeTab="data" }" class="w-full font-bold flex-shrink-0 mt-2 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
        JSON DATA
      </button>
      <button on:click="{ () => activeTab="css" }" class="w-full font-bold flex-shrink-0 mt-2 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
        CSS
      </button>
      <button hidden on:click="{ () => activeTab="preview" }" class="w-full font-bold flex-shrink-0 mt-4 bg-pink-500 hover:bg-pink-700 border-pink-500 hover:border-pink-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
        PREVIEW
      </button>
      <button on:click="{ () => { activeTab="generate"; generate(); } }" class="w-full font-bold flex-shrink-0 mt-2 bg-pink-500 hover:bg-pink-700 border-pink-500 hover:border-pink-700 text-sm border-4 text-white py-1 px-2 rounded" type="button">
        GENERATE
      </button>
      <Errors bind:this={error}/>
    </div>
  </div>
  <div class="h-full bg-gray-100 w-full flex flex-col items-center">
    <div class="h-full w-full bg-teal-200 flex justify-center">
      <div class="flex items-center w-full" class:hidden="{activeTab !== 'code'}">
        <Ace {...editor.code} bind:this={code} />
      </div>
      <div class="flex items-center w-full" class:hidden="{activeTab !== 'data'}">
       <Ace {...editor.data} bind:this={data} />
      </div>
      <div class="flex items-center w-full" class:hidden="{activeTab !== 'css'}">
       <Ace {...editor.css} bind:this={css} />
      </div>
      <div class="flex items-center w-full" class:hidden="{activeTab !== 'generate'}">
       <Ace {...editor.generate} bind:this={gen} />
      </div>
      <div class="flex items-center w-full" class:hidden="{activeTab !== 'preview'}">
        Previewa
      </div>
    </div>
  </div>
</div>

<script>
  /** Import Lifecicle svelte methods */
  import { onMount, getContext } from 'svelte';

  /** Import Components */
  import Ace from './Ace.svelte';
  import Errors from './Errors.svelte';
  import template from 'lodash.template';
  import flow from 'lodash.flow';
  
  /** Local Properties and Props */
  export let code;
  export let data;
  export let css;
  export let gen;
  export let error;
  export let activeTab = "code";
  export let editor = {
    code : {
      mode : "html",
      id   : "code"
    },
    data : {
      mode : "javascript",
      id   : "data"
    },
    css : {
      mode : "css",
      id   : "css"
    },
    generate : {
      mode : "generate",
      id   : "generate"
    }
  }
  
  /**
   * Compile and Validate template from ace editor html and json data
   * @returns {string|boolean} html successfull parsed or boolean 
   */
  const compileAndValidTemplate = () =>{
    const html = code.getEditorValue();
    const dataload = data.getEditorValue();
    try {
        let parsed   = JSON.parse(dataload),
            compiled = template(html),
            result   = compiled(parsed);
        error.set("");
        return result;
    } catch(e) {
        error.set(e);
        alert(e);
        return false;
    }
  };

  /**
   * Convert and append parsed HTML styles
   * @CurrentRule 
   * @param {string} html - Parsed HTML from compilation process
   * @returns {string} Parsed HTML(without modifications) or append style
   */
  const ConstructInlineCss = (html) => {
    const styles = css.getEditorValue();
    if(styles.trim() != ""){
      let templatecss = `<style type="text/css">${styles}</style>`;
      html += templatecss;
    }
    return html;
  };

  /**
   * Send Full HTML compiled in the Rest API
   */
  const generateAndMinify = async() => {
      let generation = compileAndValidTemplate();
      if( generation ){
          var doRules = flow([
              ConstructInlineCss, 
          ]);
          const html = doRules(generation);
          const rawResponse = await fetch('/generate', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                html
              })
          });
          const content = await rawResponse.text();
          gen.setEditorValue(content);
      }
  }

  /**
   * Event Listener Handler
   */
  export function generate(){
    generateAndMinify();
  };

  /**
   * OnMount
   */
  onMount(() => {
  });
</script>

<style>
 
</style>
