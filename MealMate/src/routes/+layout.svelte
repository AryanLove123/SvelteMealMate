<script>
  import '../app.css';
  import { onMount } from 'svelte';

  onMount(async () => {
    const { defineCustomElements } = await import('recipemealui/loader');
    defineCustomElements();
  });

  let { children } = $props();
</script>

{@render children()}