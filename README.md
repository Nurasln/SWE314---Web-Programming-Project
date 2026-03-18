# QuickPay: QR Menu & Split Bill

## Genel Bakış (Project Overview)
QuickPay, modern restoranlar ve kafeler için geliştirilmiş, QR kod tabanlı bir menü görüntüleme ve sipariş verme sistemidir. Temel amacı, masada oturan misafirlerin garson beklemeden kendi telefonlarından menüyü görüntüleyebilmesi, sipariş verebilmesi ve sonunda da hesabı kendi aralarında kolayca bölebilmesidir. 

Sistem iki ana parçadan oluşur:
1. **Backend**: FastAPI tabanlı hızlı ve modern bir API. SQLModel ile veritabanı yönetimi ve Groq AI entegrasyonu ile yapay zeka destekli garson önerileri sunar.
2. **Frontend**: React (Vite) ile geliştirilmiş, TailwindCSS destekli, şık ve mobil uyumlu bir kullanıcı arayüzü. Pürüzsüz animasyonlar ve state yönetimi sağlar.

## Kurulum ve Çalıştırma

### Backend
1. `backend/` dizinine gidin.
2. Sanal çevre (virtual environment) oluşturup aktif edin: `python -m venv .venv` ve `.\.venv\Scripts\activate` (veya varsa mevcuttan devam edin)
3. Bağımlılıkları yükleyin: `pip install -r requirements.txt`
4. `.env` dosyasına Groq API anahtarınızı ekleyin.
5. Veritabanını doldurmak için: `python seed.py`
6. Sunucuyu başlatın: `uvicorn main:app --reload`

### Frontend
1. `frontend/` dizinine gidin.
2. Paketleri yükleyin: `npm install`
3. Geliştirme sunucusunu başlatın: `npm run dev`

## Teknik Derinlik (Technical Details)
- **API Katmanı**: FastAPI ile hızlı ve Python'un asenkron yapısıyla yüksek performanslı uç noktalar kurulmuştur. CORS ayarları ve Pydantic validasyonları tam yapılandırılmıştır.
- **Veri Modeli**: `SQLModel` kullanılarak `Pydantic` ve `SQLAlchemy`'nin gücü birleştirilmiş, Foreign Key ve Object Relationships (Table, MenuItem, Category, Order, OrderItem) sağlam bir yapıyla uygulanmıştır.
- **Yapay Zeka**: Chatbot entegrasyonu, güçlü LLM modeli kullanan `Groq API` ile hızlı yanınt ("waiter/garson") performansı hedeflenerek tasarlanmıştır.
- **Frontend Mimari**: Component bazlı logic, Sticky tab bar'lar, animasyonlu kart UI dizaynlarla üst segment ("premium") bir deneyim yaratıldı.
