import React, { useEffect, useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { Transaction } from "../types";
import Modal from "../components/Modal";
import TransactionForm from "../components/forms/TransactionForm";
import { useTransactionStore } from "../store/transaction";
import { useToast } from "../hooks/useToast";
import Pagination from "../components/Pagination";
import { sleep } from "../utils";

const KeuanganPage = () => {
  const {
    transaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    allTransaction,
    pagination,
  } = useTransactionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast, ToastComponent } = useToast();
  const [entry, setEntry] = useState<"add" | "update" | "delete">("add");

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
        showToast("Transaction updated successfully", "success");
      }
    } else {
      const resp = await addTransaction(data);
      console.log("resp", resp);
      if (resp.statusCode === 201) {
        await allTransaction({ ...pagination });
        showToast("Transaction added successfully", "success");
      }
    }

    setIsModalOpen(false);
  };

  const filteredTransactions = (transaction || []).filter(
    (t) =>
      t?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t?.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalIncome = (transaction || [])
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = (transaction || [])
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleOk = async () => {
    if (selectedTransaction) {
      await sleep(1000);
      await deleteTransaction(selectedTransaction.id);
      setIsModalOpen(false);
      showToast("Transaction deleted successfully", "success");
      await allTransaction({ ...pagination });
    }
  };

  useEffect(() => {
    allTransaction({});
  }, [allTransaction]);

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Keuangan</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Total Income
              </h3>
              <p className="text-2xl font-bold text-green-600">
                Rp {totalIncome.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-red-500 mr-4" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Total Expense
              </h3>
              <p className="text-2xl font-bold text-red-600">
                Rp {totalExpense.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by description or category..."
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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                      Rp {transaction.amount.toLocaleString()}
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
                      onClick={() => handleDelete(transaction.id)}
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
            Are you sure you want to delete transaction{" "}
            <b>{selectedTransaction?.amount}</b> ?{" "}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KeuanganPage;

