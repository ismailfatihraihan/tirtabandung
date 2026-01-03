import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Inspection from '@/models/Inspection'
import User from '@/models/User'

const updateSchema = z.object({
  water_point_id: z.string().optional(),
  inspector_id: z.string().optional(),
  date: z.union([z.string().datetime(), z.date()]).optional(),
  parameters: z.object({
    ph: z.number().min(0).max(14).optional(),
    tds: z.number().min(0).optional(),
    turbidity: z.number().min(0).optional(),
    temperature: z.number().optional(),
    ecoli: z.number().optional()
  }).optional(),
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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const inspection = await Inspection.findById(id)
      .populate('water_point_id', 'name location')
      .populate('inspector_id', 'name')
    if (!inspection) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 })
    }
    return NextResponse.json({ data: serialize(inspection) })
  } catch (err) {
    console.error('GET /api/inspections/:id error', err)
    return NextResponse.json({ error: 'Failed to fetch inspection' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const parsed = updateSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const update = parsed.data

    if (update.date) {
      update.date = new Date(update.date as any)
    }

    const { id } = await params

    const inspection = await Inspection.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    )

    if (!inspection) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 })
    }

    return NextResponse.json({ data: serialize(inspection) })
  } catch (err) {
    console.error('PATCH /api/inspections/:id error', err)
    return NextResponse.json({ error: 'Failed to update inspection' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get current user from token
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    await dbConnect()

    // Verify user exists
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { id } = await params
    const inspection = await Inspection.findById(id)
    if (!inspection) {
      return NextResponse.json({ error: 'Inspection not found' }, { status: 404 })
    }

    await Inspection.findByIdAndDelete(id)

    return NextResponse.json({ data: { id } })
  } catch (err) {
    console.error('DELETE /api/inspections/:id error', err)
    return NextResponse.json({ error: 'Failed to delete inspection' }, { status: 500 })
  }
}