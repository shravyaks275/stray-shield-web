"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit2, Trash2, X, Activity,
  Syringe, Stethoscope, AlertCircle, CheckCircle2
} from "lucide-react";

import { useEffect } from "react";
import { initialDogs } from "@/lib/mockData";

export default function HealthRecordsManager() {
  const [dogs, setDogs] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("straydogs_data_v3");
      if (saved) return JSON.parse(saved);
    }
    return initialDogs;
  });

  useEffect(() => {
    localStorage.setItem("straydogs_data_v3", JSON.stringify(dogs));
  }, [dogs]);

  const [selectedDogId, setSelectedDogId] = useState(dogs[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "Vaccination",
    notes: "",
    by: "",
    status: "completed"
  });

  const selectedDog = dogs.find(d => d.id === selectedDogId);
  const filteredDogs = dogs.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getTypeIcon = (type) => {
    switch (type) {
      case "Vaccination": return <Syringe className="w-4 h-4 text-blue-500" />;
      case "Health Check": return <Stethoscope className="w-4 h-4 text-green-500" />;
      case "Treatment": return <Activity className="w-4 h-4 text-orange-500" />;
      case "Sterilization": return <CheckCircle2 className="w-4 h-4 text-purple-500" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
      case "cleared":
        return <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">Completed</span>;
      case "pending":
        return <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs font-bold rounded-full">Pending</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/10 text-gray-500 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  const openAddModal = () => {
    setEditingRecordId(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      type: "Vaccination",
      notes: "",
      by: "",
      status: "completed"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecordId(record.id);
    setFormData({ ...record });
    setIsModalOpen(true);
  };

  const handleDelete = (recordId) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    setDogs(dogs.map(dog => {
      if (dog.id === selectedDogId) {
        return {
          ...dog,
          healthRecords: dog.healthRecords.filter(r => r.id !== recordId)
        };
      }
      return dog;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setDogs(dogs.map(dog => {
      if (dog.id === selectedDogId) {
        if (editingRecordId) {
          // Update
          return {
            ...dog,
            healthRecords: dog.healthRecords.map(r =>
              r.id === editingRecordId ? { ...formData, id: r.id } : r
            )
          };
        } else {
          // Add
          return {
            ...dog,
            healthRecords: [...(dog.healthRecords || []), { ...formData, id: Date.now() }]
          };
        }
      }
      return dog;
    }));

    setIsModalOpen(false);
  };

  const toggleAdoptionStatus = (id) => {
    setDogs(dogs.map(dog => {
      if (dog.id === id) {
        return { ...dog, status: dog.status === "Available" ? "Reviewing" : "Available" };
      }
      return dog;
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar: Dog Selection */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:w-1/3 min-w-[300px] flex flex-col gap-4"
      >
        <div className="bg-secondary/10 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🐶 Select Dog
          </h2>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-background/50 border border-border/50 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredDogs.map(dog => (
              <button
                key={dog.id}
                onClick={() => setSelectedDogId(dog.id)}
                className={`w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 ${selectedDogId === dog.id
                  ? "bg-primary/10 border-primary text-black shadow-sm"
                  : "bg-background/20 border-transparent hover:bg-background/50 text-muted-foreground hover:text-foreground"
                  }`}
              >
                <img
                  src={dog.image}
                  alt={dog.name}
                  className="w-10 h-10 rounded-full object-cover shadow-sm bg-muted"
                />
                <div>
                  <div className="font-bold">{dog.name}</div>
                  <div className="text-xs opacity-70">{dog.breed} • {dog.age}</div>
                </div>
              </button>
            ))}
            {filteredDogs.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">No dogs found.</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content: Health Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1"
      >
        {selectedDog ? (
          <div className="bg-secondary/10 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-lg">
            <div className="flex flex-col md:flex-row md:items-start gap-6 border-b border-border/50 pb-6 mb-8 w-full">
              <img src={selectedDog.image} alt={selectedDog.name} className="w-20 h-20 rounded-full object-cover shadow-md bg-muted shrink-0 mx-auto md:mx-0" />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-black text-foreground mb-1 md:mt-1">
                  {selectedDog.name}'s <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Health History</span>
                </h2>
                <p className="text-muted-foreground font-medium flex justify-center md:justify-start gap-2 text-sm mb-4">
                  <span>{selectedDog.breed}</span> • <span>{selectedDog.age}</span> • <span>{selectedDog.sex}</span>
                </p>
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl w-full max-w-sm mx-auto md:mx-0 flex flex-col gap-3 shadow-sm">
                  <div className="flex justify-between items-center text-sm font-bold text-primary">
                    <span className="flex items-center gap-1.5">🤖 AI Assessment</span>
                    <span className="bg-primary/20 px-2.5 py-0.5 rounded-md text-foreground">{selectedDog.aiHealthCheck?.label || "Pending"}</span>
                  </div>
                  {selectedDog.aiHealthCheck?.confidence && selectedDog.aiHealthCheck.confidence !== "N/A" && (
                    <div className="flex flex-col gap-1.5 w-full mt-1">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span>Analysis Confidence</span>
                        <span>{selectedDog.aiHealthCheck.confidence}</span>
                      </div>
                      <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden border border-border/50">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: selectedDog.aiHealthCheck.confidence }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full" 
                            style={{ 
                                backgroundColor: parseInt(selectedDog.aiHealthCheck.confidence) > 85 ? '#22c55e' : parseInt(selectedDog.aiHealthCheck.confidence) > 60 ? '#eab308' : '#ef4444'
                            }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 flex-shrink-0 rounded-xl font-bold shadow-md transition-transform active:scale-95 whitespace-nowrap mt-4 md:mt-0"
              >
                <Plus className="w-4 h-4" /> Add Record
              </button>
            </div>

            {selectedDog.healthRecords && selectedDog.healthRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs uppercase text-muted-foreground border-b border-border/50">
                      <th className="font-bold py-3 pr-4">Date</th>
                      <th className="font-bold py-3 px-4">Type</th>
                      <th className="font-bold py-3 px-4">Notes</th>
                      <th className="font-bold py-3 px-4">Administrated By</th>
                      <th className="font-bold py-3 px-4 text-center">Status</th>
                      <th className="font-bold py-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {selectedDog.healthRecords.map(record => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="border-b border-border/20 last:border-0 hover:bg-background/20 transition-colors"
                        >
                          <td className="py-4 pr-4 text-sm font-medium whitespace-nowrap">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              {getTypeIcon(record.type)}
                              {record.type}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground max-w-[200px] truncate">
                            {record.notes}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium">
                            {record.by}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {getStatusBadge(record.status)}
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(record)}
                                className="p-2 hover:bg-blue-500/10 text-blue-500 hover:text-blue-400 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(record.id)}
                                className="p-2 hover:bg-red-500/10 text-red-500 hover:text-red-400 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-1">No health records found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">This dog currently has no documented health history. Click 'Add Record' to create one.</p>
              </div>
            )}

            {/* Adoption Status Toggle Button at Bottom */}
            <div className="mt-8 pt-6 border-t border-border/50 flex flex-col items-center sm:items-end w-full">
              <p className="text-xs text-muted-foreground font-bold uppercase mb-2">Publishing Status</p>
              <button
                onClick={() => toggleAdoptionStatus(selectedDog.id)}
                className={`px-8 py-3 rounded-xl font-black text-sm transition-all shadow-md active:scale-95 ${selectedDog.status === "Available" ? "bg-green-500 text-white hover:bg-green-600 ring-4 ring-green-500/20" : "bg-orange-500 text-white hover:bg-orange-600 ring-4 ring-orange-500/20"}`}
              >
                {selectedDog.status === "Available" ? "✅ Up for Adoption (Public)" : "⏳ Not Available (Hidden)"}
              </button>
              <p className="text-xs text-muted-foreground mt-2 max-w-sm text-center sm:text-right">
                Dogs marked as "Up for Adoption" are visible to citizens immediately.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-secondary/10 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-md shadow-lg h-full flex flex-col justify-center">
            <div className="text-6xl mb-4">🩺</div>
            <h3 className="text-xl font-bold mb-2">Select a Dog</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">Please choose a dog from the list on the left to view or manage their health records.</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h3 className="text-xl font-bold">{editingRecordId ? "Edit Record" : "Add New Record"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase flex mb-1">Date</label>
                    <input
                      type="date" required
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase flex mb-1">Record Type</label>
                    <select
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option>Vaccination</option>
                      <option>Health Check</option>
                      <option>Treatment</option>
                      <option>Sterilization</option>
                      <option>Surgery</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase flex mb-1">Administrated By</label>
                    <input
                      type="text" required placeholder="e.g. Dr. Jane (City Vet)"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      value={formData.by} onChange={e => setFormData({ ...formData, by: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase flex mb-1">Status</label>
                    <select
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="completed">Completed</option>
                      <option value="cleared">Cleared</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase flex mb-1">Notes</label>
                    <textarea
                      required placeholder="Add details about the procedure or checkup..." rows="3"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                      value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
