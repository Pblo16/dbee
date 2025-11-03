<script lang="ts">
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import Grid from "@lucide/svelte/icons/grid";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import Button from "./ui/button/button.svelte";
  import { openTable } from "$lib/stores/tabs";

  let {
    isCollapsed = false,
    activeSection = "databases",
    onToggleCollapse,
    data = [],
  }: {
    isCollapsed?: boolean;
    activeSection?: string;
    onToggleCollapse: () => void;
    data?: SectionItem[];
  } = $props();

  // Estado para controlar qué items están abiertos (usando el índice del item)
  let openItems = $state<Set<number>>(new Set());

  interface ColumnItem {
    title: string;
    type?: string;
    primaryKey?: boolean;
  }
  interface SectionItem {
    title: string;
    icon?: any;
    columns?: ColumnItem[];
  }

  // Título según la sección activa
  const currentTitle = $derived(
    activeSection === "databases" ? "Databases" : "Code"
  );

  function toggleItem(index: number) {
    if (openItems.has(index)) {
      openItems.delete(index);
    } else {
      openItems.add(index);
    }
    openItems = openItems; // Trigger reactivity
  }

  // Resetear/establecer items abiertos cuando cambia la sección activa
  // Al cambiar de sección, no abrir ningún ítem por defecto.
  // La sección "databases" se muestra por defecto (controlado por activeSection),
  // pero sus ítems permanecen colapsados.
  $effect(() => {
    activeSection;
    openItems = new Set();
  });
</script>

<div class="h-dvh border-2 border-border relative overflow-x-hidden">
  <Button
    class="absolute -right-2 z-10"
    size="icon-lg"
    variant="outline"
    onclick={onToggleCollapse}
  >
    {#if isCollapsed}
      <ChevronRight />
    {:else}
      <ChevronLeft />
    {/if}
  </Button>
  {#if !isCollapsed}
    <div class="p-2 h-full overflow-auto">
      <h2 class="text-xs font-bold mb-4">{currentTitle.toUpperCase()}</h2>
      <ul class="overflow-x-hidden space-y-1">
        {#each data as item, index (item.title)}
          <Collapsible.Root open={openItems.has(index)}>
            <li
              class="text-xs text-stone-300 rounded-sm w-full hover:bg-muted"
              on:dblclick|preventDefault|stopPropagation={() =>
                openTable({ title: item.title, columns: item.columns ?? [] })}
            >
              <div class="flex items-center cursor-pointer">
                <Collapsible.Trigger
                  class="cursor-pointer transition-colors flex items-center py-2 px-1 rounded-md group"
                  onclick={() => toggleItem(index)}
                >
                  <div
                    class="transform transition-transform duration-200 group-data-[state=open]:rotate-90"
                  >
                    <ChevronRight
                      class="size-4 text-muted-foreground group-hover:text-stone-100"
                    />
                  </div>
                </Collapsible.Trigger>
                {#if item.icon}
                  <item.icon class="mr-2 ml-1 text-cyan-400 size-4" />
                {:else}
                  <Grid class="mr-2 ml-1 text-cyan-400 size-4" />
                {/if}
                <span class="font-bold group-hover:text-stone-100"
                  >{item.title}</span
                >
              </div>

              <Collapsible.Content
                class="text-xs text-muted-foreground pl-8 overflow-hidden transition-all duration-200 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
              >
                {#if item.columns}
                  <ul class="space-y-1 py-2">
                    {#each item.columns as column}
                      <li
                        class="py-1 px-2 flex items-center justify-between hover:bg-muted/50 rounded-sm cursor-pointer transition-colors"
                      >
                        <p class="truncate">{column.title}</p>
                        <span
                          class="text-muted-foreground text-xs ml-2 shrink-0"
                          >{column.type}</span
                        >
                      </li>
                    {/each}
                  </ul>
                {:else}
                  <p class="py-2 px-2 text-muted-foreground/70">
                    No columns available.
                  </p>
                {/if}
              </Collapsible.Content>
            </li>
          </Collapsible.Root>
        {/each}
      </ul>
    </div>
  {/if}
</div>
