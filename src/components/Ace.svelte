<div id="{id}" class="h-full resize-none shadow appearance-none border-none w-full"></div>
<pre id="template-html" bind:this={html} class:hidden="{true}">
{`<body>
  <p>\$\{name\}</p>
</body>

<style type="text/css">
  body{
    color:red;
  }
</style>
  `}
</pre>
<code id="template-javascript" bind:this={javascript} class:hidden="{true}">
  {@html '\n{\n\t\"name\":"Newshore"\n}\n'}
</code>
<code id="template-css" bind:this={css} class:hidden="{true}">
  {@html '/* OPTIONAL: css was here */'}
</code>
<code id="template-generate" bind:this={generate} class:hidden="{true}">
  {@html '<!-- Generation was here -->'}
</code>
<script>
  /** Import Lifecicle svelte methods */
  import { onMount } from 'svelte';
  
  /** Local Properties and Props */
  export let id;
  export let mode;
  export let html;
  export let javascript;
  export let editor;
  export let generate;
  export let css;

  /**
   * Set Initial values for placeholder in editor
   * @param {string} mode - the mode (`css`, `javascript`, `html`, `generate`).
   * @returns {string} Parsed HTML(without modifications) or append style
   */
  function processInitialValues(mode){
    switch(mode){
      case "html":
        editor.session.setValue(html.innerText);
      break;
      case "javascript":
        editor.session.setValue(javascript.innerHTML);
      break;
      case "css":
        editor.session.setValue(css.innerHTML);
      break;
      case "generate":
        editor.session.setValue(generate.innerHTML);
      break;
    }
  };

  /**
   * get current ace instance
   * @returns {mixed} get editor instance
   */
  export function getEditorInstance(){
    return editor;
  };

  /**
   * get editor value in session of ace
   * @returns {string} string in session editor
   */
  export function getEditorValue(){
    return editor.session.getValue();
  };

 /**
   * Send editor Content in current Component
   * @param {string} content - Content in editor
   */
  export function setEditorValue(content){
    return editor.session.setValue(content);
  };

  /**
   * OnMount
   */
  onMount(() => {
    editor = ace.edit(id);
        editor.setTheme("ace/theme/monokai");
        editor.setFontSize("18px");
        editor.session.setMode(`ace/mode/${mode==='generate'?'html':mode}`);
        processInitialValues(mode);
  })

</script>
