# 🔍 Kod İnceleme Botu (Code Review Bot)

AI-powered kod analizi ve kalite kontrol aracı. Kodunuzu yükle, OpenAI tarafından incelettir, detaylı rapor ve iyileştirmeleri al.

---

## ✨ Özellikler

### 📁 Kod Yönetimi
- ✅ Dosya yükleme (`.js`, `.py`, `.java` vb.)
- ✅ Direkt kod yapıştırma
- ✅ Otomatik dil algılama (13+ dil)
- ✅ **Desteklenen Diller:** JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, SQL, HTML/CSS

### 🔄 Kod Çevirisi
- ✅ Kodu herhangi bir dile çevir
- ✅ Python → JavaScript, Go → Rust gibi dönüşümler
- ✅ Syntax kontrolü ve otomatik formatting

### 🎯 Kod Analizi & Review
- ✅ **Kalite Puanı** (0-100)
- ✅ **4 Metrik Analizi:**
  - 🔒 **Güvenlik** - SQL injection, XSS vb. güvenlik açıkları
  - ⚡ **Performans** - Algoritma verimliliği, optimization fırsatları
  - 👁️ **Okunabilirlik** - Kod netliği, naming conventions
  - 🔧 **Sürdürülebilirlik** - Mimarı, tekrar kullanılabilirlik

### 📊 Detaylı Bulgular
- 🔴 **Kritik** - Dikkat gerektiren sorunlar
- 🟡 **Uyarı** - Dikkat edilmesi gereken durumlar
- 💡 **Öneri** - İyileştirme önerileri
- 🎨 **Stil** - Best practices ve stil önerileri
- **Satır referansları** - hataların nerede olduğunu gösterir.

### ✨ İyileştirilmiş Kod
- ✅ AI tarafından refactored kod
- ✅ **Side-by-side Diff** - Eski vs Yeni karşılaştırması
- ✅ **Neler Değişti** - Değişikliklerin açıklaması
- ✅ Kopyala & Yapıştır (one-click copy)

### 🧪 Birim Testleri
- ✅ Otomatik test generation
- ✅ **Test Framework Desteği:**
  - Jest (JavaScript)
  - Pytest (Python)
  - JUnit (Java)
  - xUnit (.NET)
  - ve daha fazla...
- ✅ Orijinal + İyileştirilmiş kod için ayrı testler

### 📊 Kod İstatistikleri
- ✅ **Satır Sayısı** - Toplam, Kod, Yorum
- ✅ **Yapı Metrikleri** - Sınıf, Fonksiyon sayısı
- ✅ **Karmaşıklık Analizi:**
  - If/Else oranı
  - Döngü sayısı
  - Switch/Match sayısı
  - Try/Catch blokları
  - **Siklomatik Karmaşıklık** (Düşük/Orta/Yüksek/Çok Yüksek)
- ✅ **İç İçe Derinlik** - Max nesting level
- ✅ **Fonksiyon Uzunluğu** - Ortalama ve en uzun

### 📄 PDF Rapor
- ✅ Tüm analizi profesyonel PDF'e dönüştür
- ✅ Takım ile paylaş
- ✅ Arşiv ve dokümantasyon

### 🌓 Tema & Dil Desteği
- ✅ **Dark Mode** - Göz yormayan arayüz
- ✅ **Light Mode** - Açık arayüz
- ✅ **Çok Dil Desteği:**
  - 🇹🇷 Türkçe
  - 🇬🇧 İngilizce
  - (Kolayca genişletilebilir)

### 💰 Kullanım Takibi
- ✅ Token kullanımı (Input/Output)
- ✅ API çağrısı sayacı
- ✅ Oturum maliyeti gösterimi
- ✅ Sıfırla butonu

---

## 🚀 Hızlı Başlangıç

