import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Users, Receipt, ArrowLeft } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [billData, setBillData] = useState(null);
  const [numPeople, setNumPeople] = useState(1);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchBillInfo(numPeople);
  }, [numPeople, orderId]);

  const fetchBillInfo = async (people) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${orderId}/split-bill?num_people=${people}`);
      setBillData(response.data);
    } catch (err) {
      console.error(err);
      showNotification('Could not fetch bill total. Please check if items were added.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSplitChange = (n) => {
    setNumPeople(n);
  };

  const handlePayment = () => {
    if (!billData) return;

    if (numPeople > 1) {
      const paid = billData.amount_per_person.toFixed(2);
      const remaining = (billData.total_amount - billData.amount_per_person).toFixed(2);
      showNotification(`$${paid} paid. Please select a payment method for the remaining $${remaining}.`, 'warning');
    } else {
      showNotification('Payment completed successfully.', 'success');
      // Optionally redirect or clear order
      setTimeout(() => navigate('/'), 2000);
    }
  };

  if (!billData && loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!billData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No bill data available.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-red-600 underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto page-container animate-fade-in relative pb-10">
      
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 cursor-pointer pointer-events-auto"
      >
        <ArrowLeft size={16} />
        <span className="font-medium text-sm">Back to Menu</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-red-900/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/60 relative overflow-hidden">
        
        {/* Top styling element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-400"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full mb-4">
            <Receipt size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Checkout</h2>
          <p className="text-gray-500 text-sm mt-1">Order #{orderId}</p>
        </div>

        <div className="space-y-6">
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl flex justify-between items-center border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Total Amount</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                ${billData.total_amount.toFixed(2)}
              </h3>
            </div>
            <Users size={32} className="text-gray-300 dark:text-gray-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-1">
              <span>Split Bill</span>
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => handleSplitChange(num)}
                  disabled={loading}
                  className={`
                    py-3 rounded-xl font-bold transition-all border
                    ${numPeople === num 
                      ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-600/30' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {num === 1 ? 'None' : `x${num}`}
                </button>
              ))}
            </div>
          </div>

          {numPeople > 1 && (
            <div className="animate-fade-in bg-orange-50 dark:bg-orange-900/20 p-5 rounded-2xl border border-orange-100 dark:border-orange-800/50 flex justify-between items-center text-orange-900 dark:text-orange-100">
               <div>
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-80">Per Person</p>
                  <p className="text-2xl font-black mt-1">${billData.amount_per_person.toFixed(2)}</p>
               </div>
               <div className="bg-orange-200 dark:bg-orange-800/50 px-3 py-1 rounded-lg text-sm font-bold opacity-80">
                  {numPeople} ways
               </div>
            </div>
          )}

          <button 
            onClick={handlePayment}
            className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold text-lg flex justify-center items-center space-x-2 relative overflow-hidden group"
          >
            <CreditCard size={20} className="z-10" />
            <span className="z-10">Pay Now</span>
            <div className="absolute inset-0 bg-gray-800 dark:bg-gray-200 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
