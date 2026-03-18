import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, PlusCircle, MinusCircle, Loader2 } from 'lucide-react';

const imageUrlMap = {
  "Margherita Pizza": "https://cdn.pixabay.com/photo/2017/12/10/14/47/pizaa-3010062_640.jpg",
  "Pepperoni Pizza": "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500",
  "BBQ Chicken Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500",
  "Classic Cheeseburger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500",
  "Mushroom Swiss Burger": "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=500",
  "Spaghetti Carbonara": "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=500",
  "Penne Arrabbiata": "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=500",
  "Grilled Chicken Breast": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=500",
  "Ribeye Steak": "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=500",
  "Grilled Salmon": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500",
  "Caesar Salad": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500",
  "Tomato Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=500",
  "Bruschetta": "https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=500",
  "Mozzarella Sticks": "https://media.istockphoto.com/id/1405214770/tr/foto%C4%9Fraf/deep-fried-mozzarella-cheese-sticks-with-tomato-ketchup-and-mayo-dip-served-in-a-dish.jpg?s=2048x2048&w=is&k=20&c=Dn5mYyTYbZiTpxkL14GlNGifnM7NemCyd9bHhmZ8PSw=",
  "Hummus Plate": "https://media.istockphoto.com/id/1220638760/tr/foto%C4%9Fraf/ev-yap%C4%B1m%C4%B1-humus.jpg?s=2048x2048&w=is&k=20&c=8wCFvU1xWlHJHbTDRfzUmfT07NCpDRcRmC-gKihQ2lE=",
  "French Fries": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=500",
  "Onion Rings": "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=500",
  "Mashed Potatoes": "https://media.istockphoto.com/id/655472148/tr/foto%C4%9Fraf/koyu-ah%C5%9Fap-rustik-arka-planda-yukar%C4%B1dan-d%C3%B6kme-demir-kapta-ha%C5%9Flanm%C4%B1%C5%9F-patates-p%C3%BCresi-p%C3%BCresi.jpg?s=1024x1024&w=is&k=20&c=re76S8Bshk5Fkvk6josG1NEDQSGgCnz0gZdgS5_dT1Y=",
  "Turkish Tea": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=500",
  "Peach Iced Tea": "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=500",
  "Ayran": "https://media.istockphoto.com/id/2260590701/tr/foto%C4%9Fraf/two-glasses-of-turkish-traditional-drink-ayran-kefir-or-buttermilk.jpg?s=2048x2048&w=is&k=20&c=d-f_upWMbH6GdFjUdZndO1OCLzy61PXLB2q0kWQfoK4=",
  "Coca Cola": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500",
  "Lemonade": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=500",
  "Iced Coffee": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=500",
  "Orange Juice": "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=500",
  "Water": "https://media.istockphoto.com/id/1353351865/tr/foto%C4%9Fraf/shochu-and-snacks-placed-on-a-black-wood-grain-background.jpg?s=2048x2048&w=is&k=20&c=L-uopDX-v2uoO-xc1f8n3Ksw48tbkssDO5hBcmQyibs=",
  "Chocolate Brownie": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=500",
  "Tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500",
  "Cheesecake": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500",
  "Apple Pie": "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=500",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500";

const MenuPage = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // Local cart state for multi-user support
  const [cart, setCart] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/menu-items'),
        axios.get('http://127.0.0.1:8000/categories')
      ]);
      
      const catMap = {};
      catRes.data.forEach(c => catMap[c.id] = c.name);
      
      const itemsWithCategory = menuRes.data.map(item => ({
        ...item,
        categoryName: catMap[item.category_id] || "Other"
      }));
      
      setMenuItems(itemsWithCategory);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load menu data.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) => 
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === itemId);
      if (existingItem && existingItem.qty > 1) {
        return prevCart.map((i) => 
          i.id === itemId ? { ...i, qty: i.qty - 1 } : i
        );
      }
      return prevCart.filter((i) => i.id !== itemId);
    });
  };

  const getCartQuantity = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    return item ? item.qty : 0;
  };

  const getTotalCartItems = () => cart.reduce((total, item) => total + item.qty, 0);
  const getTotalCartPrice = () => cart.reduce((total, item) => total + (item.price * item.qty), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    
    try {
      const orderRes = await axios.post(`http://127.0.0.1:8000/orders?table_id=${tableId}`);
      const orderId = orderRes.data.id;

      for (const item of cart) {
        await axios.post(`http://127.0.0.1:8000/orders/${orderId}/items?menu_item_id=${item.id}&quantity=${item.qty}`);
      }

      setCart([]);
      navigate(`/checkout/${orderId}`);
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Could not place order. Please check the console for details.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.categoryName === selectedCategory);

  const totalItems = getTotalCartItems();

  return (
    <div className="page-container pb-32">
      <div className="mb-4 pt-4 text-center">
        <div className="inline-block bg-red-100 text-red-600 px-4 py-1.5 rounded-full font-bold text-sm tracking-widest uppercase mb-3">
          Table {tableId}
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          ✨ Gourmet Flavors Menu
        </h1>
      </div>

      <div className="category-slider">
        <button 
          className={`cat-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.id}
            className={`cat-btn ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="menu-grid" id="menu-container">
        {filteredItems.map(item => {
          const qty = getCartQuantity(item.id);
          const imgUrl = imageUrlMap[item.name] || DEFAULT_IMAGE;
          
          return (
            <div key={item.id} className="menu-card fade-in relative">
              <img src={imgUrl} alt={item.name} />
              <div className="info flex flex-col">
                <span className="category-tag">{item.categoryName}</span>
                <h3 className="flex-grow">{item.name}</h3>
                <p className="price">${item.price.toFixed(2)}</p>
                
                {qty > 0 ? (
                  <div className="mt-4 flex items-center justify-between border border-gray-200 dark:border-gray-600 rounded-xl p-1 bg-gray-50 dark:bg-gray-700/30">
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <MinusCircle size={20} />
                    </button>
                    <span className="font-bold w-8 text-center text-gray-900 dark:text-white">{qty}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                    className="mt-4 w-full py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 font-semibold transition-all bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 border border-gray-200 dark:border-gray-600 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900 cursor-pointer"
                  >
                    <PlusCircle size={18} />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-[6.5rem] right-6 sm:bottom-6 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-40 animate-bounce-short">
          <button
            onClick={handlePlaceOrder}
            disabled={isOrdering}
            className="bg-black dark:bg-white text-white dark:text-black py-3.5 px-6 rounded-full shadow-2xl flex items-center space-x-4 hover:scale-105 transition-transform disabled:opacity-80 disabled:hover:scale-100 cursor-pointer"
          >
            {isOrdering ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <ShoppingCart size={20} />
            )}
            <span className="font-bold hidden sm:inline">
              {isOrdering ? 'Placing Order...' : 'Place Order'}
            </span>
            <div className="bg-orange-500 text-white rounded-full px-2.5 py-0.5 text-sm font-bold flex items-center justify-center -mr-2">
              {totalItems} <span className="text-xs ml-1 opacity-80 font-normal">(${(getTotalCartPrice()).toFixed(2)})</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
