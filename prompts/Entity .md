

| No | Entity (Tablo) | Açıklama | İlişki (Relationship) |
| :---- | :---- | :---- | :---- |
| **1** | **Category** | Yemek kategorileri (Yeni\!) | 1 \-\> N (MenuItem) |
| **2** | **MenuItem** | Yemekler, fiyatlar, alerjenler | N \-\> 1 (Category) |
| **3** | **Table** | Masalar ve doluluk durumu | Sabit entity |
| **4** | **Order** | Genel sipariş ve masa borcu | 1 \-\> N (OrderItem) |
| **5** | **OrderItem** | Siparişteki her bir ürün detayı | N \-\> 1 (Order/MenuItem) |

