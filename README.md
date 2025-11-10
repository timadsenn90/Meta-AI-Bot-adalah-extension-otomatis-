# 🤖 Meta AI Bot - Auto Image Generator

Extension Chrome otomatis untuk generate image di Meta AI dengan fitur jeda waktu dan kontrol penuh.

## ✨ Fitur Utama

- 🎨 **Generate Image Otomatis** - Bot akan secara otomatis mengirim prompt ke Meta AI
- ⏱️ **Jeda Waktu Kustom** - Atur interval waktu antara setiap generate (5-300 detik)
- 📝 **Multiple Prompts** - Masukkan banyak prompt sekaligus (satu per baris)
- 🎲 **Mode Random** - Pilih prompt secara acak dari daftar
- 🔄 **Loop Mode** - Ulangi otomatis dari awal setelah semua prompt selesai
- 📊 **Counter Tracking** - Hitung berapa banyak gambar yang telah dibuat
- 🎯 **Visual Indicator** - Indikator visual saat bot sedang aktif
- 💾 **Auto Save Settings** - Pengaturan tersimpan otomatis

## 📋 Persyaratan

- Browser Chrome atau Edge (Chromium-based)
- Akses ke [Meta AI](https://www.meta.ai)

## 🚀 Instalasi

### 1. Download Extension

Clone atau download repository ini:
```bash
git clone https://github.com/timadsenn90/Meta-AI-Bot-adalah-extension-otomatis-.git
cd Meta-AI-Bot-adalah-extension-otomatis-
```

Atau download sebagai ZIP dan extract.

### 2. Setup Icons (Opsional)

Untuk menambahkan icon ke extension, ikuti petunjuk di `icons/SETUP.md`.

Untuk testing cepat, Anda bisa skip langkah ini dan Chrome akan menggunakan icon default.

### 3. Load Extension ke Chrome

1. Buka Chrome dan ketik di address bar: `chrome://extensions/`
2. Aktifkan **Developer mode** (toggle di pojok kanan atas)
3. Klik tombol **"Load unpacked"**
4. Pilih folder project ini (folder yang berisi file `manifest.json`)
5. Extension akan muncul di toolbar Chrome

### 4. Pin Extension (Rekomendasi)

1. Klik icon puzzle 🧩 di toolbar Chrome
2. Cari "Meta AI Bot - Auto Image Generator"
3. Klik icon pin 📌 untuk pin ke toolbar
4. Sekarang Anda bisa mengakses extension dengan mudah

## 📖 Cara Penggunaan

### Langkah-langkah Dasar:

1. **Buka Meta AI**
   - Kunjungi [https://www.meta.ai](https://www.meta.ai)
   - Login jika diperlukan

2. **Buka Extension**
   - Klik icon Meta AI Bot di toolbar Chrome
   - Popup extension akan terbuka

3. **Masukkan Prompt**
   - Ketik prompt gambar yang ingin Anda generate
   - Setiap prompt di baris baru
   - Contoh:
     ```
     a beautiful sunset over mountains
     a cute cat playing with yarn
     futuristic city at night
     underwater scene with dolphins
     ```

4. **Atur Jeda Waktu**
   - Set jeda waktu (dalam detik) antara setiap generate
   - Minimum: 5 detik
   - Maksimum: 300 detik (5 menit)
   - Rekomendasi: 10-30 detik

5. **Pilih Mode (Opsional)**
   - ✅ **Mode Random**: Bot akan memilih prompt secara acak
   - ✅ **Loop Mode**: Bot akan mengulang dari awal setelah semua prompt selesai

6. **Mulai Bot**
   - Klik tombol **"▶ Mulai"**
   - Bot akan mulai bekerja secara otomatis
   - Indikator "🤖 Meta AI Bot Active" akan muncul di pojok kanan atas halaman

7. **Monitor Progress**
   - Status bot ditampilkan di popup
   - Counter menunjukkan jumlah gambar yang sudah dibuat
   - Anda bisa menutup popup, bot akan tetap berjalan

8. **Stop Bot**
   - Buka popup extension
   - Klik tombol **"⏹ Stop"**
   - Bot akan berhenti

### Fitur Tambahan:

#### Reset Counter
- Klik tombol **"↻ Reset"** untuk reset counter gambar ke 0

#### Auto-Resume
- Jika Anda refresh halaman, bot akan otomatis melanjutkan (jika sebelumnya aktif)

#### Settings Auto-Save
- Semua pengaturan (prompt, delay, mode) tersimpan otomatis
- Tidak perlu input ulang setiap kali

## 🎯 Tips & Trik

### Membuat Prompt yang Baik

1. **Spesifik dan Detail**
   ```
   ❌ Buruk: "a cat"
   ✅ Baik: "a fluffy orange cat sitting on a windowsill, golden hour lighting"
   ```

2. **Gunakan Deskripsi Visual**
   - Warna, lighting, mood, style
   - Contoh: "vibrant colors", "soft lighting", "dramatic atmosphere"

3. **Tambahkan Style/Artist**
   ```
   "landscape painting in the style of Bob Ross"
   "digital art, cyberpunk style"
   "watercolor illustration"
   ```

### Mengatur Jeda Waktu

- **5-10 detik**: Untuk testing cepat
- **15-30 detik**: Ideal untuk generate normal (rekomendasi)
- **60+ detik**: Untuk prompt kompleks atau koneksi lambat

### Mode Random vs Sequential

- **Sequential (default)**: Baik untuk testing prompt secara berurutan
- **Random**: Baik untuk variasi dan eksplorasi kreatif

### Loop Mode

- Aktifkan jika ingin bot berjalan terus menerus
- Nonaktifkan jika ingin bot stop setelah semua prompt selesai

## 🛠️ Troubleshooting

### Extension tidak muncul
- Pastikan Anda sudah load extension dengan benar
- Refresh halaman `chrome://extensions/`
- Cek apakah Developer mode sudah aktif

### Bot tidak mengirim prompt
- Pastikan Anda sudah login ke Meta AI
- Coba refresh halaman Meta AI
- Periksa apakah input field Meta AI terdeteksi (cek console)
- Coba atur jeda waktu lebih lama

### Prompt terkirim tapi tidak diproses
- Meta AI mungkin sedang sibuk
- Coba atur jeda waktu lebih lama (30-60 detik)
- Periksa koneksi internet

### Bot berhenti sendiri
- Cek apakah Loop Mode aktif
- Mungkin semua prompt sudah selesai diproses
- Cek console browser untuk error (F12)

### Visual indicator tidak muncul
- Refresh halaman Meta AI
- Pastikan bot dalam status "Aktif"
- Cek console untuk error

## 📁 Struktur File

```
Meta-AI-Bot-adalah-extension-otomatis-/
├── manifest.json          # Konfigurasi extension
├── popup.html            # UI popup extension
├── popup.js              # Logic popup
├── content.js            # Script yang berjalan di halaman Meta AI
├── styles.css            # Styling popup
├── icons/                # Folder icons
│   ├── SETUP.md         # Petunjuk setup icons
│   └── icon.svg         # Template icon SVG
├── create_icons.py       # Script generate icons (optional)
└── README.md             # Dokumentasi ini
```

## 🔒 Privacy & Security

- Extension ini **HANYA** berjalan di halaman Meta AI
- **TIDAK** mengumpulkan data pribadi
- **TIDAK** mengirim data ke server eksternal
- Semua data tersimpan secara lokal di browser Anda
- Open source - Anda bisa review kode sendiri

## ⚠️ Disclaimer

- Extension ini dibuat untuk tujuan edukasi dan automasi personal
- Gunakan dengan bijak dan ikuti Terms of Service Meta AI
- Jangan spam atau abuse layanan Meta AI
- Developer tidak bertanggung jawab atas penyalahgunaan

## 🤝 Kontribusi

Kontribusi selalu diterima! Jika Anda menemukan bug atau punya ide fitur baru:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Changelog

### Version 1.0.0 (2025-01-10)
- ✨ Initial release
- 🎨 Auto image generation
- ⏱️ Custom delay timer
- 📝 Multiple prompts support
- 🎲 Random mode
- 🔄 Loop mode
- 📊 Image counter
- 💾 Auto-save settings

## 📄 License

MIT License - Lihat file LICENSE untuk detail lengkap

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk komunitas AI enthusiast

## 🌟 Support

Jika extension ini berguna untuk Anda:
- ⭐ Beri star di GitHub
- 🐛 Report bugs via Issues
- 💡 Suggest fitur baru via Issues
- 📢 Share ke teman-teman

---

**Happy Generating! 🎨✨**
