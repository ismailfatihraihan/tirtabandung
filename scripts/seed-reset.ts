import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Issue from '../models/Issue'
import Inspection from '../models/Inspection'
import WaterPoint from '../models/WaterPoint'
import User from '../models/User'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

const ADMIN_EMAIL = 'admin@tirtabandung.com'

async function resetAndSeed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI tidak ditemukan di .env.local')
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const admin = await User.findOne({ email: ADMIN_EMAIL })
    if (!admin) {
      throw new Error(`Admin dengan email ${ADMIN_EMAIL} tidak ditemukan. Jalankan seed-admin.ts dulu.`)
    }

    console.log('Menghapus data lama (kecuali admin)...')
    await User.deleteMany({ email: { $ne: ADMIN_EMAIL } })
    await Issue.deleteMany({})
    await Inspection.deleteMany({})
    await WaterPoint.deleteMany({})
    console.log('Data lama dibersihkan')

    const waterPoints = [
      {
        name: 'Reservoir Dago Pakar',
        type: 'Reservoir',
        location: {
          lat: -6.8856,
          long: 107.6104,
          address: 'Jl. Dago Pakar No. 12',
          sub_district: 'Dago',
          district: 'Coblong'
        },
        status: 'Active',
        last_maintained: new Date('2024-12-10')
      },
      {
        name: 'Sumur Bor Cibaduyut',
        type: 'Sumur Bor',
        depth: 32,
        location: {
          lat: -6.9469,
          long: 107.5866,
          address: 'Jl. Cibaduyut Raya No. 45',
          sub_district: 'Cibaduyut',
          district: 'Bandung Kidul'
        },
        status: 'Under Maintenance',
        last_maintained: new Date('2024-11-22')
      },
      {
        name: 'Instalasi Bojongsoang',
        type: 'Instalasi',
        location: {
          lat: -6.9835,
          long: 107.662,
          address: 'Jl. Bojongsoang No. 88',
          sub_district: 'Bojongsoang',
          district: 'Bojongsoang'
        },
        status: 'Active',
        last_maintained: new Date('2024-12-01')
      },
      {
        name: 'PDAM Gedebage Timur',
        type: 'PDAM',
        location: {
          lat: -6.9508,
          long: 107.7035,
          address: 'Jl. Gedebage Selatan No. 21',
          sub_district: 'Gedebage',
          district: 'Gedebage'
        },
        status: 'Inactive',
        last_maintained: new Date('2024-10-15')
      },
      {
        name: 'Sumur Gali Cisaranten',
        type: 'Sumur Gali',
        depth: 18,
        location: {
          lat: -6.9211,
          long: 107.6822,
          address: 'Jl. Cisaranten Kulon No. 5',
          sub_district: 'Cisaranten Kulon',
          district: 'Arcamanik'
        },
        status: 'Active',
        last_maintained: new Date('2024-12-05')
      },
      {
        name: 'SPAM Cibiru Timur',
        type: 'PDAM',
        location: {
          lat: -6.9142,
          long: 107.7238,
          address: 'Jl. Cibiru Raya No. 18',
          sub_district: 'Cibiru',
          district: 'Cibiru'
        },
        status: 'Active',
        last_maintained: new Date('2024-11-28')
      },
      {
        name: 'Sumur Bor Antapani',
        type: 'Sumur Bor',
        depth: 28,
        location: {
          lat: -6.9083,
          long: 107.655,
          address: 'Jl. Purwakarta No. 77',
          sub_district: 'Antapani',
          district: 'Antapani'
        },
        status: 'Active',
        last_maintained: new Date('2024-12-08')
      },
      {
        name: 'Reservoir Sarijadi',
        type: 'Reservoir',
        location: {
          lat: -6.8774,
          long: 107.5742,
          address: 'Jl. Sarijadi Raya No. 10',
          sub_district: 'Sarijadi',
          district: 'Sukajadi'
        },
        status: 'Under Maintenance',
        last_maintained: new Date('2024-11-05')
      },
      {
        name: 'Toren Pasteur',
        type: 'Toren',
        location: {
          lat: -6.8925,
          long: 107.5958,
          address: 'Jl. Pasteur No. 120',
          sub_district: 'Pasteur',
          district: 'Sukajadi'
        },
        status: 'Inactive',
        last_maintained: new Date('2024-09-30')
      }
    ]

    console.log('Menambahkan water points contoh...')
    const createdWaterPoints = await WaterPoint.insertMany(waterPoints)
    createdWaterPoints.forEach((wp) => {
      console.log(`- ${wp.name} (${wp.status})`)
    })

    const inspections = [
      // Desember
      {
        water_point_id: createdWaterPoints[0]._id,
        inspector_id: admin._id,
        date: new Date('2024-12-15'),
        parameters: { ph: 7.1, tds: 210, turbidity: 1.1, temperature: 26, ecoli: 0 },
        status: 'Aman',
        notes: 'Kondisi stabil, tidak ada keluhan.'
      },
      {
        water_point_id: createdWaterPoints[1]._id,
        inspector_id: admin._id,
        date: new Date('2024-12-12'),
        parameters: { ph: 6.8, tds: 320, turbidity: 3.5, temperature: 27, ecoli: 15 },
        status: 'Perlu Perhatian',
        notes: 'Sedang perawatan pompa, kualitas sementara turun.'
      },
      {
        water_point_id: createdWaterPoints[2]._id,
        inspector_id: admin._id,
        date: new Date('2024-12-14'),
        parameters: { ph: 7.0, tds: 240, turbidity: 1.5, temperature: 26, ecoli: 5 },
        status: 'Aman'
      },
      // November
      {
        water_point_id: createdWaterPoints[6]._id,
        inspector_id: admin._id,
        date: new Date('2024-11-18'),
        parameters: { ph: 6.9, tds: 280, turbidity: 4.1, temperature: 27, ecoli: 18 },
        status: 'Perlu Perhatian',
        notes: 'Reservoir sedang maintenance katup utama.'
      },
      {
        water_point_id: createdWaterPoints[5]._id,
        inspector_id: admin._id,
        date: new Date('2024-11-10'),
        parameters: { ph: 7.2, tds: 230, turbidity: 2.4, temperature: 26, ecoli: 3 },
        status: 'Aman'
      },
      // Oktober
      {
        water_point_id: createdWaterPoints[3]._id,
        inspector_id: admin._id,
        date: new Date('2024-10-20'),
        parameters: { ph: 6.6, tds: 340, turbidity: 6.2, temperature: 27, ecoli: 25 },
        status: 'Berbahaya',
        notes: 'Toren lama, ditemukan kekeruhan tinggi.'
      },
      {
        water_point_id: createdWaterPoints[7]._id,
        inspector_id: admin._id,
        date: new Date('2024-10-08'),
        parameters: { ph: 6.7, tds: 360, turbidity: 5.8, temperature: 27, ecoli: 32 },
        status: 'Berbahaya',
        notes: 'Toren Pasteur butuh flushing dan disinfeksi.'
      },
      // September
      {
        water_point_id: createdWaterPoints[4]._id,
        inspector_id: admin._id,
        date: new Date('2024-09-17'),
        parameters: { ph: 7.0, tds: 250, turbidity: 2.2, temperature: 26, ecoli: 4 },
        status: 'Aman'
      },
      {
        water_point_id: createdWaterPoints[5]._id,
        inspector_id: admin._id,
        date: new Date('2024-09-09'),
        parameters: { ph: 6.9, tds: 270, turbidity: 3.0, temperature: 26, ecoli: 9 },
        status: 'Perlu Perhatian'
      },
      // Agustus
      {
        water_point_id: createdWaterPoints[6]._id,
        inspector_id: admin._id,
        date: new Date('2024-08-21'),
        parameters: { ph: 7.1, tds: 240, turbidity: 2.8, temperature: 26, ecoli: 6 },
        status: 'Aman'
      },
      {
        water_point_id: createdWaterPoints[0]._id,
        inspector_id: admin._id,
        date: new Date('2024-08-12'),
        parameters: { ph: 7.3, tds: 220, turbidity: 1.9, temperature: 26, ecoli: 2 },
        status: 'Aman'
      },
      // Juli
      {
        water_point_id: createdWaterPoints[1]._id,
        inspector_id: admin._id,
        date: new Date('2024-07-25'),
        parameters: { ph: 6.6, tds: 330, turbidity: 4.9, temperature: 27, ecoli: 22 },
        status: 'Perlu Perhatian',
        notes: 'Fluktuasi debit, disarankan uji ulang.'
      },
      {
        water_point_id: createdWaterPoints[2]._id,
        inspector_id: admin._id,
        date: new Date('2024-07-15'),
        parameters: { ph: 7.0, tds: 260, turbidity: 3.1, temperature: 26, ecoli: 10 },
        status: 'Aman'
      }
    ]

    console.log('Menambahkan inspeksi contoh...')
    await Inspection.insertMany(inspections)

    const issues = [
      {
        water_point_id: createdWaterPoints[1]._id,
        reported_by: admin._id,
        title: 'Tekanan air menurun',
        description: 'Pengguna melaporkan tekanan air rendah saat jam sibuk.',
        category: 'Operasional',
        severity: 'Sedang',
        status: 'Sedang Diperbaiki'
      },
      {
        water_point_id: createdWaterPoints[3]._id,
        reported_by: admin._id,
        title: 'Kontaminasi ringan terdeteksi',
        description: 'Hasil uji cepat menunjukkan peningkatan kekeruhan.',
        category: 'Kualitas Air',
        severity: 'Tinggi',
        status: 'Perlu Disurvei'
      },
      {
        water_point_id: createdWaterPoints[7]._id,
        reported_by: admin._id,
        title: 'Toren kotor, ada sedimen',
        description: 'Sedimen terlihat pada outlet, perlu pembersihan.',
        category: 'Kualitas Air',
        severity: 'Kritis',
        status: 'Perlu Disurvei'
      },
      {
        water_point_id: createdWaterPoints[6]._id,
        reported_by: admin._id,
        title: 'Valve bocor di sarijadi',
        description: 'Kebocoran kecil di katup distribusi barat.',
        category: 'Kerusakan Fisik',
        severity: 'Sedang',
        status: 'Sedang Diperbaiki'
      },
      {
        water_point_id: createdWaterPoints[5]._id,
        reported_by: admin._id,
        title: 'Debit turun saat malam',
        description: 'Tekanan drop setelah pukul 22.00, perlu diagnosa.',
        category: 'Operasional',
        severity: 'Rendah',
        status: 'Perlu Disurvei'
      },
      {
        water_point_id: createdWaterPoints[2]._id,
        reported_by: admin._id,
        title: 'Pompa standby overheating',
        description: 'Sensor suhu menunjukkan kenaikan pada pompa cadangan.',
        category: 'Operasional',
        severity: 'Tinggi',
        status: 'Perlu Disurvei'
      },
      {
        water_point_id: createdWaterPoints[0]._id,
        reported_by: admin._id,
        title: 'Aduan bau klorin kuat',
        description: 'Pengguna mencium bau klorin pekat di jam pagi.',
        category: 'Kualitas Air',
        severity: 'Sedang',
        status: 'Sedang Diperbaiki'
      },
      {
        water_point_id: createdWaterPoints[4]._id,
        reported_by: admin._id,
        title: 'Penutup sumur retak',
        description: 'Potensi kontaminasi fisik, perlu penggantian tutup.',
        category: 'Kerusakan Fisik',
        severity: 'Tinggi',
        status: 'Perlu Disurvei'
      }
    ]

    console.log('Menambahkan isu contoh...')
    await Issue.insertMany(issues)

    console.log('\nReset dan seeding selesai!')
    await mongoose.connection.close()
  } catch (err) {
    console.error('Error saat reset & seeding:', err)
    process.exit(1)
  }
}

resetAndSeed()