### Ön Koşullar
- **Node.js** 16+ ve **npm** 8+
- **OpenAI API anahtarı** ([platform.openai.com](https://platform.openai.com))

### Kurulum

1. **Repository'i klonla:**
```bash
git clone https://github.com/yourusername/kod-review-bot.git
cd kod-review-bot
```

2. **Bağımlılıkları yükle:**
```bash
npm install
```

3. **`.env` dosyası oluştur:**
```bash
cp .env.example .env
```

4. **OpenAI API anahtarını ekle:**
```
REACT_APP_OPENAI_API_KEY=sk-your-api-key-here
```

5. **Geliştirme sunucusunu başlat:**
```bash
npm start
```

6. **Tarayıcıda aç:**
```
http://localhost:3000
```

---

## 📖 Kullanım

### 1️⃣ Kod Yükle
- **Seçenek A:** "📁 Dosya Yükle" butonuna tıkla → Dosya seç
- **Seçenek B:** Sol panele doğrudan kod yapıştır

### 2️⃣ Dil Seç (İsteğe Bağlı)
- Varsayılan: Otomatik algıla
- Manual seçim için dropdown'dan dil seç

### 3️⃣ Review Başlat
- **"▶ Review Başlat"** butonuna tıkla
- AI analizi başlayacak (30-120 saniye)

### 4️⃣ Sonuçları İncele
5 sekmede sonuçları gör:
- 📖 **Açıklama** - Kod nedir?
- 🎯 **Bulgular** - Sorunlar ve öneriler
- 📊 **Diff** - Değişiklikleri yan yana gör
- ✨ **İyileştirilmiş Kod** - Refactored versiyon
- 🧪 **Testler** - Birim test örnekleri

### 5️⃣ PDF'e Aktar
- **"📄 PDF İndir"** butonuna tıkla
- Rapor indirilecek

---

## 🎨 Arayüz Özellikleri

### Dark Mode (GitHub-style)
```
Arka Plan: #0d1117
Yüzey: #161b22
Metin: #c9d1d9
Vurgu (Mavi): #58a6ff
Aksan (Yeşil): #3fb950
```

### Light Mode
```
Arka Plan: #ffffff
Yüzey: #f6f8fa
Metin: #1f2328
Vurgu (Mavi): #0969da
Aksan (Yeşil): #1a7f37
```

### Söz Dizimi Vurgulama
Kodlar renklendirilmiş gösterilir:
- 🔴 Keywords
- 🔵 Strings
- 🟡 Numbers

---

## 📊 API Kullanımı

### OpenAI Modeli
- **Model:** `gpt-4o`
- **Max Tokens:** ~16000
- **Temperature:** 0.2



## 🛠️ Teknoloji Stack

| Kategori | Teknoloji |
|----------|-----------|
| **Frontend** | React 18+, Hooks (useState, useRef, useEffect) |
| **Dil** | JavaScript/JSX |
| **Stil** | CSS-in-JS (inline styles) |
| **Tema** | CSS Variables (dark/light switching) |
| **API** | OpenAI API (REST) |
| **Export** | HTML to PDF (html2pdf.js) |
| **Söz Dizimi** | Prism.js veya custom highlighter |

---

## 📁 Proje Yapısı

```
kod-review-bot/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx           # Ana bileşen (1400+ satır)
│   ├── index.js          # Entry point
│   └── styles/           # Global stiller
├── .env                  # Ortam değişkenleri
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

### App.jsx İçeriği
- **I18N (Uluslararasılaştırma):** TR/EN çevirileri
- **Component Hooks:** State yönetimi
- **PDF Export:** html2pdf entegrasyonu
- **Color Theme:** Dark/Light toggle
- **API Integration:** OpenAI çağrıları
- **Syntax Highlighting:** Kod renklendirilmesi

---

## 🔐 Güvenlik

### API Anahtarını Koru
```javascript
// ❌ GİTHUB'A PUSHLANMAZ
REACT_APP_OPENAI_API_KEY=sk-xxx

// ✅ .env'de sakla
// .gitignore'da olsun:
.env
.env.local
```

### Best Practices
- API anahtarını hiçbir zaman kodu içine yapıştırma
- `.env` dosyasını `.gitignore`'a ekle
- Rate limiting kullan (overuse'u önlemek)

---

## 🐛 Sorun Giderme

### "API anahtarı eksik" hatası
```
✅ Çözüm: .env dosyasında REACT_APP_OPENAI_API_KEY'i ayarla
Değişiklikten sonra: npm start ile sunucuyu yeniden başlat
```

### "PDF açılamıyor" hatası
```
✅ Çözüm: Tarayıcı pop-up'ı engelliyordur
- Adresleme çubuğundan pop-up engellemeyi kapat
- "PDF olarak kaydet" dialog'unda "Kaydet" tıkla
```

### "Review çok uzun sürüyor"
```
✅ Çözümler:
- Daha kısa kod parçası dene (500 satır < idealdir)
- İnternet bağlantısını kontrol et
- OpenAI servisini kontrol et (status.openai.com)
```

### "Kod renklendirilmiyor"
```
✅ Çözüm: Tarayıcı konsolunu aç (F12) ve hata mesajını kontrol et
```

---

## 📈 Performans Optimizasyonu

### Kod Boyutu
- Minimumda tut: <10,000 satır (idealdir: <500)
- Çok büyük dosyalar timeout olabilir

### Rate Limiting
- OpenAI'nin rate limitini aşmamak için bekleme ekle
- Production'da: Retry logic ekle

### Caching
- Aynı kod için tekrarlanan analizi cache'le (ileri geliştirme)

---

---

## 📝 Lisans

Apache 2.0

---


---

## 📧 İletişim

- LinkedIn: https://www.linkedin.com/in/efe-kesler-31519a323/
