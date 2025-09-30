# 📚 Haftalık Çalışma Takvimi

Kendi çalışma programınızı düzenleyip takip edebileceğiniz interaktif bir web uygulaması.  
Görev ekleyebilir, Excel/CSV dosyası içe aktarabilir, verilerinizi dışa aktarabilir ve takvim görünümünde çalışmalarınızı görebilirsiniz.  

---

## 🚀 Özellikler

- ✍️ **Manuel Çalışma Ekleme** (gün, saat, süre, konu, platform, açıklama)
- 📁 **Excel/CSV’den Veri İçe Aktarma**
  - Hazır şablon indirilebilir.
  - Dosya yükleyerek toplu görev ekleme.
- 💾 **Excel/CSV Olarak Dışa Aktarma**
- 🖨️ **Yazdırılabilir Program**
- 📅 **Haftalık Görünüm**
  - Günlere göre filtreleme.
- 🗓️ **Aylık Görünüm**
  - Günlük görev sayısı ve özet gösterimi.
- ✅ **Görev Tamamlama / Geri Alma**
- 🗑️ **Görev Silme**
- 📊 **İstatistikler**
  - Toplam görev sayısı
  - Haftalık toplam süre (saat cinsinden)

---

## 📂 Proje Yapısı

```
├── index.html   # Ana sayfa (HTML)
├── styles.css   # Stil dosyası (CSS)
├── script.js    # İşlevsellik (JavaScript)
```

---

## ⚙️ Kurulum

1. Projeyi bilgisayarına indir:
   ```bash
   git clone <repo-url>
   ```

2. Dosyaları bir klasörde aç.

3. `index.html` dosyasını tarayıcıda açarak kullanmaya başla.  

---

## 🛠️ Kullanılan Teknolojiler

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- [SheetJS (xlsx)](https://sheetjs.com/) → Excel/CSV işlemleri için

---

## 📌 Notlar

- Veriler **LocalStorage** üzerinde saklanır (sayfayı kapatsanız bile kaybolmaz).
- İçe aktarım yaparken `Gün, Ders/Konu, Saat, Süre, Platform, Açıklama` sütunları bulunmalıdır.
