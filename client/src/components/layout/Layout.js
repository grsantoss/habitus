import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-700 text-white' : 'text-gray-300 hover:bg-primary-600 hover:text-white';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-primary-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white font-bold text-xl">Habitus Profecia</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard')}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/spreadsheets"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/spreadsheets')}`}
                  >
                    Planilhas
                  </Link>
                  <Link
                    to="/scenarios"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/scenarios')}`}
                  >
                    Cenários
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <span className="text-white mr-4">{user?.name}</span>
                    <button
                      onClick={handleLogout}
                      className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;