import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

// User schema (copy dari model)
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['admin', 'officer'],
      required: [true, 'Role is required']
    },
    phone: {
      type: String,
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function seedAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI tidak ditemukan di .env.local')
    }

    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Cek apakah admin sudah ada
    const existingAdmin = await User.findOne({ email: 'admin@tirtabandung.com' })

    if (existingAdmin) {
      console.log('⚠️  Admin sudah ada di database')
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
      is_active: true
    })

    console.log('\n✅ Admin berhasil dibuat!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email    :', admin.email)
    console.log('🔑 Password :', 'admin123')
    console.log('👤 Nama     :', admin.name)
    console.log('🎯 Role     :', admin.role)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n💡 Gunakan kredensial di atas untuk login pertama kali')

    await mongoose.connection.close()
    console.log('\n✅ Seeding selesai!')

  } catch (error) {
    console.error('❌ Error saat seeding:', error)
    process.exit(1)
  }
}

// Jalankan seed function
seedAdmin()
