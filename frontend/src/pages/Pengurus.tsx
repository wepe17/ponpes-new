import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { User } from "../types";
import { useDatabase } from "../store/database";
import Modal from "../components/Modal";
import UserForm from "../components/forms/UserForm";
import { useAuthStore } from "../store/auth";
import { useToast } from "../hooks/useToast";
import { sleep } from "../utils";
import Pagination from "../components/Pagination";
import { exportToExcel } from "../config/excel";

const PengurusPage = () => {
  const { users, addUser, allUsers, updateUser, deleteUser, pagination } =
    useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast, ToastComponent } = useToast();
  const [entry, setEntry] = useState<"add" | "update" | "delete">("add");

  const handleAdd = () => {
    setEntry("add");
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEntry("update");
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (data: User) => {
    setEntry("delete");
    setSelectedUser(data);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Omit<User, "id">) => {
    if (selectedUser) {
      const resp = await updateUser(selectedUser.id, data);
      console.log("resp halo", resp);
      if (resp.statusCode === 200) {
        await allUsers({ ...pagination });
        showToast("User updated successfully", "success");
      } else if (resp.statusCode === 401) {
        showToast("Unauthorized access", "error");
      } else {
        showToast("Failed to update user", "error");
      }
    } else {
      const resp = await addUser(data);
      console.log("resp", resp);
      if (resp.statusCode === 201) {
        await allUsers({ ...pagination });
        showToast("User added successfully", "success");
        setIsModalOpen(false);
      } else if (resp.statusCode === 401) {
        showToast("Unauthorized access", "error");
      } else {
        showToast("Failed to update user", "error");
      }
    }
  };

  const filteredUsers = (users || []).filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOk = async () => {
    if (selectedUser) {
      await sleep(1000);
      await deleteUser(selectedUser.id);
      setIsModalOpen(false);
      showToast("Santri deleted successfully", "success");
      await allUsers({ ...pagination });
    }
  };

  const exportExcel = () => {
    const data = users.map((s) => ({
      Username: s.username,
      Name: s.name,
      Position: s.role,
    }));
    exportToExcel(data, "data-pengurus.xlsx");
  };

  useEffect(() => {
    allUsers({});
  }, [allUsers]);

  return (
    <div>
      <ToastComponent />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Pengurus</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Pengurus
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
            placeholder="Search by name or username..."
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
                  Nama Lengkap
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jabatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
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
            onPageChange={(page) => allUsers({ page })}
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
          <UserForm
            onSubmit={handleSubmit}
            initialData={selectedUser || undefined}
          />
        )}

        {entry === "delete" && (
          <div className="">
            Are you sure you want to delete user <b>{selectedUser?.name}</b> ?{" "}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PengurusPage;
