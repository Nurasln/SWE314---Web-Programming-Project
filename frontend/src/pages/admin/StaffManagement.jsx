import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, UserCog, ShieldCheck, ChefHat } from 'lucide-react';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'waiter', pin: '' });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://swe314-web-programming-project-production.up.railway.app/staff');
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://swe314-web-programming-project-production.up.railway.app/staff', newStaff);
      setNewStaff({ name: '', role: 'waiter', pin: '' });
      setShowForm(false);
      fetchStaff();
    } catch (error) {
      console.error("Error adding staff", error);
      alert("Failed to add staff");
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await axios.delete(`https://swe314-web-programming-project-production.up.railway.app/staff/${id}`);
        fetchStaff();
      } catch (error) {
        console.error("Error deleting staff", error);
      }
    }
  };

  const roleIcons = {
    manager: <ShieldCheck className="w-5 h-5 text-purple-500" />,
    waiter: <UserCog className="w-5 h-5 text-blue-500" />,
    chef: <ChefHat className="w-5 h-5 text-orange-500" />
  };

  const roleColors = {
    manager: 'bg-purple-50 text-purple-700 border-purple-200',
    waiter: 'bg-blue-50 text-blue-700 border-blue-200',
    chef: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Staff Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your restaurant team and access pins.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
        >
          <Plus className={`w-5 h-5 transition-transform ${showForm ? 'rotate-45' : ''}`} />
          {showForm ? 'Cancel' : 'Add Staff'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4">Add New Team Member</h2>
          <form onSubmit={handleAddStaff} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
              <input
                required
                type="text"
                value={newStaff.name}
                onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
              <select
                value={newStaff.role}
                onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="waiter">Waiter</option>
                <option value="manager">Manager</option>
                <option value="chef">Chef</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Access PIN (4 digits)</label>
              <input
                required
                type="text"
                maxLength="4"
                pattern="\d{4}"
                value={newStaff.pin}
                onChange={e => setNewStaff({ ...newStaff, pin: e.target.value.replace(/\D/g, '') })}
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-center tracking-widest"
                placeholder="1234"
              />
            </div>
            <div className="md:col-span-1">
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white p-2.5 rounded-lg font-bold transition-colors"
              >
                Save Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        ) : staff.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 font-medium">No staff members found.</p>
          </div>
        ) : (
          staff.map((member) => (
            <div key={member.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative group flex flex-col">
              <button 
                onClick={() => handleDeleteStaff(member.id)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Remove Staff"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl border ${roleColors[member.role] || roleColors.waiter}`}>
                  {roleIcons[member.role] || roleIcons.waiter}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
                <span className="text-gray-500">PIN Code</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded tracking-widest font-bold">
                  {member.pin}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
