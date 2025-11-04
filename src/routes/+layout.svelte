<script lang="ts">
  import "../app.css";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import * as Resizable from "$lib/components/ui/resizable/index.js";
  import SubSidebar from "$lib/components/sub-sidebar.svelte";
  import menus from "$lib/services/menus.json";

  let { children } = $props();

  let subSidebarPane = $state<any>(null);
  let isCollapsed = $state(false);
  let activeSection = $state<string>("databases");
  const MIN_WIDTH = 20; // Ancho mínimo en porcentaje antes de colapsar automáticamente
  const COLLAPSED_SIZE = 0;
  const DEFAULT_SIZE = 30; // Tamaño por defecto del panel (15%)

  function toggleCollapse() {
    if (!subSidebarPane) return;

    if (isCollapsed) {
      subSidebarPane.expand();
      isCollapsed = false;
    } else {
      subSidebarPane.collapse();
      isCollapsed = true;
    }
  }

  function handleResize(size: number) {
    // Si el tamaño es menor al mínimo y no está colapsado, colapsar automáticamente
    if (size < MIN_WIDTH && !isCollapsed) {
      subSidebarPane?.collapse();
      isCollapsed = true;
    } else if (size >= MIN_WIDTH && isCollapsed) {
      isCollapsed = false;
    }
  }

  function handleSectionChange(section: string) {
    activeSection = section;
    // Si está colapsado, expandir automáticamente al seleccionar una sección
    if (isCollapsed && subSidebarPane) {
      subSidebarPane.expand();
      isCollapsed = false;
    }
  }

  // Data derivada para el sub-sidebar según la sección activa
  const subData = $derived(
    activeSection === "databases" ? menus.databases : menus.code,
  );
</script>

<div class="bg-sidebar-accent">
  <Sidebar.Provider class="min-h-dvh flex">
    <Resizable.PaneGroup direction="horizontal">
      <AppSidebar {activeSection} onSectionChange={handleSectionChange} />
      <Resizable.Pane
        bind:this={subSidebarPane}
        collapsible={true}
        collapsedSize={COLLAPSED_SIZE}
        defaultSize={DEFAULT_SIZE}
        minSize={MIN_WIDTH}
        onResize={handleResize}
      >
        <SubSidebar
          {isCollapsed}
          {activeSection}
          onToggleCollapse={toggleCollapse}
          data={subData}
        />
      </Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane
        ><div class="w-full">
          <main class="flex p-2 min-h-dvh overflow-auto">
            {@render children?.()}
          </main>
        </div></Resizable.Pane
      >
    </Resizable.PaneGroup>
  </Sidebar.Provider>
</div>
