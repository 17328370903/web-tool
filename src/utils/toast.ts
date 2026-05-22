import { reactive } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export const toasts = reactive<Toast[]>([])

let nextId = 0

export function showToast(message: string, type: Toast['type'] = 'success', duration = 3000) {
  const id = nextId++
  toasts.push({ id, message, type })
  
  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.splice(index, 1)
    }
  }, duration)
}
