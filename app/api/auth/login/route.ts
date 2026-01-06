import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { email, password } = body

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      )
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Cek apakah user aktif
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Akun Anda tidak aktif. Hubungi administrator' },
        { status: 403 }
      )
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Buat JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Token berlaku 7 hari
    )

    // Siapkan data user (tanpa password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      is_active: user.is_active,
      created_at: user.created_at
    }

    // Set cookie dengan httpOnly
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Login berhasil',
        user: userData 
      },
      { status: 200 }
    )

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 hari
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
