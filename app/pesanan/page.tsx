import { getSupabaseServerClient } from "@/lib/supabase/server"
import { OrdersList } from "@/components/orders-list"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PesananPage() {
  const supabase = await getSupabaseServerClient()

  // Fetch all orders with their items
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .order("created_at", { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Pemesanan
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Daftar Pesanan</h1>
          <p className="text-muted-foreground mt-2">MBAH SOETA FAMILY - Rekap semua pesanan kaos keluarga</p>
        </div>

        {/* Orders List */}
        <OrdersList orders={orders || []} error={error?.message} />
      </div>
    </main>
  )
}
