import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import {
  Users,
  BookOpen,
  UserCog,
  CreditCard,
  DollarSign,
  Settings,
  LogOut,
  GraduationCap,
  Menu,
  X,
  RepeatIcon,
} from "lucide-react";
import { getLocalStorage } from "../config/local-storage";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const token = getLocalStorage("accessToken");

  if (!token) return null;

  const NavLink = ({
    to,
    icon: Icon,
    children,
  }: {
    to: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <Link
      to={to}
      className="flex items-center p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-gray-900"
      onClick={() => setIsSidebarOpen(false)}
    >
      <Icon className="w-5 h-5 mr-3" />
      {children}
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Pesantren System</h1>
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <NavLink to="/santri" icon={Users}>
            Data Santri
          </NavLink>
          <NavLink to="/asatidz" icon={BookOpen}>
            Data Asatidz
          </NavLink>
          <NavLink to="/pengurus" icon={UserCog}>
            Data Pengurus
          </NavLink>
          <NavLink to="/spp" icon={CreditCard}>
            Pembayaran SPP
          </NavLink>
          <NavLink to="/keuangan" icon={DollarSign}>
            Uang Masuk/Keluar
          </NavLink>
          <NavLink to="/alumni" icon={GraduationCap}>
            Data Alumni
          </NavLink>
          <NavLink to="/pengaturan" icon={Settings}>
            Pengaturan
          </NavLink>
          <NavLink to="/report" icon={RepeatIcon}>
            Report
          </NavLink>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Pesantren System
          </h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="container mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
