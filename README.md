<div align="center">
  <img src="assets/walk.svg" width="96" height="96" alt="Walking icon" />
  <h1>Absensi Wajah - HRIS Pro</h1>
  <p>Sistem HRIS ringan dengan absensi wajah, geofence, dan asisten HR berbasis AI.</p>
</div>

## Ringkasan
Absensi Wajah adalah aplikasi HRIS demo yang menggabungkan presensi berbasis kamera, validasi lokasi kantor, dan fitur HR sehari-hari. Data profil dan riwayat disimpan lokal untuk kemudahan prototyping.

## Fitur Utama
- Presensi masuk dan keluar dengan verifikasi wajah melalui kamera.
- Validasi geofence agar presensi hanya bisa dilakukan di area kantor.
- Riwayat presensi dan jadwal kerja yang ringkas.
- Profil karyawan yang dapat diperbarui langsung dari aplikasi.
- HR Assistant berbasis Gemini untuk tanya jawab seputar HR.
- Klaim reimbursement dengan pemindaian struk berbasis AI.
- Modul cuti, lembur, dan layanan internal.

## Teknologi
- React 19, TypeScript, Vite.
- Google GenAI (Gemini) untuk chat, verifikasi wajah, dan scan struk.
- Go HTTP server untuk endpoint login dan profil.

## Menjalankan Lokal
1. Install dependencies:
   `npm install`
2. Atur API key Gemini di `.env.local`:
   `GEMINI_API_KEY=YOUR_API_KEY`
3. Jalankan backend mock:
   `go run server.go`
4. Jalankan frontend:
   `npm run dev`

Frontend berjalan di `http://localhost:3000` dan backend di `http://localhost:8080`.

## Endpoint Backend
- `POST /api/login` untuk login sederhana.
- `GET /api/profile` untuk mengambil profil.
- `PUT /api/profile` untuk memperbarui profil.

## Konfigurasi Geofence
Ubah titik kantor dan radius presensi di `constants.ts`.
