// src/pages/CentersManagement.jsx
import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, MapPin, Building2, Trash2, X, Filter } from 'lucide-react';

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
    { id: 1, name: "Kristellar Pune Main Center ", state: "Maharashtra", district: "Pune" },
    { id: 2, name: "Kristellar Bangalore Koramangala", state: "Karnataka", district: "Bangalore" },
    { id: 3, name: "Kristellar Andheri West", state: "Maharashtra", district: "Mumbai" },
    { id: 4, name: "Kristellar Connaught Place", state: "Delhi", district: "New Delhi" },
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
    <div className="min-h-screen bg-gray-50">

      {/* Blue Header - same as FacultiesManagement */}
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button onClick={() => window.history.back()} className="text-white hover:bg-white/10 p-2 rounded-lg transition cursor-pointer">
                <ArrowLeft className="w-8 h-8" />
              </button>
              <div>
                <h1 className="text-3xl font-semibold">Centers Management</h1>
                <p className="mt-2 text-blue-100">Manage your training centers across India</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                <p className="text-3xl font-bold text-gray-800">{centers.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total Centers</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-8 py-4 bg-white text-[#1e40af] rounded-md hover:bg-gray-50 font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Add New Center
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search - same style */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search center name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition"
              />
            </div>

            <select
              value={filterState}
              onChange={e => { setFilterState(e.target.value); setFilterDistrict(""); }}
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition cursor-pointer"
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
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] disabled:bg-gray-100 focus:border-[#1e40af] transition cursor-pointer"
            >
              <option value="">All Districts</option>
              {filterState && indianStatesAndDistricts[filterState]?.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>

            <button
              onClick={() => { setSearchTerm(""); setFilterState(""); setFilterDistrict(""); }}
              className="bg-[#1e40af] text-white px-6 py-3 rounded-md hover:bg-[#1e3a8a] transition flex items-center justify-center gap-2 font-medium cursor-pointer hover:shadow-lg hover:scale-105"
            >
              <Filter className="w-4 h-4" /> Clear Filters
            </button>
          </div>
        </div>

        {/* Centers Grid - same card style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCenters.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No centers found</p>
            </div>
          ) : (
            filteredCenters.map(center => (
              <div
                key={center.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition group"
              >
                {/* <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-4xl font-bold opacity-30">
                      {center.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded">
                    ACTIVE
                  </span>
                </div> */}

                <div className="p-5 flex flex-col h-full justify-between">
  {/* Top section: Name + Location */}
  <div>
    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
      {center.name}
    </h3>

    <div className="flex items-center gap-2 text-sm text-gray-600 mt-3 min-h-[1.75rem]">
      <MapPin className="w-4 h-4 flex-shrink-0" />
      <span className="truncate">
        {center.district}, {center.state}
      </span>
    </div>
  </div>

  {/* Bottom section: Delete button (always aligned at bottom) */}
  <div className="mt-6 flex justify-end">
    <button
      onClick={() => deleteCenter(center.id)}
      className="text-red-600 hover:bg-red-50 p-2 rounded-md transition opacity-0 group-hover:opacity-100 transition-opacity"
      title="Delete center"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  </div>
</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Center Modal - same style as FacultiesManagement modals */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Center</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Center Name</label>
                <input
                  type="text"
                  value={centerName}
                  onChange={e => setCenterName(e.target.value)}
                  placeholder="e.g. Kristellar Thane Branch"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <select
                  value={selectedState}
                  onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(""); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af]"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] disabled:bg-gray-100"
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
                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCenter}
                className="px-8 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] font-semibold shadow-md hover:shadow-lg transition"
              >
                Add Center
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CentersManagement;