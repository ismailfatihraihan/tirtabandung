import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import dbConnect from '@/lib/mongodb'
import WaterPoint from '@/models/WaterPoint'
import Issue from '@/models/Issue'
import Inspection from '@/models/Inspection'
import type { WaterPointStatus } from '@/models/WaterPoint'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(['Sumur Bor', 'Sumur Gali', 'PDAM', 'Sungai', 'Toren', 'Reservoir', 'Instalasi']).optional(),
  depth: z.number().positive().optional(),
  status: z.enum(['Active', 'Under Maintenance', 'Inactive']).optional(),
  last_maintained: z.union([z.string().datetime(), z.date()]).optional(),
  location: z.object({
    lat: z.number().optional(),
    long: z.number().optional(),
    address: z.string().min(1).optional(),
    sub_district: z.string().min(1).optional(),
    district: z.string().optional()
  }).optional()
})

function serialize(wp: any) {
  return {
    id: wp._id.toString(),
    name: wp.name,
    type: wp.type,
    depth: wp.depth ?? null,
    location: {
      lat: wp.location.lat,
      long: wp.location.long,
      address: wp.location.address,
      sub_district: wp.location.sub_district,
      district: wp.location.district ?? null
    },
    status: wp.status as WaterPointStatus,
    last_maintained: wp.last_maintained ?? null,
    is_verified: wp.is_verified ?? false,
    archived_at: wp.archived_at ?? null,
    created_at: wp.created_at,
    updated_at: wp.updated_at
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const wp = await WaterPoint.findById(id)
    if (!wp) {
      return NextResponse.json({ error: 'Water point not found' }, { status: 404 })
    }
    return NextResponse.json({ data: serialize(wp) })
  } catch (err) {
    console.error('GET /api/water-points/:id error', err)
    return NextResponse.json({ error: 'Failed to fetch water point' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const json = await req.json()
    const parsed = updateSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const update = parsed.data

    if (update.last_maintained) {
      update.last_maintained = new Date(update.last_maintained as any)
    }

    const { id } = await params

    const wp = await WaterPoint.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    )

    if (!wp) {
      return NextResponse.json({ error: 'Water point not found' }, { status: 404 })
    }

    return NextResponse.json({ data: serialize(wp) })
  } catch (err) {
    console.error('PATCH /api/water-points/:id error', err)
    return NextResponse.json({ error: 'Failed to update water point' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    
    // Manually cascade delete (explicit delete of related docs)
    await Issue.deleteMany({ water_point_id: id })
    await Inspection.deleteMany({ water_point_id: id })
    
    // Then delete water point
    const result = await WaterPoint.findByIdAndDelete(id)
    if (!result) {
      return NextResponse.json({ error: 'Water point not found' }, { status: 404 })
    }

    return NextResponse.json({ data: { message: 'Water point deleted successfully' } })
  } catch (err) {
    console.error('DELETE /api/water-points/:id error', err)
    return NextResponse.json({ error: 'Failed to delete water point' }, { status: 500 })
  }
}
