import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { name, email, password, role, phone, district, address } = body

    // Validasi input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Nama, email, password, dan role harus diisi' },
        { status: 400 }
      )
    }

    // Validasi role
    if (!['admin', 'officer'].includes(role)) {
      return NextResponse.json(
        { error: 'Role tidak valid. Pilih admin atau officer' },
        { status: 400 }
      )
    }

    // Validasi district untuk officer
    if (role === 'officer' && !district) {
      return NextResponse.json(
        { error: 'District harus diisi untuk role officer' },
        { status: 400 }
      )
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Buat user baru
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone || undefined,
      district: district || undefined,
      address: address || undefined,
      is_active: true
    })

    // Return user data (tanpa password)
    const userData = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      district: newUser.district,
      address: newUser.address,
      is_active: newUser.is_active,
      created_at: newUser.created_at
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Registrasi berhasil. Silakan login',
        user: userData 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
