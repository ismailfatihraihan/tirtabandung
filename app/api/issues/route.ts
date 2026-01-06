import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import dbConnect from '@/lib/mongodb'
import Issue from '@/models/Issue'
import User from '@/models/User'
import '@/models/WaterPoint'

const issueSchema = z.object({
  water_point_id: z.string().min(1, 'Water point ID wajib diisi'),
  title: z.string().min(1, 'Title wajib diisi'),
  description: z.string().min(1, 'Description wajib diisi'),
  category: z.enum(['Kerusakan Fisik', 'Kualitas Air', 'Operasional', 'Lainnya']),
  severity: z.enum(['Rendah', 'Sedang', 'Tinggi', 'Kritis']),
  photos: z.array(z.string()).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
})

const updateStatusSchema = z.object({
  issue_id: z.string().min(1, 'Issue ID wajib diisi'),
  status: z.enum(['Perlu Disurvei', 'Sedang Diperbaiki', 'Selesai', 'Invalid'])
})

function serialize(issue: any) {
  return {
    _id: issue._id.toString(),
    water_point_id: issue.water_point_id?._id ? issue.water_point_id._id.toString() : null,
    reported_by: issue.reported_by?._id ? issue.reported_by._id.toString() : null,
    water_point_name: issue.water_point_id?.name || 'Tidak Ada',
    reporter_name: issue.reported_by?.name || 'Tidak Ada',
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

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as 'Perlu Disurvei' | 'Sedang Diperbaiki' | 'Selesai' | 'Invalid' | null
    const water_point_id = searchParams.get('water_point_id')
    const reported_by = searchParams.get('reported_by')
    const severity = searchParams.get('severity') as 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis' | null
    const category = searchParams.get('category') as 'Kerusakan Fisik' | 'Kualitas Air' | 'Operasional' | 'Lainnya' | null
    const q = (searchParams.get('q') || '').trim()

    const filter: any = {}

    if (status && ['Perlu Disurvei', 'Sedang Diperbaiki', 'Selesai', 'Invalid'].includes(status)) {
      filter.status = status
    }

    if (water_point_id) {
      filter.water_point_id = water_point_id
    }

    if (reported_by) {
      filter.reported_by = reported_by
    }

    if (severity && ['Rendah', 'Sedang', 'Tinggi', 'Kritis'].includes(severity)) {
      filter.severity = severity
    }

    if (category && ['Kerusakan Fisik', 'Kualitas Air', 'Operasional', 'Lainnya'].includes(category)) {
      filter.category = category
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }

    const issues = await Issue.find(filter)
      .populate('water_point_id', 'name')
      .populate('reported_by', 'name')
      .sort({ created_at: -1 })
      .lean()

    return NextResponse.json({ data: issues.map(serialize) })
  } catch (err) {
    console.error('GET /api/issues error', err)
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 })
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
    const parsed = issueSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const body = parsed.data

    // Validate water_point_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(body.water_point_id)) {
      return NextResponse.json({ error: 'Invalid water point ID' }, { status: 400 })
    }

    const created = await Issue.create({
      water_point_id: new mongoose.Types.ObjectId(body.water_point_id),
      reported_by: new mongoose.Types.ObjectId(decoded.userId),
      title: body.title,
      description: body.description,
      category: body.category,
      severity: body.severity,
      photos: body.photos || [],
      location: body.location
    })

    return NextResponse.json({ data: serialize(created) }, { status: 201 })
  } catch (err) {
    console.error('POST /api/issues error', err)
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
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

    const json = await req.json()
    const parsed = updateStatusSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { issue_id, status } = parsed.data

    if (!mongoose.Types.ObjectId.isValid(issue_id)) {
      return NextResponse.json({ error: 'Invalid issue ID' }, { status: 400 })
    }

    const update: any = { status }

    if (status === 'Selesai') {
      update.resolved_at = new Date()
      update.resolved_by = new mongoose.Types.ObjectId(decoded.userId)
    } else {
      update.resolved_at = undefined
      update.resolved_by = undefined
    }

    const updated = await Issue.findByIdAndUpdate(issue_id, update, { new: true })
      .populate('water_point_id', 'name')
      .populate('reported_by', 'name')
      .lean()

    if (!updated) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    return NextResponse.json({ data: serialize(updated) })
  } catch (err) {
    console.error('PATCH /api/issues error', err)
    return NextResponse.json({ error: 'Failed to update issue status' }, { status: 500 })
  }
}