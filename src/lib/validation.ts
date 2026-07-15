export function validateEmail(email: string): string | null {
  if (!email) return "Email is required"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address"
  return null
}

export function validatePhone(phone: string): string | null {
  if (!phone) return "Phone is required"
  if (!/^[\d\s+()-]{7,}$/.test(phone)) return "Please enter a valid phone number"
  return null
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) return `${fieldName} is required`
  return null
}

export function validateForm(fields: Record<string, { value: string; validator: (v: string, name: string) => string | null; name: string }>): Record<string, string | null> {
  const errors: Record<string, string | null> = {}
  for (const [key, field] of Object.entries(fields)) {
    errors[key] = field.validator(field.value, field.name)
  }
  return errors
}

export function hasErrors(errors: Record<string, string | null>): boolean {
  return Object.values(errors).some(e => e !== null)
}
