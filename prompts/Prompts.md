1. Yeni bir Full-Stack proje yapıyoruz: **'QuickPay: QR Menu & Split Bill'**.

**Teknoloji:** FastAPI, SQLModel, SQLite. **Kural:** Kodlar, değişkenler ve UI tamamen **İNGİLİZCE** olacak.

**Database Schema:**

1. `Table`: id, number, is\_occupied.  
2. `MenuItem`: id, name, price, category.  
3. `Order`: id, table\_id, status (pending/paid).  
4. `OrderItem`: id, order\_id, menu\_item\_id, quantity.

Lütfen önce `models.py` ve `database.py` dosyalarını oluştur. Ardından `main.py` içinde masaları listeleyen, sipariş oluşturan ve 'split bill' (hesabı bölme) mantığını içeren (toplam tutarı kişi sayısına bölen basit bir logic) endpointleri yaz. CORS ayarlarını unutma.

Lütfen `seed.py` adında bir dosya oluştur. İçine 5 tane masa (Table) ve 10 tane popüler yemek (Pizza, Burger, Pasta vb.) ekleyen bir script yaz. Bunu çalıştırıp veritabanını doldurmamı sağla.

**`2.`** `frontend/` klasörü içinde Vite \+ React projesi oluştur. Tailwind CSS kullanacağız.

**Sayfalar:**

1. **Table Selection:** Masaların listesi (Dolular kırmızı, boşlar yeşil).  
2. **Menu Page:** Seçilen masaya ait ürünlerin listesi ve 'Add to Bill' butonu.  
3. **Checkout (Split Bill):** Toplam tutarı gösteren ve 'Split by 2/3/4' seçeneği sunan şık bir ödeme ekranı.

**Technical:** `axios` kullanarak Backend'e bağlan. State management için `useState` kullan. Tasarım 'Dark Mode' ve 'Mobile First' (mobil öncelikli) olsun.

**3\.**  Projemize bir **AI Waiter (Yapay Zeka Garson)** eklemek istiyoruz. Bu agent, **Groq Cloud API** (veya Gemini) kullanarak müşterilere yemek önerilerinde bulunacak.

**Backend Görevi (`ai_service.py`):**

1. Bir `recommend_dishes` fonksiyonu yaz. Bu fonksiyon parametre olarak `user_preferences` (örneğin: 'I want something spicy') ve `allergies` (örneğin: 'I am allergic to peanuts') alsın.  
2. Sisteme (System Prompt) şu rolü ver: 'You are a professional waiter at our restaurant. Based on our menu \[Buraya menüyü string olarak ekle veya DB'den çek\], suggest the best dishes and warn about allergens.'  
3. Çıktı tamamen **İNGİLİZCE** olsun.

**Frontend Görevi:**

1. Menü sayfasına bir 'Ask AI Waiter' butonu ve küçük bir sohbet penceresi (Chatbot UI) ekle.  
2. Kullanıcı sorusunu sorduğunda API'ye gitsin ve şık bir şekilde cevabı ekranda göstersin.

Lütfen bu yapıyı **Service Layer** mimarisine uygun şekilde oluştur.

**4\.** I have my Groq API Key and I want to integrate the **'AI Waiter'** feature into our 'QuickPay' project.

**Goal:** An AI that suggests dishes based on the menu and checks for allergens.

**Backend Tasks:**

1. In `services/ai_service.py`, create a class `AIWaiterService` using the `groq` library.  
2. Use the model `llama-3.3-70b-versatile` (or `mixtral-8x7b-32768`).  
3. Create an endpoint `POST /ai/suggest` that takes `user_message` and `current_menu` as input.  
4. **System Prompt:** 'You are an expert waiter. Use the provided menu to recommend dishes. Be polite and ask about allergies if not mentioned.'

**Frontend Tasks:**

1. Create a `ChatComponent.jsx`. It should be a small floating chat bubble at the bottom right.  
2. When the user types, send the message to the FastAPI backend and display the AI's response.

