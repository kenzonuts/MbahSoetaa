"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Minus, Plus, CheckCircle2 } from "lucide-react"

const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"]

interface SizeQuantity {
  [key: string]: number
}

type Order = {
  id: string
  nama_lengkap: string
  no_whatsapp: string | null
  alamat: string | null
  catatan: string | null
  created_at: string
  order_items: {
    id: string
    order_id: string
    ukuran: string
    jumlah: number
    created_at: string
  }[]
}

interface EditOrderFormProps {
  order: Order
  onCancel: () => void
  onSuccess: () => void
}

export function OrderForm() {
  const [namaLengkap, setNamaLengkap] = useState("")
  const [noWhatsapp, setNoWhatsapp] = useState("")
  const [alamat, setAlamat] = useState("")
  const [catatan, setCatatan] = useState("")
  const [sizes, setSizes] = useState<SizeQuantity>(SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const updateQuantity = (size: string, delta: number) => {
    setSizes((prev) => ({
      ...prev,
      [size]: Math.max(0, prev[size] + delta),
    }))
  }

  const totalItems = Object.values(sizes).reduce((sum, qty) => sum + qty, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (totalItems === 0) return

    setIsSubmitting(true)
    const supabase = getSupabaseBrowserClient()

    try {
      console.log("Starting order submission...")
      console.log("Form data:", { namaLengkap, noWhatsapp, alamat, catatan, sizes, totalItems })

      // Check if user already has an order
      console.log("Checking existing orders for:", namaLengkap)
      const { data: existingOrders, error: checkError } = await supabase
        .from("orders")
        .select("id")
        .eq("nama_lengkap", namaLengkap)

      console.log("Check result:", { existingOrders, checkError })

      if (checkError) {
        console.error("Error checking existing orders:", checkError)
        throw checkError
      }

      if (existingOrders && existingOrders.length > 0) {
        alert("Maaf, nama lengkap ini sudah digunakan untuk pesanan lain. Setiap orang hanya boleh membuat satu pesanan saja.")
        return
      }

      // Insert order
      console.log("Inserting order...")
      const orderData = {
        nama_lengkap: namaLengkap,
        no_whatsapp: noWhatsapp || null,
        alamat: alamat || null,
        catatan: catatan || null,
      }
      console.log("Order data to insert:", orderData)

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single()

      console.log("Order insert result:", { order, orderError })

      if (orderError) throw orderError

      // Insert order items
      const items = Object.entries(sizes)
        .filter(([_, qty]) => qty > 0)
        .map(([ukuran, jumlah]) => ({
          order_id: order.id,
          ukuran,
          jumlah,
        }))

      console.log("Order items to insert:", items)

      const { error: itemsError } = await supabase.from("order_items").insert(items)

      console.log("Order items insert result:", { itemsError })

      if (itemsError) throw itemsError

      console.log("Order submission successful!")
      setIsSuccess(true)
    } catch (error: any) {
      console.error("Error submitting order:", error)
      console.error("Error type:", typeof error)
      console.error("Error message:", error?.message || "No message")
      console.error("Error details:", error?.details || "No details")
      console.error("Error hint:", error?.hint || "No hint")
      console.error("Error code:", error?.code || "No code")
      console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
      alert("Gagal mengirim pesanan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">Pesanan Berhasil!</h3>
        <p className="text-muted-foreground max-w-md">
          Terima kasih telah memesan kaos keluarga MBAH SOETA. Pesanan Anda telah berhasil dikirim.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Size Selection */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Pilih Ukuran & Jumlah</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SIZES.map((size) => (
            <div
              key={size}
              className="flex items-center justify-between bg-secondary border border-border rounded-lg p-3"
            >
              <span className="font-medium text-foreground">{size}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(size, -1)}
                  className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-mono text-foreground">{sizes[size]}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(size, 1)}
                  className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Informasi Pemesan</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-foreground">
              Nama Lengkap *
            </Label>
            <Input
              id="nama"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="noWhatsapp" className="text-foreground">
              No. WhatsApp (Opsional)
            </Label>
            <Input
              id="noWhatsapp"
              value={noWhatsapp}
              onChange={(e) => setNoWhatsapp(e.target.value)}
              placeholder="Masukkan nomor WhatsApp"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat" className="text-foreground">
              Alamat (Opsional)
            </Label>
            <Textarea
              id="alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Masukkan alamat lengkap"
              rows={2}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="catatan" className="text-foreground">
              Catatan (Opsional)
            </Label>
            <Textarea
              id="catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan tambahan"
              rows={2}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Total Pesanan</span>
          <span className="text-xl font-bold text-primary">{totalItems} kaos</span>
        </div>
        <Button
          type="submit"
          disabled={totalItems === 0 || isSubmitting}
          className="w-full bg-primary text-primary-foreground hover:opacity-90 h-12 text-lg font-semibold"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Pesanan"}
        </Button>
      </div>
    </form>
  )
}

export function EditOrderForm({ order, onCancel, onSuccess }: EditOrderFormProps) {
  const [namaLengkap, setNamaLengkap] = useState(order.nama_lengkap)
  const [noWhatsapp, setNoWhatsapp] = useState(order.no_whatsapp || "")
  const [alamat, setAlamat] = useState(order.alamat || "")
  const [catatan, setCatatan] = useState(order.catatan || "")
  const [sizes, setSizes] = useState<SizeQuantity>(() => {
    const initialSizes: SizeQuantity = SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
    order.order_items.forEach(item => {
      initialSizes[item.ukuran] = item.jumlah
    })
    return initialSizes
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateQuantity = (size: string, delta: number) => {
    setSizes((prev) => ({
      ...prev,
      [size]: Math.max(0, prev[size] + delta),
    }))
  }

  const totalItems = Object.values(sizes).reduce((sum, qty) => sum + qty, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (totalItems === 0) return

    setIsSubmitting(true)
    const supabase = getSupabaseBrowserClient()

    try {
      // Update order
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          nama_lengkap: namaLengkap,
          catatan: catatan || null,
        })
        .eq("id", order.id)

      if (orderError) throw orderError

      // Delete existing order items
      const { error: deleteError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", order.id)

      if (deleteError) throw deleteError

      // Insert new order items
      const items = Object.entries(sizes)
        .filter(([_, qty]) => qty > 0)
        .map(([ukuran, jumlah]) => ({
          order_id: order.id,
          ukuran,
          jumlah,
        }))

      const { error: itemsError } = await supabase.from("order_items").insert(items)

      if (itemsError) throw itemsError

      onSuccess()
    } catch (error: any) {
      console.error("Error updating order:", error)
      console.error("Error type:", typeof error)
      console.error("Error message:", error?.message || "No message")
      console.error("Error details:", error?.details || "No details")
      console.error("Error hint:", error?.hint || "No hint")
      console.error("Error code:", error?.code || "No code")
      console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
      alert("Gagal mengupdate pesanan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Size Selection */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Pilih Ukuran & Jumlah</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SIZES.map((size) => (
            <div
              key={size}
              className="flex items-center justify-between bg-secondary border border-border rounded-lg p-3"
            >
              <span className="font-medium text-foreground">{size}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(size, -1)}
                  className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-mono text-foreground">{sizes[size]}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(size, 1)}
                  className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Informasi Pemesan</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="nama" className="text-foreground">
              Nama Lengkap *
            </Label>
            <Input
              id="nama"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="noWhatsapp" className="text-foreground">
              No. WhatsApp (Opsional)
            </Label>
            <Input
              id="noWhatsapp"
              value={noWhatsapp}
              onChange={(e) => setNoWhatsapp(e.target.value)}
              placeholder="Masukkan nomor WhatsApp"
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat" className="text-foreground">
              Alamat (Opsional)
            </Label>
            <Textarea
              id="alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Masukkan alamat lengkap"
              rows={2}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="catatan" className="text-foreground">
              Catatan (Opsional)
            </Label>
            <Textarea
              id="catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan tambahan"
              rows={2}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Total Pesanan</span>
          <span className="text-xl font-bold text-primary">{totalItems} kaos</span>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={totalItems === 0 || isSubmitting}
            className="flex-1 bg-primary text-primary-foreground hover:opacity-90 h-12 text-lg font-semibold"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </form>
  )
}
