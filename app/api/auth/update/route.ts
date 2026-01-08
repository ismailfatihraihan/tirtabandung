import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import fs from 'fs'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Tidak ada token' }, { status: 401 })

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    await dbConnect()

    // load existing user so we can delete previous avatar file if replaced
    const existingUser = await User.findById(decoded.userId).select('-password')

    const body = await request.json()
    const { name, phone, address, avatarBase64 } = body || {}

    const update: any = {}
    if (typeof name === 'string') update.name = name
    if (typeof phone === 'string') update.phone = phone
    if (typeof address === 'string') update.address = address

    // handle avatar base64 (data:image/...;base64,....)
    if (typeof avatarBase64 === 'string' && avatarBase64.startsWith('data:')) {
      const matches = avatarBase64.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/)
      if (matches) {
        const mime = matches[1]
        const ext = mime.split('/')[1] === 'jpeg' ? 'jpg' : mime.split('/')[1]
        const data = matches[3]
        const buffer = Buffer.from(data, 'base64')
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
        // use timestamped filename to avoid browser cache issues
        const filename = `${decoded.userId}-avatar-${Date.now()}.${ext}`
        const filepath = path.join(uploadsDir, filename)
        fs.writeFileSync(filepath, buffer)
        update.avatar = `/uploads/${filename}`

        // try to remove previous avatar file if it exists and is in uploads
        try {
          const prev = existingUser?.avatar
          if (prev && typeof prev === 'string' && prev.startsWith('/uploads/')) {
            const prevPath = path.join(process.cwd(), 'public', prev.replace(/^\//, ''))
            if (fs.existsSync(prevPath)) {
              fs.unlinkSync(prevPath)
            }
          }
        } catch (e) {
          console.error('Failed deleting previous avatar:', e)
        }
      }
    }

    const user = await User.findByIdAndUpdate(decoded.userId, update, { new: true }).select('-password')
    if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })

    return NextResponse.json({ success: true, user }, { status: 200 })
  } catch (err) {
    console.error('Update user error', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
