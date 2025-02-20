import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Santri } from "../types";
import Modal from "../components/Modal";
import SantriForm from "../components/forms/SantriForm";
import { useSantriStore } from "../store/santri";
import { useToast } from "../hooks/useToast";
import { sleep } from "../utils";
import Pagination from "../components/Pagination";
import { exportToExcel } from "../config/excel";

const SantriPage = () => {
  const {
    santri,
    addSantri,
    updateSantri,
    deleteSantri,
    allSantri,
    success,
    pagination,
  } = useSantriStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast, ToastComponent } = useToast();
  const [entry, setEntry] = useState<"add" | "update" | "delete">("add");
  // const isDelete ;

  const handleAdd = () => {
    setEntry("add");
    setSelectedSantri(null);
    setIsModalOpen(true);
  };

  const handleEdit = (santri: Santri) => {
    setEntry("update");
    setSelectedSantri(santri);

    console.log("update santri", selectedSantri);
    setIsModalOpen(true);
  };

  const handleDelete = (santri: Santri) => {
    setEntry("delete");
    setSelectedSantri(santri);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Omit<Santri, "id">) => {
    if (selectedSantri) {
      const resp = await updateSantri(selectedSantri.id, data);
      if (resp.statusCode === 200) {
        await allSantri({ ...pagination });
        showToast("Santri berhasil diupdate", "success");
      }
    } else {
      const resp = await addSantri(data);
      console.log("resp", resp);
      if (resp.statusCode === 201) {
        await allSantri({ ...pagination });
        showToast("Santri berhasil ditambahkan", "success");
      }
    }

    setIsModalOpen(false);
  };

  const filteredSantri = (santri || []).filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm),
  );

  const handleOk = async () => {
    if (selectedSantri) {
      await sleep(1000);
      await deleteSantri(selectedSantri.id);
      setIsModalOpen(false);
      showToast("Santri berhasil dihapus", "success");
      await allSantri({ ...pagination });
    }
  };

  const exportExcel = () => {
    const data = santri.map((s) => ({
      NIS: s.nis,
      Name: s.name,
      Class: s.class,
      Status: s.status,
    }));
    exportToExcel(data, "data-santri.xlsx");
  };

  useEffect(() => {
    allSantri({});
  }, [allSantri]);

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Santri</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Santri Baru
          </button>
          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Export Excel
          </button>
        </div>
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
                  Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSantri.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{s.nis}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        s.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s)}
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
            onPageChange={(page) => allSantri({ page })}
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
          <SantriForm
            onSubmit={handleSubmit}
            initialData={selectedSantri || undefined}
          />
        )}
        {entry === "delete" && (
          <div className="">
            Apakah kamu yakin menghapus data santri <b>{selectedSantri?.name}</b>{" "}
            ?{" "}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SantriPage;
