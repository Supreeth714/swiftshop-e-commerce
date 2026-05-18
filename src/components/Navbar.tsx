import { ShoppingCart, User, LogOut, Store, History, Settings, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { motion } from "motion/react";

export function Navbar() {
  const { profile, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
          <Store className="w-8 h-8 text-blue-600" />
          SwiftShop
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Catalog</Link>
          
          <Link to="/cart" className="relative group">
            <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          {profile ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                {profile.photoURL ? (
                  <img src={profile.photoURL} className="w-8 h-8 rounded-full border border-gray-200" alt="Avatar" />
                ) : (
                  <User className="w-8 h-8 p-1 bg-gray-100 rounded-full" />
                )}
                <span className="font-medium hidden sm:block">{profile.displayName}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