**CRITICAL:** Use `Pydantic` models for the request body to avoid 422 errors. Everything must be in **English**.

**5\.** I want to change the system logic. Users should NOT select tables. Instead, each table will have a unique QR code leading to a URL like `/table/:id`.

**Tasks:**

1. **Frontend (App.jsx & Routing):** Use `react-router-dom` to create a route for `/table/:tableId`.  
2. **Menu Component:** Use `useParams` to get the `tableId` from the URL.  
3. **UI Update:** Display 'Table {tableId} Menu' as the main header on the page.  
4. **State Logic:** When a user adds an item to their cart, ensure the `tableId` is included in the order data sent to the backend.  
5. **Multi-user Support:** Ensure that multiple users at the same table can browse the menu simultaneously, but each keeps their own local cart (using `useState`).

Please update my `App.jsx` and `Menu.jsx` (or equivalent) in **ENGLISH**.

**6\.** I need to add a **5th Entity** to meet the 'at least 5 entities' requirement. Please add a **Category** table and establish a relationship with `MenuItem`.

**Updates Needed:**

1. **`models.py`**:  
   * Add `Category` class (id, name, description).  
   * Update `MenuItem` to include a `category_id` (Foreign Key) and a relationship to `Category`.  
2. **`main.py`**:  
   * Add `GET /categories` to list all categories.  
   * Add `POST /categories` to create a new category (with Pydantic validation).  
   * Update `GET /menu` to optionally filter by `category_id`.  
3. **`database.py`**: Ensure the engine creates the new table.  
4. **`seed.py`**: Update the seed script to:  
   * First, create categories (e.g., 'Burgers', 'Pizzas', 'Drinks').  
   * Then, link the existing MenuItems to these category IDs.

**Goal:** Ensure code robustness and proper relational mapping. Keep everything in **ENGLISH**.

7\)

Projeye menü verilerini eklemek için Backend ve Frontend'i iki ayrı koldan besleyecek bir veri yapısı kurguladım. Aşağıdaki menü listesi ve görsel linklerini kullanarak bana iki farklı çıktı üretmeni istiyorum:  
1\. Backend Veritabanı Doldurma Betiği İçin (

seed.py): Menü elemanlarını veritabanına (SQLModel) otomatik kaydedebilmem için bana Python Dictionary formatında bir raw\_items listesi hazırla. Her kayıtta şu alanlar kesinlikle olmalı:

* name: Yemeğin tam adı.  
* price: Yemeğin türüne uygun rasyonel bir fiyat (Float).  
* category: ('Mains', 'Starters', 'Sides', 'Drinks', 'Desserts') kategorilerinden tam eşleşen biri.  
* ingredients: Yemeğin detaylı içindekiler metni. DİKKAT: Veritabanında ayrı bir alerjen sütunu açmak istemiyorum; bu yüzden 'Gluten', 'Dairy' gibi alerjen veya 'Vegan' gibi diyet uyarılarını bu metnin en sonuna parantez içinde ekle.

2\. Frontend Görsel Eşleştirme Haritası İçin (

MenuPage.jsx): Veritabanını ağırlaştırmamak adına görsel linklerini React tarafında eşleştireceğiz. Bana Frontend dosyamda kullanabilmem için imageUrlMap adında, yemeğin adını (Key) doğrudan görselin URL'sine (Value) map'leyen statik bir JavaScript sabit objesi (const) oluştur.

Kullanılacak Menü ve Link Listesi

