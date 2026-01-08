# Tirta Bandung

## Pendahuluan
Tirta Bandung adalah aplikasi web yang dirancang untuk memantau kualitas dan kuantitas air di Kota Bandung. Dengan fitur-fitur seperti dashboard interaktif, daftar & pencarian titik air, serta pelaporan masalah, aplikasi ini membantu meningkatkan kesadaran dan pengelolaan sumber daya air di kota tersebut. 

## Fitur
- Dashboard berisi informasi singkat, peta dan titik air
- Daftar & pencarian 
- List/filter
- Pelaporan & Tindakan terkait permasalahan pada air
- Melihat, membuat, mengedit, menghapus titik sumber air
- Inspeksi kualitas air 

## Teknologi yang Digunakan
- Bahasa Pemrograman: Typescript, JavaScript, CSS
- Framework: Next.js
- Database: MongoDB
- Tools: Visual Code Studio, Git, npm
- OS: Windows 10/11

## Instalasi
Langkah-langkah untuk menjalan proyek secara lokal:

```bash
# clone repository
git clone https://github.com/ismailfatihraihan/tirtabandung/.git

# maasuk ke folder proyek
cd tirtabandung

# install dependency
npm install

# cara menjalankan
npm run dev
```

## Struktur Folder
tirtabandung/

├── .next/

├── app/

├── components/

├── components.json

├── hooks/

├── lib/

├── middleware.ts

├── models/

├── next-env.d.ts

├── next.config.mjs

├── node_modules/

├── package-lock.json

├── package.json

├── postcss.config.mjs

├── public/

├── query

├── Readme.md

├── scripts/

└── styles/

└── tsconfig.json

## Query
### Users- User.findOne({ email }): Cek registrasi/login
- User.create({...}): Buat user baru
- User.findById(id): Verifikasi user (pada pembuatan inspection/issue)

### WaterPoints- WaterPoint.find(filter).sort({ updated_at: -1 }).lean(): List/pencarian (filter by status, q via $regex pada fields)
- WaterPoint.create({...}): Membuat water point
- WaterPoint.findById(id): Ambil detail
- WaterPoint.findByIdAndUpdate(id, { $set: update }, { new: true }): Update
- WaterPoint.findByIdAndDelete(id): Delete (API juga memanggil Issue.deleteMany & Inspection.deleteMany dulu)

### Inspections- Inspection.find(filter).populate('water_point_id','name').populate('inspector_id','name').sort({ date: -1 }).lean(): List/filter dengan populate
- Inspection.create({...}): Membuat inspection (menggunakan userId dari JWT)

### Issues- Issue.find(filter).populate('water_point_id','name').populate('reported_by','name').sort({ created_at: -1 }).lean(): List/filter/search
- Issue.create({...}): Membuat issue (validasi ObjectId)
- Issue.findByIdAndUpdate(issue_id, update, { new: true }): Update status + populate
- Issue.deleteMany({ water_point_id: id }): Cascade deletion when a water point removed

### Schema Hook
- pre('deleteOne') pada WaterPointSchema memanggil Issue.deleteMany & Inspection.deleteMany

### Utility / Patterns
- Banyak filter berbasis query params: status enums, id filters, severity/category, and text search ({ $regex: q, $options: 'i' })

### Authentication
- JWT signed on login; API reads req.cookies.get('auth-token') to authorize POST/PATCH endpoints.

## Screenshot
![inspeksi](https://github.com/user-attachments/assets/7d08e290-df9c-44ff-896d-ab97c1627d20)

![laporan_masalah](https://github.com/user-attachments/assets/ec3acb34-b721-4246-9291-ae23a77f0f8b)

![titik_air](https://github.com/user-attachments/assets/f2def5a9-3d2a-4298-a1e9-bd5ffeff5321)

![dashboard](https://github.com/user-attachments/assets/53adcde6-5d88-4cc9-9d8f-a90ac1ff740f)

## Entity Relationship Diagram pada Database
![ERD](https://github.com/user-attachments/assets/6018efb7-23f3-464b-a96d-9451fae54680)
