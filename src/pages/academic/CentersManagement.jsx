// src/pages/CentersManagement.jsx
import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, MapPin, Building2, Trash2, X } from 'lucide-react';

const indianStatesAndDistricts = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Solapur"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida", "Ghaziabad"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"]
};

const CentersManagement = () => {
  const [centers, setCenters] = useState([
    { id: 1, name: "CodeKart Pune Main Center", state: "Maharashtra", district: "Pune" },
    { id: 2, name: "CodeKart Bangalore Koramangala", state: "Karnataka", district: "Bangalore" },
    { id: 3, name: "CodeKart Andheri West", state: "Maharashtra", district: "Mumbai" },
    { id: 4, name: "CodeKart Connaught Place", state: "Delhi", district: "New Delhi" },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [centerName, setCenterName] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const availableDistricts = selectedState ? indianStatesAndDistricts[selectedState] || [] : [];

  const handleAddCenter = () => {
    if (!centerName.trim() || !selectedState || !selectedDistrict) return;

    setCenters([...centers, {
      id: Date.now(),
      name: centerName,
      state: selectedState,
      district: selectedDistrict
    }]);

    // Reset & close
    setCenterName("");
    setSelectedState("");
    setSelectedDistrict("");
    setIsAddModalOpen(false);
  };

  const deleteCenter = (id) => {
    if (window.confirm("Are you sure you want to delete this center?")) {
      setCenters(centers.filter(c => c.id !== id));
    }
  };

  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !filterState || center.state === filterState;
    const matchesDistrict = !filterDistrict || center.district === filterDistrict;
    return matchesSearch && matchesState && matchesDistrict;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="px-8 py-5 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                All Centers
              </h1>
              <p className="text-sm text-gray-500">Manage your training centers across India</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{centers.length}</p>
              <p className="text-sm text-gray-600">Total Centers</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Center
            </button>
          </div>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="px-8 py-6 max-w-[1600px] mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search center name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <select
              value={filterState}
              onChange={e => {
                setFilterState(e.target.value);
                setFilterDistrict("");
              }}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">All States</option>
              {Object.keys(indianStatesAndDistricts).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select
              value={filterDistrict}
              onChange={e => setFilterDistrict(e.target.value)}
              disabled={!filterState}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50"
            >
              <option value="">All Districts</option>
              {filterState && indianStatesAndDistricts[filterState]?.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setFilterState("");
                setFilterDistrict("");
              }}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Centers Grid */}
      <div className="px-8 pb-12 max-w-[1600px] mx-auto">
        {filteredCenters.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No centers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCenters.map(center => (
              <div
                key={center.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {center.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <button
                    onClick={() => deleteCenter(center.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-3">{center.name}</h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{center.district}, {center.state}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    ACTIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Center Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Center</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Center Name</label>
              <input
                type="text"
                value={centerName}
                onChange={e => setCenterName(e.target.value)}
                placeholder="e.g. CodeKart Thane Branch"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <select
                  value={selectedState}
                  onChange={e => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select State</option>
                  {Object.keys(indianStatesAndDistricts).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">District / City</label>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50"
                >
                  <option value="">Select District</option>
                  {availableDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCenter}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg hover:scale-105 transition-all"
              >
                Add Center
              </button>
            </div>
          </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CentersManagement;