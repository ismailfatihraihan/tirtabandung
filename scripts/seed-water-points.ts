import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

// WaterPoint schema (copy dari model)
const LocationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    address: { type: String, required: true },
    sub_district: { type: String, required: true },
    district: { type: String }
  },
  { _id: false }
)

const WaterPointSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    type: {
      type: String,
      enum: ['Sumur Bor', 'Sumur Gali', 'PDAM', 'Sungai', 'Toren', 'Reservoir', 'Instalasi'],
      required: true
    },
    depth: { type: Number },
    location: { type: LocationSchema, required: true },
    status: { type: String, enum: ['Active', 'Under Maintenance', 'Inactive'], default: 'Active' },
    last_maintained: { type: Date },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    is_verified: { type: Boolean, default: false },
    archived_at: { type: Date, default: null }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

const WaterPoint = mongoose.models.WaterPoint || mongoose.model('WaterPoint', WaterPointSchema)

async function seedWaterPoints() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI tidak ditemukan di .env.local')
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if water points already exist
    const existingCount = await WaterPoint.countDocuments()
    if (existingCount > 0) {
      console.log(`${existingCount} water points sudah ada di database`)
      await mongoose.connection.close()
      return
    }

    // Sample water points
    const waterPoints = [
      {
        name: 'Sumur Bor Cibaduyut',
        type: 'Sumur Bor',
        depth: 30,
        location: {
          lat: -6.9469,
          long: 107.5866,
          address: 'Jl. Cibaduyut Raya No. 45',
          sub_district: 'Cibaduyut'
        },
        status: 'Active'
      },
      {
        name: 'PDAM Dago Pakar',
        type: 'PDAM',
        location: {
          lat: -6.8856,
          long: 107.6104,
          address: 'Jl. Dago Pakar No. 12',
          sub_district: 'Dago'
        },
        status: 'Active'
      },
      {
        name: 'Sumur Gali Bojongsoang',
        type: 'Sumur Gali',
        depth: 15,
        location: {
          lat: -6.9823,
          long: 107.6378,
          address: 'Jl. Bojongsoang No. 88',
          sub_district: 'Bojongsoang'
        },
        status: 'Active'
      }
    ]

    // Create water points
    const created = await WaterPoint.insertMany(waterPoints)

    console.log('\nWater points berhasil dibuat!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    created.forEach((wp, index) => {
      console.log(`${index + 1}. ${wp.name} (${wp.type}) - ${wp.location.sub_district}`)
    })
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    await mongoose.connection.close()
    console.log('\nSeeding selesai!')

  } catch (error) {
    console.error('Error saat seeding:', error)
    process.exit(1)
  }
}

// Jalankan seed function
seedWaterPoints()