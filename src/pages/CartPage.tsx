import React from "react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/utils";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

export function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!profile) {
      navigate("/auth");
    } else {
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs text-center">It looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/products"
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          Browse Catalog <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-12">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <motion.div 
              key={item.productId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm"
            >
              <img src={item.imageUrl} className="w-24 h-24 rounded-2xl object-cover" alt={item.name} />
              
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                <p className="text-blue-600 font-bold">{formatCurrency(item.price)}</p>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-2xl text-gray-200">
                <button 
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="p-1 hover:bg-white rounded-lg transition-colors text-gray-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-gray-900 px-2">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="p-1 hover:bg-white rounded-lg transition-colors text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => removeItem(item.productId)}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 sticky top-28">
            <h2 className="text-2xl font-bold mb-8">Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Subtotal</span>
                <span className="text-white">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Shipping</span>
                <span className="text-white">Free</span>
              </div>
              <div className="h-px bg-white/10 my-4" />
              <div className="flex justify-between text-xl font-black">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight className="w-6 h-6" />
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 text-gray-400 opacity-50">
              <div className="w-8 h-8 rounded bg-white/20" />
              <div className="w-8 h-8 rounded bg-white/20" />
              <div className="w-8 h-8 rounded bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
