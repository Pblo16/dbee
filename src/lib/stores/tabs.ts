import { writable, get } from 'svelte/store'
import { loadTableData } from '$lib/services/data'

export interface ColumnItem {
  title: string
  type?: string
  primaryKey?: boolean
}

export interface TabItem {
  id: string // unique id, using title for now
  title: string
  columns: ColumnItem[]
  rows?: any[]
  loading?: boolean
  error?: string | null
}

export const openTabs = writable<TabItem[]>([])
export const activeTabId = writable<string | null>(null)

export async function openTable(tab: {
  title: string
  columns?: ColumnItem[]
}) {
  const id = tab.title // simple id; could be namespaced later
  const tabs = get(openTabs)
  const existing = tabs.find((t) => t.id === id)
  if (!existing) {
    const newTab: TabItem = {
      id,
      title: tab.title,
      columns: tab.columns ?? [],
      rows: [],
      loading: true,
      error: null,
    }
    openTabs.update((arr) => [...arr, newTab])
  }
  activeTabId.set(id)

  // Load rows asynchronously
  try {
    openTabs.update((arr) =>
      arr.map((t) => (t.id === id ? { ...t, loading: true, error: null } : t))
    )
    const rows = await loadTableData(tab.title)
    openTabs.update((arr) =>
      arr.map((t) => (t.id === id ? { ...t, rows, loading: false } : t))
    )
  } catch (e: any) {
    openTabs.update((arr) =>
      arr.map((t) =>
        t.id === id ? { ...t, loading: false, error: e?.message ?? 'Error' } : t
      )
    )
  }
}

export function setActiveTab(id: string) {
  activeTabId.set(id)
}

export function closeTab(id: string) {
  openTabs.update((arr) => arr.filter((t) => t.id !== id))
  const tabs = get(openTabs)
  const current = get(activeTabId)
  if (current === id) {
    activeTabId.set(tabs.length ? tabs[tabs.length - 1].id : null)
  }
}
