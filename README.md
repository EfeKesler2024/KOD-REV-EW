# Kod Review Bot 🔍

Yapay zeka destekli kod inceleme aracı (Claude API).

## VS Code'da Çalıştırma

### 1. Klasörü VS Code'da aç
`kod-review-bot` klasörünü VS Code'da aç (File → Open Folder).

### 2. Terminal aç
VS Code'da `Terminal → New Terminal` (veya Ctrl+`).

### 3. Bağımlılıkları yükle
```bash
npm install
```
(İlk seferde 2-3 dakika sürer.)

### 4. API key ekle

- İçindeki `sk-ant-xxx...` yerine kendi OPEN AI API key'ini yaz
 

### 5. Çalıştır
```bash
npm start
```
Tarayıcıda otomatik `http://localhost:3000` açılır.

---

## Kullanım
1. Sol panele kodu yapıştır
2. Dil seç (opsiyonel)
3. "Review Başlat"a tıkla
4. Bulgular, metrikler ve diff'i incele

## Özellikler
- Çoklu dil + söz dizimi renklendirme
- Kalite puanı + detaylı metrikler
- Severity'ye göre bulgular (Kritik/Uyarı/Öneri/Stil)
- Diff görünümü (birleşik + yan yana)
- Bulguya tıkla → koddaki satıra git
- Dil uyuşmazlığı tespiti

## Versiyon
**v1.0** — İlk kararlı sürüm

## Notlar
- `.env` dosyası `.gitignore`'da, GitHub'a gönderilmez (API key güvenliği)
- Her review ~0.01-0.05 USD API maliyeti
