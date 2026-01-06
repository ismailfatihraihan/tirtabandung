// Database Types based on ERD

export interface Location {
  lat: number;
  long: number;
  address: string;
  sub_district: string;
}

export interface WaterPoint {
  _id: string;
  name: string;
  location: Location;
  last_maintained: Date | string;
  type?: 'Sumur Bor' | 'Sumur Gali' | 'PDAM' | 'Sungai' | 'Toren' | 'Reservoir' | 'Instalasi';
  depth?: number;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface Parameters {
  ph: number;
  tds: number;
  turbidity: number;
  temperature?: number;
  ecoli?: number;
}

export interface Inspection {
  _id: string;
  inspector_id: string;
  water_point_id: string;
  date: Date | string;
  parameters: Parameters;
  photos?: string[];
  notes?: string;
  status: 'Aman' | 'Perlu Perhatian' | 'Berbahaya';
  created_at?: Date | string;
}

export interface Issue {
  _id: string;
  water_point_id: string;
  reported_by: string;
  title: string;
  description: string;
  category: 'Kerusakan Fisik' | 'Kualitas Air' | 'Operasional' | 'Lainnya';
  water_point_name?: string; // Optional friendly display field
  reporter_name?: string; // Optional friendly display field
  severity: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
  status: 'Perlu Disurvei' | 'Sedang Diperbaiki' | 'Selesai' | 'Invalid';
  photos?: string[];
  location?: {
    lat: number;
    lng: number;
  };
  created_at: Date | string;
  updated_at?: Date | string;
  resolved_at?: Date | string;
  resolved_by?: string;
}

export interface ActionTracking {
  _id: string;
  issue_id: string;
  assigned_team: string;
  action_taken: string;
  completion_date?: Date | string;
  status: 'Pending' | 'In Progress' | 'Completed';
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}
