import type { InputHTMLAttributes, ReactNode } from 'react'

export function Field({
  label,
  id,
  ...props
}: { label: string; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-steel">
        {label}
      </label>
      <input
        id={id}
        name={id}
        {...props}
        className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-steel focus:ring-2 focus:ring-steel/20 disabled:opacity-60"
      />
    </div>
  )
}

export function SubmitButton({
  loading,
  children,
  loadingText,
}: {
  loading: boolean
  children: ReactNode
  loadingText: string
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded bg-rust px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rust-dark disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? loadingText : children}
    </button>
  )
}

export function Alert({
  kind,
  children,
}: {
  kind: 'error' | 'success'
  children: ReactNode
}) {
  const styles =
    kind === 'error'
      ? 'border-red-300 bg-red-50 text-red-800'
      : 'border-green-300 bg-green-50 text-green-800'
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded border px-3 py-2.5 text-sm ${styles}`}>
      {children}
    </div>
  )
}
