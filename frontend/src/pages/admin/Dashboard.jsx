import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, Utensils, ClipboardList, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, tablesRes] = await Promise.all([
        axios.get('https://swe314-web-programming-project-production.up.railway.app/admin/dashboard-stats'),
        axios.get('https://swe314-web-programming-project-production.up.railway.app/tables')
      ]);
      setStats(statsRes.data);
      setTables(tablesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const clearTable = async (tableId) => {
    try {
      await axios.put(`https://swe314-web-programming-project-production.up.railway.app/tables/${tableId}/clear`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error clearing table", error);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Live statistics and restaurant status.</p>
        </div>
        <button onClick={fetchData} className="text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 px-4 py-2 rounded-lg transition-colors">
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black">${stats?.total_revenue.toFixed(2)}</h3>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Updating live</span>
          </div>
        </div>

        {/* Occupancy Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Active Tables</p>
              <h3 className="text-3xl font-black">{stats?.active_tables} <span className="text-lg text-gray-400 font-medium">/ {tables.length}</span></h3>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <Utensils className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Total Orders</p>
              <h3 className="text-3xl font-black">{stats?.total_orders}</h3>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tables Status */}
      <div>
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          Restaurant Occupancy
          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">{tables.filter(t => t.is_occupied).length} Active</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <div 
              key={table.id} 
              className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                table.is_occupied 
                  ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30' 
                  : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl font-black text-gray-300 dark:text-gray-600">#{table.number}</span>
                <span className="relative flex h-3 w-3">
                  {table.is_occupied ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  )}
                </span>
              </div>
              
              <div className="mt-4">
                {table.is_occupied ? (
                  <button 
                    onClick={() => clearTable(table.id)}
                    className="w-full py-2 bg-white dark:bg-gray-800 text-red-600 text-sm font-bold rounded-lg border border-red-100 dark:border-red-900/50 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Clear Table
                  </button>
                ) : (
                  <div className="w-full py-2 text-center text-green-600 text-sm font-bold bg-green-50 dark:bg-green-900/20 rounded-lg">
                    Available
                  </div>
                )}
              </div>
            </div>
          ))}
          {tables.length === 0 && (
            <div className="col-span-full text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 font-medium">No tables found. Add tables from the database first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
