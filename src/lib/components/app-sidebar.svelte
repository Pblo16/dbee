<script lang="ts">
  import HouseIcon from '@lucide/svelte/icons/house'
  import CodeIcon from '@lucide/svelte/icons/chevrons-left-right'
  import * as Sidebar from '$lib/components/ui/sidebar/index.js'

  interface ColumnItem {
    title: string
    type?: string
  }

  let { activeSection = 'home', onSectionChange = (section: string) => {} } =
    $props()

  // Menu items.
  const items = [
    {
      title: 'Databases',
      id: 'databases',
      icon: HouseIcon,
    },

    {
      title: 'Code',
      id: 'code',
      icon: CodeIcon,
    },
  ]

  function handleItemClick(itemId: string) {
    onSectionChange(itemId)
  }
</script>

<Sidebar.Root collapsible="none" class="h-dvh bg-background">
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.id)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive={activeSection === item.id}>
                {#snippet child({ props })}
                  <button
                    type="button"
                    {...props}
                    onclick={() => handleItemClick(item.id)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </button>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
