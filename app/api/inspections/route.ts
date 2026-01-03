import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Inspection from '@/models/Inspection'
import User from '@/models/User'

const inspectionSchema = z.object({
  water_point_id: z.string().min(1, 'Water point ID wajib diisi'),
  date: z.union([z.string().datetime(), z.date()]).optional(),
  parameters: z.object({
    ph: z.number().min(0).max(14),
    tds: z.number().min(0),
    turbidity: z.number().min(0),
    temperature: z.number().optional(),
    ecoli: z.number().optional()
  }),
  photos: z.array(z.string()).optional(),
  notes: z.string().optional(),
  status: z.enum(['Aman', 'Perlu Perhatian', 'Berbahaya']).optional()
})

function serialize(inspection: any) {
  return {
    _id: inspection._id.toString(),
    water_point_id: inspection.water_point_id._id ? inspection.water_point_id._id.toString() : inspection.water_point_id.toString(),
    inspector_id: inspection.inspector_id._id ? inspection.inspector_id._id.toString() : inspection.inspector_id.toString(),
    water_point_name: inspection.water_point_id?.name || null,
    inspector_name: inspection.inspector_id?.name || null,
    date: inspection.date,
    parameters: inspection.parameters,
    photos: inspection.photos || [],
    notes: inspection.notes || '',
    status: inspection.status,
    created_at: inspection.created_at
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as 'Aman' | 'Perlu Perhatian' | 'Berbahaya' | null
    const water_point_id = searchParams.get('water_point_id')
    const inspector_id = searchParams.get('inspector_id')

    const filter: any = {}

    if (status && ['Aman', 'Perlu Perhatian', 'Berbahaya'].includes(status)) {
      filter.status = status
    }

    if (water_point_id) {
      filter.water_point_id = water_point_id
    }

    if (inspector_id) {
      filter.inspector_id = inspector_id
    }

    const inspections = await Inspection.find(filter)
      .populate('water_point_id', 'name')
      .populate('inspector_id', 'name')
      .sort({ date: -1 })
      .lean()

    return NextResponse.json({ data: inspections.map(serialize) })
  } catch (err) {
    console.error('GET /api/inspections error', err)
    return NextResponse.json({ error: 'Failed to fetch inspections' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get current user from token
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    await dbConnect()

    // Verify user exists
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const json = await req.json()
    const parsed = inspectionSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const body = parsed.data

    // Calculate status if not provided
    let status = body.status
    if (!status) {
      const { ph, tds, turbidity, ecoli } = body.parameters
      if (ph < 6.5 || ph > 8.5 || turbidity > 5 || tds > 500 || (ecoli && ecoli > 0)) {
        status = 'Berbahaya'
      } else {
        status = 'Aman'
      }
    }

    const created = await Inspection.create({
      water_point_id: body.water_point_id,
      inspector_id: decoded.userId,
      date: body.date ? new Date(body.date) : new Date(),
      parameters: body.parameters,
      photos: body.photos || [],
      notes: body.notes || '',
      status
    })

    return NextResponse.json({ data: serialize(created) }, { status: 201 })
  } catch (err) {
    console.error('POST /api/inspections error', err)
    return NextResponse.json({ error: 'Failed to create inspection' }, { status: 500 })
  }
}