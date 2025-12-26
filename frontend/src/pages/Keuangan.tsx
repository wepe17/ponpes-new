import React, { useEffect, useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Search,
  Edit,
  Trash2,
  Wallet,
  Download,
} from "lucide-react";
import { Settings, Transaction } from "../types";
import Modal from "../components/Modal";
import TransactionForm from "../components/forms/TransactionForm";
import { useTransactionStore } from "../store/transaction";
import { useToast } from "../hooks/useToast";
import Pagination from "../components/Pagination";
import { formatToIDR, sleep } from "../utils";
import { useSettingStore } from "../store/setting";
import { exportToExcel } from "../config/excel";
import { all } from "axios";

type KasPayload = Pick<Settings, "kas_amount" | "kas_date" | "kas_description">;

const KeuanganPage = () => {
  const {
    transaction,
    allTrxData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    allTransaction,
    fetchTransactionAll,
    pagination,
  } = useTransactionStore();
  const { updateKasSetting, allSetting, setting } = useSettingStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalKasOpen, setIsModalKasOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast, ToastComponent } = useToast();
  const [entry, setEntry] = useState<"add" | "update" | "delete">("add");
  const [kasPayload, setKasPayload] = useState<KasPayload>({
    kas_amount: 0,
    kas_date: "",
    kas_description: "",
  });

  const handleAdd = () => {
    setEntry("add");
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEntry("update");
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setEntry("delete");
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Omit<Transaction, "id">) => {
    if (selectedTransaction) {
      const resp = await updateTransaction(selectedTransaction.id, data);
      if (resp.statusCode === 200) {
        await allTransaction({ ...pagination });
        showToast("Transaksi berhasil diupdate", "success");
      }
    } else {
      const resp = await addTransaction(data);
      console.log("resp", resp);
      if (resp.statusCode === 201) {
        await allTransaction({ ...pagination });
        showToast("Transaksi berhasil ditambahkan", "success");
      }
    }

    allSetting({});
    setIsModalOpen(false);
  };

  const filteredTransactions = (transaction || []).filter(
    (t) =>
      t?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t?.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const { totalIncome, totalExpense } = (allTrxData || []).reduce(
    (totals, t) => {
      if (t.type === "income") {
        totals.totalIncome += Number(t.amount);
      } else if (t.type === "expense") {
        totals.totalExpense += Number(t.amount);
      }
      return totals;
    },
    { totalIncome: 0, totalExpense: 0 },
  );

  const formattedIncome = formatToIDR(totalIncome);
  const formattedExpense = formatToIDR(totalExpense);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof KasPayload,
  ) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    const numericValue = rawValue ? Number(rawValue) : null;

    setKasPayload((prev) => ({ ...prev, [field]: numericValue }));
  };

  const handleOk = async () => {
    if (selectedTransaction) {
      await sleep(100);
      await deleteTransaction(selectedTransaction.id);
      setIsModalOpen(false);
      showToast("Transaksi berhasil dihapus", "success");
      await allTransaction({ ...pagination });
      await allSetting({});
    }
  };

  const onUpdateKas = async () => {
    await updateKasSetting(kasPayload);
  };

  const exportExcel = () => {
    const data = transaction.map((s: Transaction) => ({
      Date: s.date,
      Type: s.type,
      Category: s.category,
      Amount: s.amount,
      Description: s.description,
    }));
    exportToExcel(data, "data-keuangan.xlsx");
  };

  useEffect(() => {
    allTransaction({});
    allSetting({});
    fetchTransactionAll();
  }, [allTransaction, allSetting]);

  useEffect(() => {
    if (setting) {
      setKasPayload(setting);
    }
  }, [setting]);

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Keuangan</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Transaction
          </button>
          <button
            onClick={() => setIsModalKasOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambahkan KAS
          </button>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambahkan Transaksi
          </button>
        </div>
      </div>

      <div className="space-y-6 my-6">
        <div className="bg-white rounded-lg shadow-md p-6 w-full">
          <div className="flex items-center">
            <Wallet className="w-8 h-8 text-blue-500 mr-4" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Saldo KAS</h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatToIDR(Number(setting?.kas_amount) || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Two column cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Pendapatan
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {formattedIncome}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingDown className="w-8 h-8 text-red-500 mr-4" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Pengeluaran
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {formattedExpense}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan deskripsi atau kategori..."
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
                  Tipe Transaksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {formatToIDR(Number(transaction.amount))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction)}
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
            onPageChange={(page) => allTransaction({ page })}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalKasOpen}
        onClose={() => setIsModalKasOpen(false)}
        title="Tambah KAS baru"
        isFooter={true}
        onOk={onUpdateKas}
      >
        <label className="block text-sm font-medium text-gray-700">
          Jumlah
        </label>
        <input
          type="text"
          className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          value={
            kasPayload.kas_amount !== null
              ? formatToIDR(kasPayload.kas_amount)
              : ""
          }
          onChange={(e) => handleInputChange(e, "kas_amount")}
        />
        <label className="block text-sm font-medium text-gray-700">
          Tanggal
        </label>
        <input
          type="date"
          className="mt-1 block w-full h-10 p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          value={kasPayload.kas_date || ""}
          onChange={(e) =>
            setKasPayload({ ...kasPayload, kas_date: e.target.value })
          }
        />
        <label className="block text-sm font-medium text-gray-700">
          Deskripsi
        </label>
        <textarea
          rows={4}
          className="mt-1 block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          value={kasPayload.kas_description || ""}
          onChange={(e) =>
            setKasPayload({ ...kasPayload, kas_description: e.target.value })
          }
        />
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          (entry === "delete" && "Delete Transaction") ||
          (entry === "update" && "Edit Transaction") ||
          "Add New Transaction"
        }
        onOk={handleOk}
        isFooter={entry === "delete"}
      >
        {["add", "update"].includes(entry) && (
          <TransactionForm
            onSubmit={handleSubmit}
            initialData={selectedTransaction || undefined}
          />
        )}
        {entry === "delete" && (
          <div className="">
            Apakah kamu yakin menghapus transaksi{" "}
            <b>{selectedTransaction?.amount}</b> ?{" "}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KeuanganPage;
