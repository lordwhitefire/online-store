"use client"
import { create } from "zustand"
import { useEffect } from "react"
import { Check, X, AlertCircle, Info } from "lucide-react"

interface Toast {
  id: number
  message: string
  type: "success" | "error" | "info"
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, type?: Toast["type"]) => void
  removeToast: (id: number) => void
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "success") => {
    const id = Date.now()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3000)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))

export function ToastContainer() {
  const { toasts, removeToast } = useToast()
  const icons = { success: Check, error: AlertCircle, info: Info }
  const colors = { success: "bg-green-500", error: "bg-red-500", info: "bg-blue-500" }
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => {
        const Icon = icons[t.type]
        return (
          <div key={t.id} className={`flex items-center gap-2 ${colors[t.type]} px-4 py-3 text-sm text-white shadow-lg`} style={{ animation: "slideIn 0.3s ease" }}>
            <Icon className="h-4 w-4 shrink-0" />
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-2"><X className="h-3 w-3" /></button>
          </div>
        )
      })}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  )
}
