<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import Plus from "@lucide/svelte/icons/plus";
  import {
    openTabs,
    activeTabId,
    setActiveTab,
    closeTab,
  } from "$lib/stores/tabs";

  // Auto-subscribed stores for tabs and active tab
  $: tabs = $openTabs;
  $: active = $activeTabId ?? (tabs.length ? tabs[0].id : null);

  function handleChangeNext() {
    // optional: cycle to next tab (placeholder for the plus button for now)
    if (!tabs.length || !active) return;
    const idx = tabs.findIndex((t) => t.id === active);
    const next = tabs[(idx + 1) % tabs.length]?.id;
    if (next) setActiveTab(next);
  }
  function handleSetActive(id: string) {
    setActiveTab(id);
  }
  function handleClose(id: string) {
    closeTab(id);
  }
</script>

<Tabs.Root value={active ?? undefined} class="gap-0 m-0">
  <Tabs.List class="flex items-center gap-1  ">
    {#each tabs as tab}
      <div class="flex items-center">
        <Tabs.Trigger value={tab.id} on:click={() => handleSetActive(tab.id)}>
          {tab.title}
          <button
            class="ml-1 text-muted-foreground hover:text-foreground"
            title="Close"
            on:click|stopPropagation={() => handleClose(tab.id)}
          >
            ×
          </button>
        </Tabs.Trigger>
      </div>
    {/each}
  </Tabs.List>

  {#if !tabs.length}
    <div class="mt-4 text-sm text-muted-foreground">
      Doble click en una tabla del panel izquierdo para abrirla aquí.
    </div>
  {/if}

  {#each tabs as tab}
    <Tabs.Content value={tab.id} class="bg-background">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head class=""></Table.Head>
            {#each tab.columns as col}
              <Table.Head class="">{col.title}</Table.Head>
            {/each}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#if tab.loading}
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell
                class="text-muted-foreground"
                colspan={tab.columns.length}
              >
                Cargando datos...
              </Table.Cell>
            </Table.Row>
          {:else if tab.error}
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell class="text-red-500" colspan={tab.columns.length}>
                {tab.error}
              </Table.Cell>
            </Table.Row>
          {:else if tab.rows && tab.rows.length}
            {#each tab.rows as row}
              <Table.Row>
                <Table.Cell></Table.Cell>
                {#each tab.columns as col}
                  <Table.Cell>{row[col.title]}</Table.Cell>
                {/each}
              </Table.Row>
            {/each}
          {:else}
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell
                class="text-muted-foreground"
                colspan={tab.columns.length}
              >
                No data to display.
              </Table.Cell>
            </Table.Row>
          {/if}
        </Table.Body>
      </Table.Root>
    </Tabs.Content>
  {/each}
</Tabs.Root>
