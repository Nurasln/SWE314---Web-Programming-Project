import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Printer, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const QRDashboard = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const getBaseUrl = () => {
    return window.location.origin;
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/tables`);
      setTables(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Could not load tables from the server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-600 dark:text-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <p className="font-semibold">Loading QR dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto page-container animate-fade-in pb-10">
      <div className="print:hidden flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span className="font-medium text-sm">Back to Home</span>
        </button>

        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchTables}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
          
          <button 
            onClick={handlePrint}
            className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            <Printer size={18} />
            <span>Print QR Codes</span>
          </button>
        </div>
      </div>

      <div className="text-center mb-10 print:mb-4">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
          Restaurant QR Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 print:hidden">
          Your customers can scan these QR codes to directly view the menu.
        </p>
      </div>

      {tables.length === 0 ? (
        <div className="text-center bg-white dark:bg-gray-800 rounded-3xl p-10 shadow border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No tables found. Please create tables from the admin panel first.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 print:grid-cols-3 print:gap-4 flex-wrap">
          {tables.map(table => {
            const tableUrl = `${getBaseUrl()}/table/${table.id}`;

            return (
              <div 
                key={table.id} 
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center print:shadow-none print:border-gray-300 print:break-inside-avoid print:bg-white print:text-black"
              >
                <h3 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 print:text-black mb-4">
                  TABLE {table.number}
                </h3>
                
                <div className="bg-white p-3 rounded-2xl border-4 border-gray-900 mb-4 print:border-8">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(tableUrl)}`} 
                    alt={`QR Code for Table ${table.number}`} 
                    width="150" 
                    height="150" 
                  />
                </div>
                
                <div className="text-center mt-2 print:hidden w-full overflow-hidden">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-1">
                    Quick Access Link
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-400 truncate w-full border border-gray-100 dark:border-gray-800">
                    {tableUrl}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QRDashboard;