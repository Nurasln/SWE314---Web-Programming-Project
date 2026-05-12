import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const QRDashboard = () => {
  const navigate = useNavigate();
  const [customBaseUrl, setCustomBaseUrl] = React.useState(
    import.meta.env.VITE_FRONTEND_URL || window.location.origin
  );
  const [isAutoDetected, setIsAutoDetected] = React.useState(false);

  const [tables, setTables] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/tables`);
        setTables(res.data);
      } catch (err) {
        console.error("Failed to fetch tables:", err);
      }
    };
    
    const detectIp = async () => {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        try {
          const res = await axios.get(`${API_URL}/system/info`);
          if (res.data.preferred_ip && res.data.preferred_ip !== 'localhost') {
            const autoUrl = `http://${res.data.preferred_ip}:5173`;
            setCustomBaseUrl(autoUrl);
            setIsAutoDetected(true);
          }
        } catch (err) {
          console.error("Failed to auto-detect IP:", err);
        }
      }
    };

    fetchData();
    detectIp();
  }, []);

  const handlePrint = () => {
    window.print();
  };

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
        <p className="text-gray-500 dark:text-gray-400 print:hidden mb-6">
          Your customers can scan these QR codes to directly view the menu.
        </p>

        {/* URL Configuration for Local Network */}
        <div className="max-w-md mx-auto bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 print:hidden mb-8">
          <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
            Base URL for QR Codes (Local IP)
          </label>
          <div className="flex gap-2 relative">
            <input 
              type="text" 
              value={customBaseUrl} 
              onChange={(e) => {
                setCustomBaseUrl(e.target.value);
                setIsAutoDetected(false);
              }}
              className="flex-1 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="http://192.168.x.x:5173"
            />
            {isAutoDetected && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                AUTO-DETECTED
              </span>
            )}
            <button 
              onClick={() => {
                setCustomBaseUrl(window.location.origin);
                setIsAutoDetected(false);
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Reset
            </button>
          </div>
          <p className="text-[10px] text-blue-500 mt-2 text-left italic">
            * To test on your phone, use your computer's local IP address (e.g. 192.168.x.x) instead of 'localhost'.
          </p>
        </div>
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
            const tableUrl = `${customBaseUrl}/table/${table.id}`;

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