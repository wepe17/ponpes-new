import React, { useEffect, useState } from "react";
import { Plus, Search, Check, X, Trash2, Edit, ArrowRight } from "lucide-react";
import { Payment, Santri } from "../types";
import { useDatabase } from "../store/database";
import Modal from "../components/Modal";
import PaymentForm from "../components/forms/PaymentForm";
import Pagination from "../components/Pagination";
import { usePaymentStore } from "../store/payment";
import { useSantriStore } from "../store/santri";
import { sleep } from "../utils";
import { useToast } from "../hooks/useToast";

const SPPPage = () => {
  const {
    payments,
    addPayment,
    updatePayment,
    deletePayment,
    allPayment,
    pagination: paginationPayment,
  } = usePaymentStore();
  const { santri, allSantri, pagination: paginationSantri } = useSantriStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSantriOpen, setIsModalSantriOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSantriTerm, setSearchSantriTerm] = useState("");
  const [entry, setEntry] = useState<"add" | "update" | "delete">("add");
  const { showToast, ToastComponent } = useToast();

  const handleAdd = () => {
    setEntry("add");
    setSelectedPayment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (payment: Payment) => {
    setEntry("update");
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleDelete = (payment: Payment) => {
    setEntry("delete");
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Omit<Payment, "id">) => {
    data.santri_id = selectedSantri?.id;
    if (selectedPayment) {
      const resp = await updatePayment(selectedPayment.id, data);
      if (resp.statusCode === 200) {
        await allPayment({ ...paginationPayment });
        showToast("SPP berhasil diupdate", "success");
      }
    } else {
      const resp = await addPayment(data);
      console.log("resp", resp);
      if (resp.statusCode === 201) {
        await allPayment({ ...paginationPayment });
        showToast("SPP berhasil ditambahkan", "success");
      }
    }
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    if (selectedPayment) {
      await sleep(1000);
      await deletePayment(selectedPayment.id);
      setIsModalOpen(false);
      showToast("SPP berhasil dihapus", "success");
      await allPayment({ ...paginationPayment });
    }
  };

  const handleSelect = (santri: Santri) => {
    setSelectedSantri(santri);
    setIsModalSantriOpen(false);
  };

  const handleClick = async () => {
    setIsModalSantriOpen(true);
  };

  const filteredPayments = (payments || []).filter((p) =>
    p.santri_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredSantri = (santri || []).filter((p) =>
    p.name.toLowerCase().includes(searchSantriTerm.toLowerCase()),
  );

  useEffect(() => {
    allSantri({});
    allPayment({});
  }, [allSantri, allPayment]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pembayaran SPP</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pembayaran SPP
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan ID Santri..."
            //className="pl-10 w-full p-2 border <boltAction type="file" filePath="src/pages/SPP.tsx">
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
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Santri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
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
              {filteredPayments.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.santri_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rp {item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status === "paid" ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <X className="w-4 h-4 mr-1" />
                      )}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
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
            currentPage={paginationPayment.currentPage}
            totalPages={paginationPayment.totalPages || 1}
            onPageChange={(page) => allPayment({ page })}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          (entry === "delete" && "Hapus Pembayaran") ||
          (entry === "update" && "Edit Pembayaran") ||
          "Tambahkan Pembayaran Baru"
        }
      >
        <PaymentForm
          onSubmit={handleSubmit}
          initialData={selectedPayment || undefined}
          onClick={handleClick}
          selectedSantri={selectedSantri}
        />
      </Modal>

      <Modal
        isOpen={isModalSantriOpen}
        onClose={() => setIsModalSantriOpen(false)}
        title="Pilih Santri"
        isFooter={false}
        onOk={() => setIsModalSantriOpen(false)}
        height="h-full"
        width="w-[900px]"
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau NIS..."
              className="pl-10 w-full p-2 border rounded-md"
              value={searchSantriTerm}
              onChange={(e) => setSearchSantriTerm(e.target.value)}
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
                        onClick={() => handleSelect(s)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <Pagination
              currentPage={paginationSantri.currentPage}
              totalPages={paginationSantri.totalPages || 1}
              onPageChange={(page) => allSantri({ page })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SPPPage;

