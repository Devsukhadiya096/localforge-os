export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-between border-r-4 border-rust bg-steel p-12 text-white lg:flex">
        <div className="text-xl font-semibold tracking-tight">LocalForge</div>
        <div>
          <h2 className="text-3xl font-semibold leading-tight">
            Find the businesses that need a website.
            <br />
            Turn them into clients.
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/70">
            LocalForge OS tracks every lead, conversation and deal in one place.
          </p>
        </div>
        <div className="text-xs text-white/50">Internal tool</div>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-xl font-semibold tracking-tight text-steel lg:hidden">
            LocalForge
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
