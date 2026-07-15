import { create } from "zustand"

const COUPONS: Record<string, { type: "percent" | "fixed"; value: number; description: string }> = {
  "SAVE10": { type: "percent", value: 10, description: "10% off your order" },
  "SAVE20": { type: "percent", value: 20, description: "20% off your order" },
  "FREESHIP": { type: "fixed", value: 10, description: "$10 off (free shipping)" },
  "MUSIC50": { type: "percent", value: 50, description: "50% off — mega sale!" },
}

interface CouponState {
  code: string | null
  discount: number
  description: string | null
  error: string | null
  apply: (code: string, subtotal: number) => void
  remove: () => void
}

export const useCoupon = create<CouponState>((set) => ({
  code: null,
  discount: 0,
  description: null,
  error: null,
  apply: (code, subtotal) => {
    const upper = code.toUpperCase().trim()
    const coupon = COUPONS[upper]
    if (!coupon) {
      set({ code: null, discount: 0, description: null, error: "Invalid coupon code" })
      return
    }
    const discount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value
    set({ code: upper, discount, description: coupon.description, error: null })
  },
  remove: () => set({ code: null, discount: 0, description: null, error: null }),
}))
