import mongoose, { Schema, Document } from 'mongoose'

// Location embedded schema
const LocationSchema = new Schema(
  {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    sub_district: String
  },
  { _id: false }
)

export interface IWaterPoint extends Document {
  name: string
  type: 'Sumur' | 'Sumber Mata Air' | 'Instalasi' | 'Reservoir'
  location: {
    lat: number
    lng: number
    address: string
    district: string
    sub_district?: string
  }
  status: 'Aman' | 'Perlu Perhatian' | 'Berbahaya'
  last_maintained?: Date
  created_by: mongoose.Types.ObjectId
  is_verified: boolean
  created_at: Date
  updated_at: Date
}

const WaterPointSchema = new Schema<IWaterPoint>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['Sumur', 'Sumber Mata Air', 'Instalasi', 'Reservoir'],
      required: true
    },
    location: {
      type: LocationSchema,
      required: true
    },
    status: {
      type: String,
      enum: ['Aman', 'Perlu Perhatian', 'Berbahaya'],
      default: 'Perlu Perhatian'
    },
    last_maintained: Date,
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    is_verified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

// Index untuk query geografis dan filter
WaterPointSchema.index({ 'location.district': 1 })
WaterPointSchema.index({ status: 1 })
WaterPointSchema.index({ created_by: 1 })

export default mongoose.models.WaterPoint || mongoose.model<IWaterPoint>('WaterPoint', WaterPointSchema)
