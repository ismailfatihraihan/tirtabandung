import mongoose, { Schema, Document } from 'mongoose'

// Location embedded schema
const LocationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    address: { type: String, required: true },
    sub_district: { type: String, required: true },
    district: { type: String }
  },
  { _id: false }
)

export type WaterPointStatus = 'Active' | 'Under Maintenance' | 'Inactive'

export interface IWaterPoint extends Document {
  name: string
  type: 'Sumur Bor' | 'Sumur Gali' | 'PDAM' | 'Sungai' | 'Toren' | 'Reservoir' | 'Instalasi'
  depth?: number
  location: {
    lat: number
    long: number
    address: string
    sub_district: string
    district?: string
  }
  status: WaterPointStatus
  last_maintained?: Date
  created_by?: mongoose.Types.ObjectId | null
  is_verified: boolean
  archived_at?: Date | null
  created_at: Date
  updated_at: Date
}

const WaterPointSchema = new Schema<IWaterPoint>(
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
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    is_verified: { type: Boolean, default: false },
    archived_at: { type: Date, default: null }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

WaterPointSchema.index({ 'location.sub_district': 1 })
WaterPointSchema.index({ status: 1 })
WaterPointSchema.index({ created_by: 1 })

export default mongoose.models.WaterPoint || mongoose.model<IWaterPoint>('WaterPoint', WaterPointSchema)
