import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Alumni } from "../types";
import Modal from "../components/Modal";
import AlumniForm from "../components/forms/AlumniForm";
import { useAlumniStore } from "../store/alumni";
import { sleep } from "../utils";
import { useToast } from "../hooks/useToast";
import Pagination from "../components/Pagination";

const AlumniPage = () => {
  const {
    alumni,
    addAlumni,
    updateAlumni,
    deleteAlumni,
    allAlumni,
    pagination,
  } = useAlumniStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast, ToastComponent } = useToast();
  const [entry, setEntry] = useState<"add" | "update" | "delete">("add");

  const handleAdd = () => {
    setEntry("add");
    setSelectedAlumni(null);
    setIsModalOpen(true);
  };

  const handleEdit = (alumni: Alumni) => {
    setEntry("update");
    setSelectedAlumni(alumni);
    setIsModalOpen(true);
  };

  const handleDelete = (alumni: Alumni) => {
    setEntry("delete");
    setSelectedAlumni(alumni);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Omit<Alumni, "id">) => {
    if (selectedAlumni) {
      const resp = await updateAlumni(selectedAlumni.id, data);
      if (resp.statusCode === 200) {
        await allAlumni({ ...pagination });
        showToast("Alumni berhasil diupdate", "success");
      }
    } else {
      const resp = await addAlumni(data);
      console.log("resp", resp);
      if (resp.statusCode === 201) {
        await allAlumni({ ...pagination });
        showToast("Alumni berhasil ditambahkan", "success");
      }
    }

    setIsModalOpen(false);
  };

  const filteredAlumni = alumni.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nis.includes(searchTerm),
  );

  const handleOk = async () => {
    if (selectedAlumni) {
      await sleep(1000);
      await deleteAlumni(selectedAlumni.id);
      setIsModalOpen(false);
      showToast("Alumni berhasil dihapus", "success");
      await allAlumni({ ...pagination });
    }
  };

  useEffect(() => {
    allAlumni({});
  }, [allAlumni]);

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Alumni</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Alumni Baru
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau NIS..."
            className="pl-10 w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Lengkap
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lulus Tahun
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pekerjaan Saat Ini
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlumni.map((alumni) => (
                <tr key={alumni.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{alumni.nis}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{alumni.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alumni.graduation_year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alumni.occupation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(alumni)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(alumni)}
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
        <div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages || 1}
            onPageChange={(page) => allAlumni({ page })}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          (entry === "delete" && "Delete Santri") ||
          (entry === "update" && "Edit Santri") ||
          "Add New Santri"
        }
        onOk={handleOk}
        isFooter={entry === "delete"}
      >
        {["add", "update"].includes(entry) && (
          <AlumniForm
            onSubmit={handleSubmit}
            initialData={selectedAlumni || undefined}
          />
        )}
        {entry === "delete" && (
          <div className="">
            Apakah kamu yakin hapus santri <b>{selectedAlumni?.name}</b>{" "}
            ?{" "}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AlumniPage;

