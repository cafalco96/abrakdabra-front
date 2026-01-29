export type DiscountCode = {
  id: number
  code: string
  type: 'percentage' | 'fixed'
  value: string
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  max_uses: number | null
  used_count: number
  created_at: string
}
