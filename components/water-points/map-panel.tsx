"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WaterPoint } from "@/lib/types/database"
import { Droplets, MapPin, Search } from "lucide-react"
import 'leaflet/dist/leaflet.css'

type StatusFilter = "all" | "active" | "maintenance" | "inactive"

type StatusMeta = {
  label: string
  dotClass: string
  badgeClass: string
  hex: string
}

const statusMeta: Record<WaterPoint["status"] | "All", StatusMeta> = {
  All: { label: "Semua", dotClass: "bg-slate-400", badgeClass: "bg-slate-100 text-slate-700", hex: "#94a3b8" },
  Active: { label: "Aktif", dotClass: "bg-green-500", badgeClass: "bg-green-50 text-green-700", hex: "#22c55e" },
  "Under Maintenance": { label: "Maintenance", dotClass: "bg-yellow-500", badgeClass: "bg-yellow-50 text-yellow-700", hex: "#eab308" },
  Inactive: { label: "Tidak Aktif", dotClass: "bg-red-500", badgeClass: "bg-red-50 text-red-700", hex: "#ef4444" }
}

type Props = {
  points: WaterPoint[]
  searchQuery: string
  statusFilter: StatusFilter
  onSearchChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
  totals: { all: number; active: number; maintenance: number; inactive: number }
}

export function WaterPointsMapPanel({
  points,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
  selectedId,
  onSelect,
  totals
}: Props) {
  const selectedPoint = useMemo(() => points.find((p) => p._id === selectedId) || null, [points, selectedId])

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useLayoutEffect(() => {
    const initMap = async () => {
      console.log('initMap called')
      if (!mapRef.current || mapInstanceRef.current) {
        console.log('initMap skipped', !!mapRef.current, !!mapInstanceRef.current)
        return
      }

      // Wait for container to have dimensions
      if (mapRef.current.clientWidth === 0 || mapRef.current.clientHeight === 0) {
        console.log('container has no dimensions, retrying...')
        setTimeout(initMap, 100)
        return
      }

      try {
        const L = (await import('leaflet')).default

        // Skip if already initialized
        if ((mapRef.current as any)._leaflet_id) {
          console.log('already has _leaflet_id, skipping')
          return
        }

        console.log('creating map, div size:', mapRef.current.clientWidth, mapRef.current.clientHeight)
        const map = L.map(mapRef.current).setView([-6.9175, 107.6191], 12)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)
        mapInstanceRef.current = map
        console.log('map created')
        // Ensure map renders properly
        requestAnimationFrame(() => {
          console.log('invalidating size')
          map.invalidateSize()
        })
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
        // Remove all leaflet-related properties
        Object.keys(mapRef.current).forEach(key => {
          if (key.startsWith('_leaflet')) {
            delete (mapRef.current as any)[key]
          }
        })
      }
    }
  }, [])

  useEffect(() => {
    const addMarkers = async () => {
      const L = (await import('leaflet')).default
      if (!mapInstanceRef.current) return
      const map = mapInstanceRef.current
      // Clear existing markers
      map.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })
      // Add new markers
      const markers: L.Marker[] = []
      points.forEach(point => {
        const meta = statusMeta[point.status]
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${meta.hex}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 2px ${meta.hex}40;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
        const marker = L.marker([point.location.lat, point.location.long], { icon }).bindPopup(point.name)
        marker.addTo(map)
        marker.on('click', () => onSelect(point._id))
        markers.push(marker)
      })
      if (markers.length > 0) {
        const group = L.featureGroup(markers)
        map.fitBounds(group.getBounds().pad(0.1))
      }
      // Ensure map renders after changes
      requestAnimationFrame(() => map.invalidateSize())
    }
    addMarkers()
  }, [points, onSelect])

  useEffect(() => {
    const panToPoint = async () => {
      if (!mapInstanceRef.current || !selectedId) return
      const selectedPoint = points.find(p => p._id === selectedId)
      if (selectedPoint) {
        mapInstanceRef.current.setView([selectedPoint.location.lat, selectedPoint.location.long], 15)
      }
    }
    panToPoint()
  }, [selectedId, points])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle>Peta & Daftar Titik Air</CardTitle>
              <p className="text-sm text-muted-foreground">Sinkron klik antara peta dan daftar</p>
            </div>
          </div>
          <div className="w-full md:w-80 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau kecamatan..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Tabs value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)} className="mt-4">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="all">Semua ({totals.all})</TabsTrigger>
            <TabsTrigger value="active">Aktif ({totals.active})</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance ({totals.maintenance})</TabsTrigger>
            <TabsTrigger value="inactive">Tidak Aktif ({totals.inactive})</TabsTrigger>
          </TabsList>
          <TabsContent value={statusFilter} />
        </Tabs>
      </CardHeader>
      <CardContent>
        {points.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">Tidak ada titik yang cocok dengan filter.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg border border-slate-200">
                <div ref={mapRef} className="w-full" style={{ height: '420px' }} />
              </div>
            </div>
            <div className="space-y-3 max-h-105 overflow-y-auto pr-1">
              {points.map((point) => {
                const meta = statusMeta[point.status]
                const isSelected = selectedPoint?._id === point._id
                return (
                  <button
                    key={point._id}
                    onClick={() => onSelect(point._id)}
                    className={`w-full text-left rounded-lg border px-3 py-3 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 ${
                      isSelected ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{point.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Droplets className="h-3 w-3" />
                          {point.location.sub_district}
                        </p>
                        <p className="text-xs text-slate-500">{point.location.address}</p>
                      </div>
                      <Badge className={`${meta.badgeClass} border border-transparent`}>{meta.label}</Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <span className="font-medium">{point.type || "-"}</span>
                      <span className="text-right">Last maint: {new Date(point.last_maintained).toLocaleDateString("id-ID")}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export type { StatusFilter }
