import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Alumni } from '../types';
import { useDatabase } from '../store/database';
import Modal from '../components/Modal';
import AlumniForm from '../components/forms/AlumniForm';

const AlumniPage = () => {
  const { alumni, addAlumni, updateAlumni, deleteAlumni } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    setSelectedAlumni(null);
    setIsModalOpen(true);
  };

  const handleEdit = (alumni: Alumni) => {
    setSelectedAlumni(alumni);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this alumni?')) {
      deleteAlumni(id);
    }
  };

  const handleSubmit = (data: Omit<Alumni, 'id'>) => {
    if (selectedAlumni) {
      updateAlumni(selectedAlumni.id, data);
    } else {
      addAlumni(data);
    }
    setIsModalOpen(false);
  };

  const filteredAlumni = alumni.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.nis.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Alumni</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Alumni
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or NIS..."
            className="pl-10 w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Graduation Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlumni.map((alumni) => (
                <tr key={alumni.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{alumni.nis}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{alumni.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{alumni.graduationYear}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{alumni.occupation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(alumni)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(alumni.id)}
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
        title={selectedAlumni ? 'Edit Alumni' : 'Add New Alumni'}
      >
        <AlumniForm
          onSubmit={handleSubmit}
          initialData={selectedAlumni || undefined}
        />
      </Modal>
    </div>
  );
};

export default AlumniPage;