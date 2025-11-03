<script lang="ts">
  import "../app.css";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";

  let { children } = $props();
</script>

<div class="bg-background">
  <Sidebar.Provider class="min-h-dvh flex">
    <AppSidebar />
    <div class="w-full">
      <header
        class="border-4 border-red-500 w-full h-fit flex items-center gap-4"
      >
        <Sidebar.Trigger />
        <h1 class="text-lg">Application</h1>
      </header>
      <main
        class="flex border-4 border-blue-500 p-4 h-[calc(100dvh-3rem)] overflow-auto"
      >
        {@render children?.()}
      </main>
    </div>
  </Sidebar.Provider>
</div>
