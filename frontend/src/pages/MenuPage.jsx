import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Plus, Minus, PlusCircle, MinusCircle, Loader2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
const API_URL = import.meta.env.VITE_API_URL || '/api';

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
  const { showNotification } = useNotification();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Shared cart state from server
  const [activeOrder, setActiveOrder] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchMenuData();
    fetchActiveOrder();

    // Poll for updates every 5 seconds to keep table in sync
    const interval = setInterval(fetchActiveOrder, 5000);
    return () => clearInterval(interval);
  }, [tableId]);

  const fetchMenuData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/menu-items`),
        axios.get(`${API_URL}/categories`)
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
      showNotification('Failed to load menu data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveOrder = async () => {
    try {
      const res = await axios.get(`${API_URL}/tables/${tableId}/active-order`);
      if (res.data && res.data.id) {
        const detailRes = await axios.get(`${API_URL}/orders/${res.data.id}`);
        setActiveOrder({
          ...res.data,
          order_items: detailRes.data.items
        });
      } else {
        setActiveOrder(null);
      }
    } catch (err) {
      console.error('Error fetching active order:', err);
    }
  };

  const syncItem = async (menuItemId, delta, itemName) => {
    setIsSyncing(true);
    try {
      await axios.post(`${API_URL}/tables/${tableId}/sync-item?menu_item_id=${menuItemId}&delta=${delta}`);
      await fetchActiveOrder(); // Refresh after sync
      if (delta > 0) showNotification(`${itemName} added to cart.`, 'success');
    } catch (err) {
      console.error('Sync error:', err);
      showNotification('Could not update shared cart.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const getCartQuantity = (menuItemId) => {
    if (!activeOrder || !activeOrder.order_items) return 0;
    const item = activeOrder.order_items.find(i => i.menu_item_id === menuItemId);
    return item ? item.quantity : 0;
  };

  const getTotalCartItems = () => {
    if (!activeOrder || !activeOrder.order_items) return 0;
    return activeOrder.order_items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCartPrice = () => {
    if (!activeOrder || !activeOrder.order_items || menuItems.length === 0) return 0;
    return activeOrder.order_items.reduce((total, item) => {
      const menuDetails = menuItems.find(m => m.id === item.menu_item_id);
      return total + ((menuDetails?.price || 0) * item.quantity);
    }, 0);
  };

  const handleGoToCheckout = () => {
    if (!activeOrder) return;
    navigate(`/checkout/${activeOrder.id}`);
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
    <div className="w-full max-w-7xl mx-auto px-4 pb-32">
      {/* Category Slider - Red Pill Style */}
      <div className="flex justify-center flex-wrap gap-3 py-6 mb-4">
        <button
          className={`px-6 py-2.5 rounded-full border border-red-600 font-medium transition-colors text-sm
            ${selectedCategory === 'all'
              ? 'bg-red-600 text-white shadow-[0_4px_14px_0_rgba(220,38,38,0.39)]'
              : 'bg-white text-red-600 hover:bg-red-50'
            }`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-6 py-2.5 rounded-full border border-red-600 font-medium transition-colors text-sm
              ${selectedCategory === cat.name
                ? 'bg-red-600 text-white shadow-[0_4px_14px_0_rgba(220,38,38,0.39)]'
                : 'bg-white text-red-600 hover:bg-red-50'
              }`}
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => {
          const qty = getCartQuantity(item.id);
          const imgUrl = imageUrlMap[item.name] || DEFAULT_IMAGE;

          return (
            <div key={item.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col relative pb-4">
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={imgUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 pb-2 flex flex-col flex-grow text-center">
                <span className="text-red-600 text-[10px] font-bold tracking-widest uppercase mb-3">
                  {item.categoryName}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-400 text-xs mb-4 flex-grow">
                  Tomato sauce, mozzarella cheese, fresh basil. (Vegetarian)
                </p>
                <p className="text-[22px] font-black text-green-500 mb-6">${item.price.toFixed(2)}</p>

                <div className="mt-auto flex items-center justify-center">
                  {qty > 0 ? (
                    <div className="flex items-center justify-center space-x-6 w-full">
                      <button
                        onClick={(e) => { e.stopPropagation(); syncItem(item.id, -1, item.name); }}
                        disabled={isSyncing}
                        className="text-red-500 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                      >
                        <MinusCircle size={28} strokeWidth={1} />
                      </button>
                      <span className="font-bold text-xl text-gray-900">{qty}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); syncItem(item.id, 1, item.name); }}
                        disabled={isSyncing}
                        className="text-green-500 hover:text-green-600 disabled:opacity-50 cursor-pointer"
                      >
                        <PlusCircle size={28} strokeWidth={1} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); syncItem(item.id, 1, item.name); }}
                      disabled={isSyncing}
                      className="w-[85%] py-3 px-4 bg-[#F8F9FA] hover:bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors disabled:opacity-50 border border-gray-200 cursor-pointer"
                    >
                      <PlusCircle size={18} strokeWidth={1.5} />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={handleGoToCheckout}
            className="bg-black text-white py-3.5 px-8 rounded-full shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform cursor-pointer border-2 border-transparent"
          >
            <ShoppingCart size={20} />
            <span className="font-bold tracking-wide">
              Place Order
            </span>
            <div className="bg-orange-500 text-white rounded-full px-3 py-1 text-xs font-bold flex items-center">
              {totalItems} <span className="ml-1 font-normal opacity-90">(${getTotalCartPrice().toFixed(2)})</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
