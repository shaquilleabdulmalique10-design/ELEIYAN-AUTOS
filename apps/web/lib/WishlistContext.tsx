'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { WishlistItem } from '@eleniyan/types'
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
} from './wishlist'

interface WishlistContextValue {
  items: WishlistItem[]
  count: number
  add: (item: WishlistItem) => void
  remove: (id: string) => void
  toggle: (item: WishlistItem) => void
  inList: (id: string) => boolean
  clear: () => void
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setItems(getWishlist())
  }, [])

  const refresh = useCallback(() => setItems(getWishlist()), [])

  const add = useCallback((item: WishlistItem) => {
    addToWishlist(item)
    refresh()
  }, [refresh])

  const remove = useCallback((id: string) => {
    removeFromWishlist(id)
    refresh()
  }, [refresh])

  const toggle = useCallback((item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(item)
    }
    refresh()
  }, [refresh])

  const inList = useCallback((id: string) => items.some((i) => i.id === id), [items])

  const clear = useCallback(() => {
    clearWishlist()
    refresh()
  }, [refresh])

  return (
    <WishlistContext.Provider value={{
      items,
      count: items.length,
      add, remove, toggle, inList, clear,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
