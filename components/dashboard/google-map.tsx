"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WaterPoint } from "@/lib/types/database"
import { Droplet, MapPin } from "lucide-react"
import "leaflet/dist/leaflet.css"

type DashboardPoint = {
  id: string
  name: string
  status: WaterPoint["status"]
  location: { lat: number; long: number; address?: string; sub_district?: string; district?: string | null }
  type?: WaterPoint["type"]
  last_maintained?: string | Date | null
}

const statusMeta: Record<WaterPoint["status"], { label: string; color: string; hex: string; soft: string }> = {
  Active: { label: "Aktif", color: "text-green-700", hex: "#22c55e", soft: "bg-green-50" },
  "Under Maintenance": { label: "Maintenance", color: "text-yellow-700", hex: "#eab308", soft: "bg-yellow-50" },
  Inactive: { label: "Tidak Aktif", color: "text-red-700", hex: "#ef4444", soft: "bg-red-50" }
}

export function GoogleMapComponent() {
  const [points, setPoints] = useState<DashboardPoint[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)

  const counts = useMemo(() => {
    return points.reduce(
      (acc, p) => {
        acc.total += 1
        acc[p.status] += 1
        return acc
      },
      { total: 0, Active: 0, "Under Maintenance": 0, Inactive: 0 }
    )
  }, [points])

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/water-points?includeInactive=true", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch")
        const json = await res.json()
        const normalized: DashboardPoint[] = (json?.data || []).map((wp: any) => ({
          id: wp.id || wp._id?.toString?.() || wp._id || crypto.randomUUID(),
          name: wp.name,
          status: wp.status,
          location: {
            lat: Number(wp.location?.lat),
            long: Number(wp.location?.long),
            address: wp.location?.address,
            sub_district: wp.location?.sub_district,
            district: wp.location?.district ?? null
          },
          type: wp.type,
          last_maintained: wp.last_maintained ?? null
        }))
        setPoints(normalized)
        setSelectedId((prev) => (prev && normalized.some((p) => p.id === prev) ? prev : normalized[0]?.id || null))
      } catch (err) {
        console.error("dashboard map fetch error", err)
        setError("Gagal memuat titik air")
      } finally {
        setLoading(false)
      }
    }

    fetchPoints()
  }, [])

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return
      if (mapInstanceRef.current) return

      try {
        const L = (await import("leaflet")).default
        
        // Ensure container is clean
        if ((mapRef.current as any)._leaflet_id) {
          return // Already initialized, skip
        }

        const map = L.map(mapRef.current, {
          minZoom: 11,
          maxZoom: 18,
          maxBounds: [
            [-7.2, 107.45],
            [-6.75, 107.75]
          ],
          maxBoundsViscosity: 0.75
        }).setView([-6.9175, 107.6191], 12)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors"
        }).addTo(map)

        mapInstanceRef.current = map
      } catch (err) {
        console.error("Map init error:", err)
      }
    }

    initMap()
    
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (_) {}
        mapInstanceRef.current = null
      }
      // Clear DOM to prevent _leaflet_id from persisting
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
        delete (mapRef.current as any)._leaflet_id
      }
    }
  }, [])

  useEffect(() => {
    const renderMarkers = async () => {
      if (!mapInstanceRef.current) return
      const L = (await import("leaflet")).default
      const map = mapInstanceRef.current

      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers()
      } else {
        markersLayerRef.current = L.layerGroup().addTo(map)
      }

      const markers: any[] = []

      points.forEach((point) => {
        if (!point.location?.lat || !point.location?.long) return
        const meta = statusMeta[point.status]
        const icon = L.divIcon({
          className: "dashboard-marker",
          html: `<div style="background:${meta.hex}; width:16px; height:16px; border-radius:9999px; box-shadow:0 0 0 3px ${meta.hex}33; border:2px solid white"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
        const marker = L.marker([point.location.lat, point.location.long], { icon }).addTo(markersLayerRef.current)
        marker.bindPopup(`<div style="font-weight:600">${point.name}</div><div style="color:#475569">${meta.label}</div>`)
        marker.on("click", () => setSelectedId(point.id))
        markers.push(marker)
      })

      if (markers.length) {
        const group = L.featureGroup(markers)
        map.fitBounds(group.getBounds().pad(0.2))
      } else {
        map.setView([-6.9175, 107.6191], 12)
      }
    }

    renderMarkers()
  }, [points])

  useEffect(() => {
    const focusSelected = async () => {
      if (!selectedId || !mapInstanceRef.current) return
      const point = points.find((p) => p.id === selectedId)
      if (point) {
        mapInstanceRef.current.setView([point.location.lat, point.location.long], 14)
      }
    }

    focusSelected()
  }, [selectedId, points])

  const selectedPoint = useMemo(() => points.find((p) => p.id === selectedId) || null, [points, selectedId])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Peta Titik Air (Live)
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500" />Aktif</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-yellow-500" />Maintenance</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500" />Tidak Aktif</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm text-slate-700">
          <div className="rounded-md border border-slate-200 px-3 py-2 bg-slate-50">Total: {counts.total}</div>
          <div className="rounded-md border border-slate-200 px-3 py-2 bg-green-50">Aktif: {counts.Active}</div>
          <div className="rounded-md border border-slate-200 px-3 py-2 bg-yellow-50">Maint: {counts["Under Maintenance"]}</div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-3">{error}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div ref={mapRef} className="h-[380px] w-full" />
              </div>
            </div>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {loading ? (
                <p className="text-sm text-muted-foreground">Memuat titik air...</p>
              ) : points.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada titik air.</p>
              ) : (
                points.map((point) => {
                  const meta = statusMeta[point.status]
                  const isSelected = selectedPoint?.id === point.id
                  return (
                    <button
                      key={point.id}
                      onClick={() => setSelectedId(point.id)}
                      className={`w-full text-left rounded-lg border px-3 py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 ${
                        isSelected ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-sm text-slate-900">{point.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Droplet className="h-3 w-3" />
                            {point.location.sub_district || point.location.district || "-"}
                          </p>
                          {point.location.address && (
                            <p className="text-xs text-slate-500 line-clamp-1">{point.location.address}</p>
                          )}
                        </div>
                        <Badge className={`${meta.soft} ${meta.color} border border-transparent`}>{meta.label}</Badge>
                      </div>
                      {point.type && (
                        <div className="mt-2 text-[11px] text-slate-600">{point.type}</div>
                      )}
                      {point.last_maintained && (
                        <div className="text-[11px] text-slate-500">Maint: {new Date(point.last_maintained).toLocaleDateString("id-ID")}</div>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
