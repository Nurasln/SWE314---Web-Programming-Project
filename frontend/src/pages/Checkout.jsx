import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Receipt, ArrowLeft, Wallet, Banknote } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [order, setOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      setOrder(response.data);
      const initialSelection = {};
      response.data.items.forEach(item => {
        initialSelection[item.id] = 0;
      });
      setSelectedItems(initialSelection);
    } catch (err) {
      console.error(err);
      showNotification('Could not fetch order details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (itemId, remainingQty) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: prev[itemId] > 0 ? 0 : 1 // Select 1 qty for now, could be remainingQty
    }));
  };

  const calculateSelectedTotal = () => {
    if (!order) return 0;
    return order.items.reduce((total, item) => {
      return total + (item.price * (selectedItems[item.id] || 0));
    }, 0);
  };

  const getRemainingTotal = () => {
    if (!order) return 0;
    return order.items.reduce((total, item) => {
      return total + (item.price * item.remaining_quantity);
    }, 0);
  };

  const handlePay = async () => {
    const itemsToPay = Object.entries(selectedItems)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({ order_item_id: parseInt(id), quantity: qty }));

    if (itemsToPay.length === 0) {
      showNotification('Please select at least one item to pay for.', 'warning');
      return;
    }

    if ((paymentMethod === 'credit_card' || paymentMethod === 'meal_card')) {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        showNotification('Please fill in all card details.', 'warning');
        return;
      }
      if (cardDetails.number.length < 19) { // 16 digits + 3 spaces
        showNotification('Invalid card number.', 'warning');
        return;
      }

      // Month validation
      const monthStr = cardDetails.expiry.substring(0, 2);
      const month = parseInt(monthStr);
      if (isNaN(month) || month < 1 || month > 12) {
        showNotification('Invalid month (Geçersiz Ay).', 'error');
        return;
      }
    }

    setPaying(true);
    try {
      const response = await axios.post(`${API_URL}/orders/${orderId}/pay-items`, {
        items: itemsToPay,
        payment_method: paymentMethod
      });

      showNotification(`Payment successful! Thank you.`, 'success');

      if (response.data.is_fully_paid) {
        setTimeout(() => {
          navigate(`/table/${order.table_id}`);
        }, 2000);
      } else {
        fetchOrderDetails();
      }
    } catch (err) {
      console.error(err);
      showNotification('Payment failed. Please try again.', 'error');
    } finally {
      setPaying(false);
    }
  };

  if (loading && !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Order not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-red-600 underline">Go Back</button>
      </div>
    );
  }

  const selectedTotal = calculateSelectedTotal();

  return (
    <div className="max-w-md mx-auto page-container animate-fade-in pb-32">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 cursor-pointer ml-4 mt-4"
      >
        <ArrowLeft size={16} />
        <span className="text-sm">Back to Menu</span>
      </button>

      <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-400"></div>

        <div className="text-center mb-8 mt-2">
          <div className="inline-flex items-center justify-center p-3 bg-red-50 text-red-500 rounded-xl mb-4">
            <Receipt size={24} />
          </div>
          <h2 className="text-[28px] font-black text-[#1A1F2C]">Table {order.table_id} Bill</h2>
          <p className="text-gray-500 mt-1">Select the items you want to pay for.</p>
        </div>

        <div className="bg-[#F8F9FA] rounded-[20px] p-6 mb-8 text-center">
          <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Remaining Total</p>
          <p className="text-4xl font-black text-[#1A1F2C]">${getRemainingTotal().toFixed(2)}</p>
        </div>

        <div className="space-y-3 mb-10">
          {order.items.map(item => {
            const isSelected = selectedItems[item.id] > 0;
            const isDisabled = item.remaining_quantity === 0;

            return (
              <div 
                key={item.id} 
                onClick={() => !isDisabled && toggleItemSelection(item.id, item.remaining_quantity)}
                className={`flex items-center p-4 rounded-[20px] border-2 transition-all cursor-pointer ${
                  isDisabled 
                    ? 'opacity-40 bg-gray-50 border-transparent cursor-not-allowed' 
                    : isSelected 
                      ? 'border-[#FF7F50] bg-white shadow-sm' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="mr-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#FF7F50]' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-3 h-3 bg-[#FF7F50] rounded-full"></div>}
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-[#1A1F2C]">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {isDisabled ? 0 : 1}</p>
                </div>
                <div className="font-bold text-[#1A1F2C] text-lg">
                  ${item.price.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-4">
          <h3 className="text-center font-bold text-[#1A1F2C] mb-4 text-lg">Payment Method</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { id: 'credit_card', icon: CreditCard, label: 'CREDIT CARD' },
              { id: 'meal_card', icon: Wallet, label: 'MEAL CARD' },
              { id: 'cash', icon: Banknote, label: 'CASH' }
            ].map(method => {
              const isActive = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-[20px] transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#FF7F50] text-white shadow-lg shadow-orange-500/30 border-transparent' 
                      : 'bg-white border-2 border-gray-100 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <method.icon size={28} className="mb-2" />
                  <span className="text-[10px] font-bold tracking-wider">{method.label}</span>
                </button>
              );
            })}
          </div>

          {(paymentMethod === 'credit_card' || paymentMethod === 'meal_card') && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-4 p-5 bg-[#F8F9FA] rounded-[24px] border border-gray-100">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Card Number</label>
                <input 
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardDetails.number}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                    setCardDetails({...cardDetails, number: formatted});
                  }}
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#FF7F50]/20 font-mono text-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Expiry Date</label>
                  <input 
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                      if (val.length >= 3) {
                        val = val.substring(0, 2) + '/' + val.substring(2);
                      }
                      setCardDetails({...cardDetails, expiry: val});
                    }}
                    className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#FF7F50]/20 font-mono text-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">CVV</label>
                  <input 
                    type="password"
                    placeholder="***"
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').substring(0, 3);
                      setCardDetails({...cardDetails, cvv: val});
                    }}
                    className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#FF7F50]/20 font-mono text-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-6 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-600">Selected Amount:</p>
            <p className="text-3xl font-black text-[#FF7F50]">${selectedTotal.toFixed(2)}</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={handlePay}
              disabled={paying || selectedTotal === 0}
              className="relative z-20 bg-gray-200 hover:bg-gray-300 text-gray-500 disabled:opacity-50 disabled:hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              style={{
                backgroundColor: selectedTotal > 0 ? '#E9ECEF' : '#F8F9FA',
                color: selectedTotal > 0 ? '#495057' : '#ADB5BD'
              }}
            >
              <CreditCard size={20} />
              Pay Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
