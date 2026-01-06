import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Issue from '@/models/Issue'
import User from '@/models/User'
import '@/models/WaterPoint'

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(['Kerusakan Fisik', 'Kualitas Air', 'Operasional', 'Lainnya']).optional(),
  severity: z.enum(['Rendah', 'Sedang', 'Tinggi', 'Kritis']).optional(),
  status: z.enum(['Perlu Disurvei', 'Sedang Diperbaiki', 'Selesai', 'Invalid']).optional(),
  photos: z.array(z.string()).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  resolved_at: z.union([z.string().datetime(), z.date()]).optional(),
  resolved_by: z.string().optional()
})

function serialize(issue: any) {
  return {
    _id: issue._id.toString(),
    water_point_id: issue.water_point_id._id ? issue.water_point_id._id.toString() : issue.water_point_id.toString(),
    reported_by: issue.reported_by._id ? issue.reported_by._id.toString() : issue.reported_by.toString(),
    water_point_name: issue.water_point_id?.name || null,
    reporter_name: issue.reported_by?.name || null,
    title: issue.title,
    description: issue.description,
    category: issue.category,
    severity: issue.severity,
    status: issue.status,
    photos: issue.photos || [],
    location: issue.location,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    resolved_at: issue.resolved_at,
    resolved_by: issue.resolved_by
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect()
    const { id } = await params
    const issue = await Issue.findById(id)
      .populate('water_point_id', 'name location')
      .populate('reported_by', 'name')
      .populate('resolved_by', 'name')
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }
    return NextResponse.json({ data: serialize(issue) })
  } catch (err) {
    console.error('GET /api/issues/:id error', err)
    return NextResponse.json({ error: 'Failed to fetch issue' }, { status: 500 })
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

    if (update.resolved_at) {
      update.resolved_at = new Date(update.resolved_at as any)
    }

    const { id } = await params

    const issue = await Issue.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    )

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    return NextResponse.json({ data: serialize(issue) })
  } catch (err) {
    console.error('PATCH /api/issues/:id error', err)
    return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 })
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
    const issue = await Issue.findById(id)
    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    await Issue.findByIdAndDelete(id)

    return NextResponse.json({ data: { id } })
  } catch (err) {
    console.error('DELETE /api/issues/:id error', err)
    return NextResponse.json({ error: 'Failed to delete issue' }, { status: 500 })
  }
}