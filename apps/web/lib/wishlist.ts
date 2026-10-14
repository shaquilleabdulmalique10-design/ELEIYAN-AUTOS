'use client'

import type { WishlistItem } from '@eleniyan/types'

const KEY = 'eleniyan_wishlist'

export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addToWishlist(item: WishlistItem): void {
  const list = getWishlist()
  if (!list.find((i) => i.id === item.id)) {
    list.push({ ...item, addedAt: new Date().toISOString() })
    localStorage.setItem(KEY, JSON.stringify(list))
  }
}

export function removeFromWishlist(id: string): void {
  const list = getWishlist().filter((i) => i.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function isInWishlist(id: string): boolean {
  return getWishlist().some((i) => i.id === id)
}

export function clearWishlist(): void {
  localStorage.setItem(KEY, JSON.stringify([]))
}
