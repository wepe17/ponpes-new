import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Asatidz } from '../types';
import { useDatabase } from '../store/database';
import Modal from '../components/Modal';
import AsatidzForm from '../components/forms/AsatidzForm';

const AsatidzPage = () => {
  const { asatidz, addAsatidz, updateAsatidz, deleteAsatidz } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsatidz, setSelectedAsatidz] = useState<Asatidz | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    setSelectedAsatidz(null);
    setIsModalOpen(true);
  };

  const handleEdit = (asatidz: Asatidz) => {
    setSelectedAsatidz(asatidz);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this asatidz?')) {
      deleteAsatidz(id);
    }
  };

  const handleSubmit = (data: Omit<Asatidz, 'id'>) => {
    if (selectedAsatidz) {
      updateAsatidz(selectedAsatidz.id, data);
    } else {
      addAsatidz(data);
    }
    setIsModalOpen(false);
  };

  const filteredAsatidz = asatidz.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.nip.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Asatidz</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Asatidz
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or NIP..."
            className="pl-10 w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAsatidz.map((a) => (
                <tr key={a.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{a.nip}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{a.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{a.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      a.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(a)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAsatidz ? 'Edit Asatidz' : 'Add New Asatidz'}
      >
        <AsatidzForm
          onSubmit={handleSubmit}
          initialData={selectedAsatidz || undefined}
        />
      </Modal>
    </div>
  );
};

export default AsatidzPage;