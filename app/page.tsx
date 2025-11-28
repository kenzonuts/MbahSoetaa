import { OrderForm } from "@/components/order-form"
import { TshirtShowcase } from "@/components/tshirt-showcase"
import Link from "next/link"
import { ClipboardList } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23c9a227' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="flex justify-end mb-4">
              <Link
                href="/pesanan"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ClipboardList className="w-4 h-4" />
                Lihat Daftar Pesanan
              </Link>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
              MBAH SOETA
            </h1>
            <p className="text-xl sm:text-2xl text-primary font-semibold mt-2">FAMILY</p>
            <p className="text-muted-foreground mt-4 text-lg italic">Kumpul Sebentar, Bahagianya Lama.</p>
          </header>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: T-shirt Showcase */}
            <div className="lg:sticky lg:top-8">
              <TshirtShowcase />
              <div className="mt-8 text-center">
                <p className="text-muted-foreground text-sm">Kaos keluarga dengan desain eksklusif</p>
                <p className="text-muted-foreground text-sm">Bahan cotton combed 30s premium</p>
              </div>
            </div>

            {/* Right: Order Form */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Form Pemesanan</h2>
                <p className="text-muted-foreground mt-1">Isi form di bawah untuk memesan kaos keluarga</p>
              </div>
              <OrderForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">MBAH SOETA FAMILY &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  )
}
