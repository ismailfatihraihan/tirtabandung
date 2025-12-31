import mongoose, { Schema, Document } from 'mongoose'

// Parameters embedded schema
const ParametersSchema = new Schema(
  {
    ph: {
      type: Number,
      required: true,
      min: 0,
      max: 14
    },
    tds: {
      type: Number,
      required: true
    },
    turbidity: {
      type: Number,
      required: true
    },
    temperature: Number,
    ecoli: Number
  },
  { _id: false }
)

export interface IInspection extends Document {
  water_point_id: mongoose.Types.ObjectId
  inspector_id: mongoose.Types.ObjectId
  date: Date
  parameters: {
    ph: number
    tds: number
    turbidity: number
    temperature?: number
    ecoli?: number
  }
  photos?: string[]
  notes?: string
  status: 'Aman' | 'Perlu Perhatian' | 'Berbahaya'
  created_at: Date
}

const InspectionSchema = new Schema<IInspection>(
  {
    water_point_id: {
      type: Schema.Types.ObjectId,
      ref: 'WaterPoint',
      required: true
    },
    inspector_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    parameters: {
      type: ParametersSchema,
      required: true
    },
    photos: [String],
    notes: String,
    status: {
      type: String,
      enum: ['Aman', 'Perlu Perhatian', 'Berbahaya'],
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false }
  }
)

// Index untuk query
InspectionSchema.index({ water_point_id: 1, date: -1 })
InspectionSchema.index({ inspector_id: 1 })
InspectionSchema.index({ status: 1 })

export default mongoose.models.Inspection || mongoose.model<IInspection>('Inspection', InspectionSchema)
