<div class="mt-3">
    <div hidden="{error == ''}" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Validation Template Error:</strong>
        <span class="block sm:inline">{error}</span>
    </div>
</div>
<script>
    export let error = "";
    export function set(errorMessage){
        error = errorMessage
    };
</script>