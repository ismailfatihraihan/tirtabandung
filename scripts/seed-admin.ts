import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import User from '../models/User'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

async function seedAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI tidak ditemukan di .env.local')
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Cek apakah admin sudah ada
    const existingAdmin = await User.findOne({ email: 'admin@tirtabandung.com' })

    if (existingAdmin) {
      console.log('Admin sudah ada di database')
      console.log('Email:', existingAdmin.email)
      console.log('Nama:', existingAdmin.name)
      await mongoose.connection.close()
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Buat admin baru
    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@tirtabandung.com',
      password: hashedPassword,
      role: 'admin',
      phone: '081234567890',
      district: 'Bandung',
      address: 'Jl. Admin No. 1, Bandung',
      is_active: true
      // avatar adalah optional field, bisa diisi nanti jika diperlukan
    })

    console.log('\nAdmin berhasil dibuat!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email    :', admin.email)
    console.log('Password :', 'admin123')
    console.log('Nama     :', admin.name)
    console.log('Role     :', admin.role)
    console.log('Phone    :', admin.phone)
    console.log('District :', admin.district)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\nGunakan kredensial di atas untuk login pertama kali')

    await mongoose.connection.close()
    console.log('\nSeeding selesai!')

  } catch (error) {
    console.error('Error saat seeding:', error)
    process.exit(1)
  }
}

// Jalankan seed function
seedAdmin()
