# Setup Icons

Extension ini memerlukan icon dalam format PNG. Berikut cara membuat icon:

## Cara Termudah - Gunakan Online Tool:

1. Buka [favicon.io](https://favicon.io/favicon-generator/)
2. Pilih "Text" dan masukkan emoji: 🤖
3. Pilih background color: #667eea
4. Klik "Download"
5. Extract file zip dan copy file berikut ke folder `icons/`:
   - android-chrome-192x192.png → rename ke icon128.png
   - favicon-32x32.png → rename ke icon48.png
   - favicon-16x16.png → rename ke icon16.png

## Cara Alternatif - Tanpa Icon (untuk testing):

Jika Anda ingin langsung test extension tanpa icon, Anda bisa:

1. Comment out bagian icons di `manifest.json`:
   ```json
   // "icons": {
   //   "16": "icons/icon16.png",
   //   "48": "icons/icon48.png",
   //   "128": "icons/icon128.png"
   // }
   ```

2. Chrome akan menggunakan icon default untuk sementara

## Cara Manual - Buat Sendiri:

Gunakan tool seperti:
- [Canva](https://www.canva.com)
- [Figma](https://www.figma.com)
- Photoshop
- GIMP

Buat 3 file PNG dengan ukuran:
- 16x16 pixels → icon16.png
- 48x48 pixels → icon48.png
- 128x128 pixels → icon128.png

Gunakan theme: Robot, AI, atau Image Generator
Warna yang direkomendasikan: #667eea dan #764ba2
