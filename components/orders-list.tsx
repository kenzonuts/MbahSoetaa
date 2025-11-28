"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, User, Phone, ShirtIcon, Package, Trash2, Edit, Minus, Plus } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { EditOrderForm } from "./order-form"

type OrderItem = {
  id: string
  order_id: string
  ukuran: string
  jumlah: number
  created_at: string
}

type Order = {
  id: string
  nama_lengkap: string
  catatan: string | null
  created_at: string
  order_items: OrderItem[]
}

type OrdersListProps = {
  orders: Order[]
  error?: string
}

const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"]

export function OrdersList({ orders, error }: OrdersListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (orderId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return

    setIsDeleting(orderId)
    const supabase = getSupabaseBrowserClient()

    try {
      // Delete order items first
      const { error: deleteItemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId)

      if (deleteItemsError) throw deleteItemsError

      // Then delete the order
      const { error: deleteOrderError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId)

      if (deleteOrderError) throw deleteOrderError

      // Refresh the page to update the list
      window.location.reload()
    } catch (error) {
      console.error("Error deleting order:", error)
      alert("Gagal menghapus pesanan. Silakan coba lagi.")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
  }

  // Filter orders based on search
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders
    const query = searchQuery.toLowerCase()
    return orders.filter(
      (order) =>
        order.nama_lengkap.toLowerCase().includes(query),
    )
  }, [orders, searchQuery])

  // Calculate summary
  const summary = useMemo(() => {
    const sizeCounts: Record<string, number> = {}
    let totalItems = 0

    orders.forEach((order) => {
      order.order_items.forEach((item) => {
        sizeCounts[item.ukuran] = (sizeCounts[item.ukuran] || 0) + item.jumlah
        totalItems += item.jumlah
      })
    })

    return { sizeCounts, totalItems, totalOrders: orders.length }
  }, [orders])

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-8 text-center">
          <p className="text-destructive">Gagal memuat data pesanan: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{summary.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Total Pemesan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShirtIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{summary.totalItems}</p>
                <p className="text-sm text-muted-foreground">Total Kaos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Size Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5" />
            Rekap per Ukuran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {SIZES.map((size) => (
              <div key={size} className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
                <span className="font-semibold text-foreground">{size}</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {summary.sizeCounts[size] || 0}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {editingOrder && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Edit Pesanan: {editingOrder.nama_lengkap}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditOrderForm
              order={editingOrder}
              onCancel={() => setEditingOrder(null)}
              onSuccess={() => {
                setEditingOrder(null)
                window.location.reload()
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShirtIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {orders.length === 0 ? "Belum ada pesanan" : "Tidak ada pesanan yang cocok"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Order Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">#{orders.length - index}</span>
                      <h3 className="font-semibold text-foreground text-lg">{order.nama_lengkap}</h3>
                    </div>

                    {order.catatan && <p className="text-sm text-muted-foreground italic">Catatan: {order.catatan}</p>}
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(order)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(order.id)}
                        disabled={isDeleting === order.id}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting === order.id ? "Menghapus..." : "Hapus"}
                      </Button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="flex flex-wrap gap-2">
                    {order.order_items.map((item) => (
                      <Badge key={item.id} variant="outline" className="text-base px-3 py-1">
                        {item.ukuran} x {item.jumlah}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
