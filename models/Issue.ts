import mongoose, { Schema, Document } from 'mongoose'

export interface IIssue extends Document {
  water_point_id: mongoose.Types.ObjectId
  reported_by: mongoose.Types.ObjectId
  title: string
  description: string
  category: 'Kerusakan Fisik' | 'Kualitas Air' | 'Operasional' | 'Lainnya'
  severity: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis'
  status: 'Perlu Disurvei' | 'Sedang Diperbaiki' | 'Selesai' | 'Invalid'
  photos?: string[]
  location?: {
    lat: number
    lng: number
  }
  created_at: Date
  updated_at: Date
  resolved_at?: Date
  resolved_by?: mongoose.Types.ObjectId
}

const IssueSchema = new Schema<IIssue>(
  {
    water_point_id: {
      type: Schema.Types.ObjectId,
      ref: 'WaterPoint',
      required: true
    },
    reported_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    category: {
      type: String,
      enum: ['Kerusakan Fisik', 'Kualitas Air', 'Operasional', 'Lainnya'],
      required: true
    },
    severity: {
      type: String,
      enum: ['Rendah', 'Sedang', 'Tinggi', 'Kritis'],
      required: true
    },
    status: {
      type: String,
      enum: ['Perlu Disurvei', 'Sedang Diperbaiki', 'Selesai', 'Invalid'],
      default: 'Perlu Disurvei'
    },
    photos: [String],
    location: {
      lat: Number,
      lng: Number
    },
    resolved_at: Date,
    resolved_by: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

// Index
IssueSchema.index({ water_point_id: 1 })
IssueSchema.index({ reported_by: 1 })
IssueSchema.index({ status: 1 })
IssueSchema.index({ severity: 1 })
IssueSchema.index({ created_at: -1 })

export default mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema)
