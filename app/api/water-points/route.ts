import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import dbConnect from '@/lib/mongodb'
import WaterPoint from '@/models/WaterPoint'
import type { WaterPointStatus } from '@/models/WaterPoint'

const waterPointSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  type: z.enum(['Sumur Bor', 'Sumur Gali', 'PDAM', 'Sungai', 'Toren', 'Reservoir', 'Instalasi']),
  depth: z.number().positive().optional(),
  location: z.object({
    lat: z.number(),
    long: z.number(),
    address: z.string().min(1),
    sub_district: z.string().min(1),
    district: z.string().optional()
  }),
  status: z.enum(['Active', 'Under Maintenance', 'Inactive']).optional(),
  last_maintained: z.union([z.string().datetime(), z.date()]).optional()
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

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim().toLowerCase()
    const status = searchParams.get('status') as WaterPointStatus | null
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const filter: any = {}

    if (status && ['Active', 'Under Maintenance', 'Inactive'].includes(status)) {
      filter.status = status
    } else if (!includeInactive) {
      filter.status = { $ne: 'Inactive' }
    }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { 'location.sub_district': { $regex: q, $options: 'i' } },
        { 'location.address': { $regex: q, $options: 'i' } }
      ]
    }

    const waterPoints = await WaterPoint.find(filter).sort({ updated_at: -1 }).lean()

    return NextResponse.json({ data: waterPoints.map(serialize) })
  } catch (err) {
    console.error('GET /api/water-points error', err)
    return NextResponse.json({ error: 'Failed to fetch water points' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const json = await req.json()
    const parsed = waterPointSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const body = parsed.data

    const created = await WaterPoint.create({
      ...body,
      last_maintained: body.last_maintained ? new Date(body.last_maintained) : undefined,
      status: body.status || 'Active'
    })

    return NextResponse.json({ data: serialize(created) }, { status: 201 })
  } catch (err) {
    console.error('POST /api/water-points error', err)
    return NextResponse.json({ error: 'Failed to create water point' }, { status: 500 })
  }
}
