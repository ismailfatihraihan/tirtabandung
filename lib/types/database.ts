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
  type?: 'Sumur Bor' | 'Sumur Gali' | 'PDAM' | 'Sungai' | 'Toren';
  depth?: number;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface Parameters {
  ph_level: number;
  turbidity: number;
  odor: string;
}

export interface Evidence {
  photo_url: string;
  notes: string;
}

export interface Inspection {
  _id: string;
  inspector_id: string;
  water_point_id: string;
  timestamp: Date | string;
  parameters: Parameters;
  evidence: Evidence;
  status: 'Safe' | 'Warning' | 'Unsafe';
  created_at?: Date | string;
}

export interface Issue {
  _id: string;
  reporter_id: string;
  water_point_id: string;
  severity_level: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  status: 'Perlu Disurvei' | 'Sedang Diperbaiki' | 'Selesai' | 'Invalid';
  created_at: Date | string;
  updated_at?: Date | string;
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
  assigned_district: string;
  role: 'Admin Pusat' | 'Admin' | 'Surveyor' | 'Petugas Lab' | 'Kader RT' | 'Teknisi';
  email?: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  created_at?: Date | string;
}