* Margherita Pizza: [https://cdn.pixabay.com/photo/2017/12/10/14/47/pizaa-3010062\_640.jpg](https://cdn.pixabay.com/photo/2017/12/10/14/47/pizaa-3010062_640.jpg)  
* Pepperoni Pizza: [https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80\&w=500](https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500)  
* BBQ Chicken Pizza: [https://media.istockphoto.com/id/1437998613/tr/foto%C4%9Fraf/round-ready-made-fresh-pizza-with-dark-sauce-chicken-with-barbecue-sauce-lies-in-the-box.jpg?s=2048x2048\&w=is\&k=20\&c=wwftsgFxSMQedzhDU2L4Ser7nS8uCwcSS2kH3jGU3LE=](https://media.istockphoto.com/id/1437998613/tr/foto%C4%9Fraf/round-ready-made-fresh-pizza-with-dark-sauce-chicken-with-barbecue-sauce-lies-in-the-box.jpg?s=2048x2048&w=is&k=20&c=wwftsgFxSMQedzhDU2L4Ser7nS8uCwcSS2kH3jGU3LE=)  
* Classic Cheeseburger: [https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80\&w=500](https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500)  
* Mushroom Swiss Burger: [https://images.unsplash.com/photo-1550547660-d9450f859349?q=80\&w=500](https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500)  
* Spaghetti Carbonara: [https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80\&w=500](https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=500)  
* Penne Arrabbiata: [https://media.gettyimages.com/id/1170464385/photo/penne-with-tomato-sauce-and-pork.jpg?s=612x612\&w=gi\&k=20\&c=vSFgKLodGCCBtoghOdR6gHqpzKHFkBO0jIdmqdr1Lb4=](https://media.gettyimages.com/id/1170464385/photo/penne-with-tomato-sauce-and-pork.jpg?s=612x612&w=gi&k=20&c=vSFgKLodGCCBtoghOdR6gHqpzKHFkBO0jIdmqdr1Lb4=)  
* Grilled Chicken Breast: [https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80\&w=500](https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=500)  
* Ribeye Steak: [https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80\&w=500](https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=500)  
* Grilled Salmon: [https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80\&w=500](https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500)  
* Caesar Salad: [https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80\&w=500](https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500)  
* Tomato Soup: [https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80\&w=500](https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=500)  
* Bruschetta: [https://media.gettyimages.com/id/1256444154/photo/bruschetta-bruschetta-with-cherry-tomatoes-crostini-bruschetta.jpg?s=1024x1024\&w=gi\&k=20\&c=WUixx4Z5KH8mrNWKePMveT\_PmmIrY5-RIlp6AnpYuZk=](https://media.gettyimages.com/id/1256444154/photo/bruschetta-bruschetta-with-cherry-tomatoes-crostini-bruschetta.jpg?s=1024x1024&w=gi&k=20&c=WUixx4Z5KH8mrNWKePMveT_PmmIrY5-RIlp6AnpYuZk=)  
* Mozzarella Sticks: [https://media.istockphoto.com/id/1405214770/tr/foto%C4%9Fraf/deep-fried-mozzarella-cheese-sticks-with-tomato-ketchup-and-mayo-dip-served-in-a-dish.jpg?s=2048x2048\&w=is\&k=20\&c=Dn5mYyTYbZiTpxkL14GlNGifnM7NemCyd9bHhmZ8PSw=](https://media.istockphoto.com/id/1405214770/tr/foto%C4%9Fraf/deep-fried-mozzarella-cheese-sticks-with-tomato-ketchup-and-mayo-dip-served-in-a-dish.jpg?s=2048x2048&w=is&k=20&c=Dn5mYyTYbZiTpxkL14GlNGifnM7NemCyd9bHhmZ8PSw=)  
* Hummus Plate: [https://media.istockphoto.com/id/1220638760/tr/foto%C4%9Fraf/ev-yap%C4%B1m%C4%B1-humus.jpg?s=2048x2048\&w=is\&k=20\&c=8wCFvU1xWlHJHbTDRfzUmfT07NCpDRcRmC-gKihQ2lE=](https://media.istockphoto.com/id/1220638760/tr/foto%C4%9Fraf/ev-yap%C4%B1m%C4%B1-humus.jpg?s=2048x2048&w=is&k=20&c=8wCFvU1xWlHJHbTDRfzUmfT07NCpDRcRmC-gKihQ2lE=)  
* French Fries: [https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80\&w=500](https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=500)  
* Onion Rings: [https://images.unsplash.com/photo-1639024471283-03518883512d?q=80\&w=500](https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=500)  
* Mashed Potatoes: [https://media.istockphoto.com/id/655472148/tr/foto%C4%9Fraf/koyu-ah%C5%9Fap-rustik-arka-planda-yukar%C4%B1dan-d%C3%B6kme-demir-kapta-ha%C5%9Flanm%C4%B1%C5%9F-patates-p%C3%BCresi-p%C3%BCresi.jpg?s=1024x1024\&w=is\&k=20\&c=re76S8Bshk5Fkvk6josG1NEDQSGgCnz0gZdgS5\_dT1Y=](https://media.istockphoto.com/id/655472148/tr/foto%C4%9Fraf/koyu-ah%C5%9Fap-rustik-arka-planda-yukar%C4%B1dan-d%C3%B6kme-demir-kapta-ha%C5%9Flanm%C4%B1%C5%9F-patates-p%C3%BCresi-p%C3%BCresi.jpg?s=1024x1024&w=is&k=20&c=re76S8Bshk5Fkvk6josG1NEDQSGgCnz0gZdgS5_dT1Y=)  
* Turkish Tea: [https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80\&w=500](https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=500)  
* Peach Iced Tea: [https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80\&w=500](https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=500)  
* Ayran: [https://media.istockphoto.com/id/2260590701/tr/foto%C4%9Fraf/two-glasses-of-turkish-traditional-drink-ayran-kefir-or-buttermilk.jpg?s=2048x2048\&w=is\&k=20\&c=d-f\_upWMbH6GdFjUdZndO1OCLzy61PXLB2q0kWQfoK4=](https://media.istockphoto.com/id/2260590701/tr/foto%C4%9Fraf/two-glasses-of-turkish-traditional-drink-ayran-kefir-or-buttermilk.jpg?s=2048x2048&w=is&k=20&c=d-f_upWMbH6GdFjUdZndO1OCLzy61PXLB2q0kWQfoK4=)  
* Coca Cola: [https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80\&w=500](https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500)  
* Lemonade: [https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80\&w=500](https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=500)  
* Iced Coffee: [https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80\&w=500](https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=500)  
* Orange Juice: [https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80\&w=500](https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=500)  
* Water: [https://media.gettyimages.com/id/185267353/photo/backlit-plastic-water-bottle-isolated-on-white.jpg?s=2048x2048\&w=gi\&k=20\&c=Yf7WnZYNT7DqRDqeD-q1tBqq9MARFvXuzOI3fbkTnoE=](https://media.gettyimages.com/id/185267353/photo/backlit-plastic-water-bottle-isolated-on-white.jpg?s=2048x2048&w=gi&k=20&c=Yf7WnZYNT7DqRDqeD-q1tBqq9MARFvXuzOI3fbkTnoE=)  
* Chocolate Brownie: [https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80\&w=500](https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=500)  
* Tiramisu: [https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80\&w=500](https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500)  
* Blueberry Cheesecake: [https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80\&w=500](https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500)  
* Apple Pie: [https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80\&w=500](https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=500)"


8\)

Web sitesinin sipariş ekranı (

MenuPage.jsx) üzerinde çalışıyorum. Kullanıcı deneyimini artırmak için menünün üst kısmına yatay, kaydırılabilir bir 'Kategori Çubuğu' (Category Slider / Tab Navigation) eklemek istiyorum.

Sistemin React ve FastAPI (Full-Stack) mimarimize uygun çalışma mantığı şu şekilde olmalı:  
1.Dinamik Veri Çekme (Axios & FastAPI): Kategorileri ve onlara ait yemekleri statik bir JSON dosyasından değil, backend'e yazdığımız GET /categories ve GET /menu-items API uçlarından (endpoint) asenkron olarak React useEffect içinde çekmeliyiz. 2\. Slider (UI / Tailwind): Sayfanın üstünde, veritabanından dönen bu kategori isimlerinin (Örn: Mains, Starters, Drinks) yazdığı, mobilde parmakla yatay kaydırılabilen (swipable / overflow-x-auto) bir menü barı olmalı. 3\. Filtreleme Mantığı (React State): Kullanıcı bu çubuk üzerindeki bir kategoriye tıkladığında, React tarafında activeCategory durumunu (state) güncellemeli ve alttaki menü listesi anında sadece o kategoriye ait yemekleri gösterecek şekilde filtrelenmelidir. (Tüm veriler geldiğinde yemek görselleri, ürün açıklamaları ve fiyatlar da listelenmeli). 4\. Aktif Durum ve Animasyon: Tıklanmış ve seçili olan kategori (active tab), Tailwind CSS kullanılarak arkaplan rengiyle görsel olarak vurgulanmalı (örneğin dikkat çekici kırmızı bir buton olmalı) ve kategori geçişleri yumuşak bir animasyon efektiyle (transition) gösterilmelidir.  
Lütfen React'te (MenuPage) bu yapıyı Tailwind sınıflarını (classes) kullanarak API bağlantılı şekilde entegre et.

9\)

React ve FastAPI (SQLModel) kullanarak geliştirdiğimiz restoran QR menü projesine 'Alman Usulü Hesap (Split Bill)' özelliği eklemek istiyorum.  
Sistem mantığı ve gereksinimler şu şekilde çalışmalı:  
1\. Frontend (React) Arayüzü:

* Aynı masada oturan birden fazla müşteri, siparişlerini verdikten sonra 'Hesabı Öde / View Bill' butonuna bastığında ortak bir fatura ekranı (  
  TableBill.jsx) görmeli.  
* Bu ekranda masaya ait henüz ödenmemiş tüm sipariş kalemleri listelenmeli.  
* Kullanıcılar sadece kendi yedikleri ürünlerin yanındaki kutucukları (checkbox) işaretleyebilmeli ve ekrandaki toplam tutar sadece bu seçilen ürünlere göre anlık ('dinamik') olarak güncellenmeli.  
* Müşteri; Kredi Kartı, Nakit veya Yemek Çeki gibi yöntemlerden birini seçerek işlemi yapabilmeli.

2\. Backend API ve Veritabanı (FastAPI \- SQLModel):

* Ödeme takibini   
  Order (Sipariş) tablosu bazında değil, daha detaylı olması için   
  OrderItem (Sipariş edilen tekil ürün) tablosuna status: pending | paid alanı ekleyerek takip etmeliyiz.  
* Bunun için bana GET /tables/{table\_id}/bill (masadaki ödenmemiş ürünleri getiren) ve POST /tables/{table\_id}/pay (seçilen ürünlerin ID'lerini alıp ödemeyi tamamlayan) isimli iki adet endpoint (API ucu) yaz.  
* Kullanıcı hesabı ödediğinde, sadece Frontend'den gönderilen ürünlerin ID'lerinin statüsünü veritabanında paid olarak güncelle. Böylece masadaki diğer biri sayfaya girdiğinde sadece kalan (ödenmemiş) ürünleri görsün.

3\. Masa Yönetimi:

Masa numarasına ait tüm 'pending' (bekleyen) ürünler ödendiği anda, sistem hesabın tamamen kapandığını algılamalı ve   
Table tablosundaki ilgili masanın is\_occupied (dolu) durumunu False yaparak masayı otomatik olarak yeni müşterilere hazır/boş duruma getirmeli.

Lütfen bana bu iş akışını yönetecek Pydantic şemalarını, FastAPI backend güncellemelerini ve TableBill.jsx React bileşen kodunu oluştur.                                                                                         

React ve FastAPI (SQLModel) kullanarak geliştirdiğimiz restoran QR menü projesine 'Alman Usulü Hesap (Split Bill)' özelliği eklemek istiyorum.  
Sistem mantığı ve gereksinimler şu şekilde çalışmalı:  
1\. Frontend (React) Arayüzü:

* Aynı masada oturan birden fazla müşteri, siparişlerini verdikten sonra 'Hesabı Öde / View Bill' butonuna bastığında ortak bir fatura ekranı (  
  TableBill.jsx) görmeli.  
* Bu ekranda masaya ait henüz ödenmemiş tüm sipariş kalemleri listelenmeli.  
* Kullanıcılar sadece kendi yedikleri ürünlerin yanındaki kutucukları (checkbox) işaretleyebilmeli ve ekrandaki toplam tutar sadece bu seçilen ürünlere göre anlık ('dinamik') olarak güncellenmeli.  
* Müşteri; Kredi Kartı, Nakit veya Yemek Çeki gibi yöntemlerden birini seçerek işlemi yapabilmeli.

2\. Backend API ve Veritabanı (FastAPI \- SQLModel):

* Ödeme takibini   
  Order (Sipariş) tablosu bazında değil, daha detaylı olması için   
  OrderItem (Sipariş edilen tekil ürün) tablosuna status: pending | paid alanı ekleyerek takip etmeliyiz.  
* Bunun için bana GET /tables/{table\_id}/bill (masadaki ödenmemiş ürünleri getiren) ve POST /tables/{table\_id}/pay (seçilen ürünlerin ID'lerini alıp ödemeyi tamamlayan) isimli iki adet endpoint (API ucu) yaz.  
* Kullanıcı hesabı ödediğinde, sadece Frontend'den gönderilen ürünlerin ID'lerinin statüsünü veritabanında paid olarak güncelle. Böylece masadaki diğer biri sayfaya girdiğinde sadece kalan (ödenmemiş) ürünleri görsün.

3\. Masa Yönetimi:

* Masa numarasına ait tüm 'pending' (bekleyen) ürünler ödendiği anda, sistem hesabın tamamen kapandığını algılamalı ve   
  Table tablosundaki ilgili masanın is\_occupied (dolu) durumunu False yaparak masayı otomatik olarak yeni müşterilere hazır/boş duruma getirmeli.

Lütfen bana bu iş akışını yönetecek Pydantic şemalarını, FastAPI backend güncellemelerini ve TableBill.jsx React bileşen kodunu oluştur.

10\)

Restoran projemizin müşteri deneyimini başlatacak olan 'QR Kod ve Masa Erişimi' altyapısını kurmak istiyorum. Eğitmene (jüriye) profesyonel bir sunum yapabilmem için hem QR üreten bir Admin paneline hem de akıcı test edebileceğimiz bir Karşılama (Landing) Ekranına ihtiyacım var.  
Sistemi aşağıdaki mühendislik gereksinimlerine göre (React ve Tailwind CSS ile) yaz:  
1\. Dinamik QR Admin Paneli (  
QRDashboard.jsx):

* /admin/qrcodes rotasında çalışacak bir yönetim ekranı tasarla.  
* Öncelikle Backend veritabanında kayıtlı olan tüm masaları GET /tables ucuyla (Axios kullanarak) dinamik olarak çek. Sadece veritabanında var olan masalar için QR üretilsin.  
* DİKKAT (Ağ Uyumluluğu): Her masa için oluşturulacak erişim linklerini URL içine localhost yazarak statik/sabit bırakma\! Projeyi sunarken bilgisayarımı telefonumun internetine (hotspot) bağladığımda IP adresim değişeceği için, JavaScript ile window.location.origin komutunu kullanarak o anki aktif ağ IP'sini dinamik olarak yakalasın (Örn: http://172.x.x.x:5173/table/1).  
* QR kod görsellerini oluşturmak için api.qrserver.com REST servisini kullan.  
* Sayfaya bir 'Yazdır (Print)' butonu ekle. Yazdırılacağı zaman ekrandaki gereksiz butonların gizlenip sadece QR kodların kağıda temiz çıkması için Tailwind CSS Print sınıflarını entegre et.

2\. Demo / Sunum Karşılama Ekranı (  
App.jsx):

* Kullanıcı sitenin kök dizinine (/) girdiğinde onu 'QuickPay'e Hoş Geldiniz, Lütfen Masanızdaki QR Kodu Okutun' diyen şık bir karşılama sayfası (Landing Page) karşılasın.  
* Demo Simülatörü: Bu sayfaya, sunum sırasında hocaya hızlıca sistemi gösterebilmemiz için (gerçekten telefondan QR okutmakla vakit kaybetmemek adına) gizli/küçük bir 'Test Simülatörü' alanı ekle. Bu alandaki butonlar tıklandığında doğrudan Masa 1 (/table/1) ve Masa 2 (/table/2) sipariş ekranlarına yönlendirsin.

Lütfen React Router yapısını bu bileşenlere göre güncelle ve QRDashboard sayfasının kodlarını bu mantıkla oluştur.

11\)

Restoran projemde kullanıcı deneyimini şıklaştırmak ve kullanıcıya işlem durumunu (başarılı/hatalı) anlık göstermek için Merkezi bir Bildirim Sistemi (Global Toast Notification) kurmak istiyorum. Sayfalarda çirkin "alert()" pencereleri çıkarmak istemiyorum.  
Aşağıdaki mimariye uygun olarak bana bir 'NotificationContext' yapısı oluştur ve sayfalara entegre et:  
1\. Context API ve Merkezi State (NotificationContext.jsx):

* React'ın createContext yapısını kullanarak, sadece tek bir satır kodla (showNotification) projenin her yerinden çağırabileceğim bir yapı kur.  
* Bildirim tipleri en azından 'success' ve 'error' olarak parametre alsın.  
* Bildirim tetiklendiğinde ekranda belirsin ve tam 3 saniye sonra otomatik olarak setTimeout ile kendini bellekten/ekrandan temizlesin.

2\. Kullanıcı Arayüzü (Yüzen Baloncuklar \- UI):

* Tailwind CSS kullanarak, ekranın üst veya alt kısmında ortalanmış, diğer tüm sayfaların üzerinde duran (z-index: 50, fixed) şık tasarım animasyonlu kutucuklar (Toast/Snackbars) tasarla.  
* Yolladığım parametreye göre; success gelirse yeşil ağırlıklı ve onay (Check) ikonlu, error gelirse kırmızı ağırlıklı ve x (Alert) ikonlu bir tasarıma dönsün. (İkonları lucide-react kullanarak entegre edebilirsin).

3\. Uygulamaya Entegrasyon (App ve Sayfalar):

* Yazdığın bu NotificationProvider ile   
  App.jsx içerisindeki tüm kök dizinimi sar ki tüm sayfalar bu özelliğe erişebilsin.  
* Bana örnek kullanım olarak   
  MenuPage.jsx sayfasında sepete ürün eklendiğinde *"Sepete eklendi"* ve *"Sipariş mutfağa iletildi"* mesajlarının nasıl gösterileceğini yaz.  
* Aynı şekilde Alman Usulü Hesap ödeme ekranında (  
  TableBill.jsx), Nakit seçeneğine tıklandığında *"Nakit ödeme işaretlendi, personel yönlendiriliyor..."* gibi mesajların useNotification() hook'uyla nasıl çağırılacağını projeme uyarla.

Lütfen Tailwind, ContextAPI ve bildirim temizleme mantığına uygun olarak bu özelliği projeme kat.

12\)

Projemizin Frontend tarafındaki tüm arayüz (UI) metinlerini İngilizceye çevirmek istiyorum.  
Lütfen   
App.jsx,   
MenuPage.jsx,   
TableBill.jsx,   
QRDashboard.jsx ve   
ChatComponent.jsx dosyalarının kodlarını incele. Bu sayfalarda arayüze gömdüğümüz (hardcoded) tüm buton isimlerini (Örn: Sipariş Ver \-\> Place Order), tablo başlıklarını, kullanıcıya gösterilen toast bildirim mesajlarını ('Sepete eklendi' gibi) ve boş mesaj kutularını yapıya uygun olarak İngilizceye çevir. Kodun algoritmasına, Tailwind tasarımlarına ve React Router bağlantılarına dokunmadan sadece görünür metinleri(güncelle.  
