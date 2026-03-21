import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Receipt, ArrowLeft, CheckCircle2, Circle, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const TableBill = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [billItems, setBillItems] = useState([]);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const { showNotification } = useNotification();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showCardModal, setShowCardModal] = useState(false);
  const [showCashConfirmModal, setShowCashConfirmModal] = useState(false);

  useEffect(() => {
    fetchBill();
  }, [tableId]);

  const fetchBill = async () => {
    try {
      setLoading(true);
<<<<<<< Updated upstream
      const res = await axios.get(`http://${window.location.hostname}:8000/tables/${tableId}/bill`);
=======
<<<<<<< HEAD
      const res = await axios.get(`/api/tables/${tableId}/bill`);
=======
      const res = await axios.get(`http://${window.location.hostname}:8000/tables/${tableId}/bill`);
>>>>>>> fc23f1b2b2de1913e8741bd8e5206652ecf1659b
>>>>>>> Stashed changes
      setBillItems(res.data.items);
      setTotalUnpaid(res.data.total_unpaid);
      setSelectedItems([]);
    } catch (err) {
      console.error(err);
      showNotification('Could not fetch table bill.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (orderItemId) => {
    if (selectedItems.includes(orderItemId)) {
      setSelectedItems(selectedItems.filter(id => id !== orderItemId));
    } else {
      setSelectedItems([...selectedItems, orderItemId]);
    }
  };

  const selectedTotal = billItems
    .filter(item => selectedItems.includes(item.order_item_id))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInitiatePay = () => {
    if (selectedItems.length === 0) return;
    if (paymentMethod === 'cash') {
      setShowCashConfirmModal(true);
    } else {
      setShowCardModal(true);
    }
  };

  const executeCashPayment = () => {
    setShowCashConfirmModal(false);
    executePayment('cash');
  };

  const executePayment = async (method) => {
    try {
      setPaying(true);
<<<<<<< Updated upstream
      await axios.post(`http://${window.location.hostname}:8000/tables/${tableId}/pay`, {
=======
<<<<<<< HEAD
      await axios.post(`/api/tables/${tableId}/pay`, {
=======
      await axios.post(`http://${window.location.hostname}:8000/tables/${tableId}/pay`, {
>>>>>>> fc23f1b2b2de1913e8741bd8e5206652ecf1659b
>>>>>>> Stashed changes
        order_item_ids: selectedItems,
        method: method
      });
      if (method === 'cash') {
        showNotification('Cash payment request received. You can pay at the register when leaving.', 'info');
      } else {
        showNotification('Payment successful! Thank you.', 'success');
      }
      fetchBill(); 
    } catch (err) {
      console.error(err);
      showNotification('Failed to process payment.', 'error');
    } finally {
      setPaying(false);
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    setShowCardModal(false);
    executePayment(paymentMethod);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto page-container animate-fade-in relative pb-10">
      <button 
        onClick={() => navigate(`/table/${tableId}`)} 
        className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 cursor-pointer pointer-events-auto"
      >
        <ArrowLeft size={16} />
        <span className="font-medium text-sm">Back to Menu</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-red-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/60 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-400"></div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full mb-4">
            <Receipt size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Table {tableId} Bill</h2>
          <p className="text-gray-500 text-sm mt-1">Select the items you want to pay for.</p>
        </div>

        {billItems.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">Everything is paid!</h3>
            <p className="text-sm text-gray-400">There is no pending bill for this table.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl flex justify-between items-center border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Remaining Total</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  ${totalUnpaid.toFixed(2)}
                </h3>
              </div>
            </div>

            <div className="space-y-2 mt-4 max-h-64 overflow-y-auto pr-2">
              {billItems.map(item => (
                <div 
                  key={item.order_item_id} 
                  onClick={() => toggleSelection(item.order_item_id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedItems.includes(item.order_item_id) 
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-500/50 text-orange-900 dark:text-orange-100' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700/50 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {selectedItems.includes(item.order_item_id) ? (
                      <CheckCircle2 className="text-orange-500" size={24} />
                    ) : (
                      <Circle className="text-gray-300 dark:text-gray-600" size={24} />
                    )}
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs opacity-70">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-extrabold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">Payment Method</p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-1 rounded-xl font-bold flex flex-col items-center justify-center border transition-all ${paymentMethod === 'card' ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}
                  >
                    <span className="text-xl mb-1">💳</span><span className="text-[10px] uppercase tracking-wider">Credit Card</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('sodexo')}
                    className={`py-3 px-1 rounded-xl font-bold flex flex-col items-center justify-center border transition-all ${paymentMethod === 'sodexo' ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}
                  >
                    <span className="text-xl mb-1">🍲</span><span className="text-[10px] uppercase tracking-wider">Meal Card</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-3 px-1 rounded-xl font-bold flex flex-col items-center justify-center border transition-all ${paymentMethod === 'cash' ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}
                  >
                    <span className="text-xl mb-1">💵</span><span className="text-[10px] uppercase tracking-wider">Cash</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-600 dark:text-gray-400">Selected Amount:</span>
                <span className="text-2xl font-black text-orange-500">${selectedTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleInitiatePay}
                disabled={selectedItems.length === 0 || paying}
<<<<<<< Updated upstream
                className={`w-full py-4 rounded-full shadow-lg transition-all font-bold text-lg flex justify-center items-center space-x-2 relative hidden-overflow group ${
=======
<<<<<<< HEAD
                className={`w-full py-4 rounded-full shadow-lg transition-all font-bold text-lg flex justify-center items-center space-x-2 relative overflow-hidden group ${
=======
                className={`w-full py-4 rounded-full shadow-lg transition-all font-bold text-lg flex justify-center items-center space-x-2 relative hidden-overflow group ${
>>>>>>> fc23f1b2b2de1913e8741bd8e5206652ecf1659b
>>>>>>> Stashed changes
                  selectedItems.length === 0 || paying 
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed opacity-70' 
                    : 'bg-black dark:bg-white text-white dark:text-black hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
                }`}
              >
                <CreditCard size={20} className="z-10" />
                <span className="z-10">{paying ? 'Processing...' : 'Pay Selected'}</span>
                {selectedItems.length > 0 && !paying && (
                  <div className="absolute inset-0 bg-gray-800 dark:bg-gray-200 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Card Detail Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowCardModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {paymentMethod === 'sodexo' ? 'Meal Card Details' : 'Credit Card Details'}
            </h3>
            
            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                <input defaultValue="4543 1234 5678 9012" type="text" placeholder="0000 0000 0000 0000" maxLength="19" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry (MM/YY)</label>
                  <input defaultValue="12/28" type="text" placeholder="12/25" maxLength="5" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CVV</label>
                  <input defaultValue="123" type="text" placeholder="123" maxLength="3" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={paying} className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
                  {paying ? 'Paying...' : `Pay $${selectedTotal.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cash Confirm Modal */}
      {showCashConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center">
            <button 
              onClick={() => setShowCashConfirmModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <div className="mx-auto flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full mb-4 w-16 h-16">
              <span className="text-3xl">💵</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Confirm Cash Payment</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              The selected items (${selectedTotal.toFixed(2)}) will be marked for cash payment. Please pay at the register when leaving. Do you confirm?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCashConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-xl font-bold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeCashPayment}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TableBill;
