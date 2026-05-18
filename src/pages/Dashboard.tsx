import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Product, Order } from "../types";
import { Plus, Package, DollarSign, TrendingUp, Trash2, Edit3, Truck, CheckCircle, Clock } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { motion } from "motion/react";

export function Dashboard() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {profile.role === 'seller' ? <SellerDashboard /> : <BuyerDashboard />}
    </div>
  );
}

function SellerDashboard() {
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Product State
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    imageUrl: `https://picsum.photos/seed/${Math.random()}/400/400`,
    stock: 10
  });

  useEffect(() => {
    if (!profile) return;
    const fetchData = async () => {
      const pQuery = query(collection(db, "products"), where("sellerId", "==", profile.id));
      const oQuery = query(collection(db, "orders"), where("sellerId", "==", profile.id));
      
      const [pSnap, oSnap] = await Promise.all([getDocs(pQuery), getDocs(oQuery)]);
      
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setOrders(oSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    };
    fetchData();
  }, [profile]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...newProduct,
        sellerId: profile.id,
        createdAt: new Date().toISOString()
      });
      setProducts([...products, { ...newProduct, id: docRef.id, sellerId: profile.id, createdAt: new Date().toISOString() } as Product]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status, updatedAt: new Date().toISOString() });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500">Manage your store and fulfill orders</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Revenue" value={formatCurrency(totalSales)} icon={<DollarSign className="w-6 h-6 text-green-600" />} color="bg-green-50" />
        <StatsCard title="Active Products" value={products.length.toString()} icon={<Package className="w-6 h-6 text-blue-600" />} color="bg-blue-50" />
        <StatsCard title="Total Orders" value={orders.length.toString()} icon={<TrendingUp className="w-6 h-6 text-purple-600" />} color="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Management */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Package className="w-6 h-6" /> Your Products
          </h2>
          <div className="space-y-4">
            {products.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{p.name}</h4>
                  <p className="text-sm text-gray-500">{p.category} • {formatCurrency(p.price)}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600"><Edit3 className="w-5 h-5" /></button>
                  <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Fulfillment */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Truck className="w-6 h-6" /> Recent Orders
          </h2>
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Order #{o.id.slice(-6)}</p>
                    <p className="font-bold text-gray-900">{formatCurrency(o.totalAmount)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {o.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  {o.status === 'paid' && (
                    <button 
                      onClick={() => updateOrderStatus(o.id, 'shipped')}
                      className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700"
                    >
                      Ship Order
                    </button>
                  )}
                  {o.status === 'shipped' && (
                    <button 
                      onClick={() => updateOrderStatus(o.id, 'delivered')}
                      className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">Listed New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-600 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                  <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <input type="text" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea required rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-600" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all mt-4">
                Launch Product
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function BuyerDashboard() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const fetchOrders = async () => {
      const q = query(collection(db, "orders"), where("buyerId", "==", profile.id));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(o => ({ id: o.id, ...o.data() } as Order)));
      setLoading(false);
    };
    fetchOrders();
  }, [profile]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Your Orders</h1>
        <p className="text-gray-500">Track and manage your purchases</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.length > 0 ? orders.map(o => (
          <div key={o.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="flex -space-x-4">
              {o.items.slice(0, 3).map((item, i) => (
                <img 
                  key={i} 
                  src={item.imageUrl} 
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg" 
                  alt={item.name} 
                />
              ))}
              {o.items.length > 3 && (
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold border-4 border-white shadow-lg">
                  +{o.items.length - 3}
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                Order {o.items.length} Item{o.items.length > 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-500">Placed on {new Date(o.createdAt).toLocaleDateString()}</p>
              <p className="text-xl font-black text-blue-600 mt-2">{formatCurrency(o.totalAmount)}</p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3 min-w-[200px]">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                o.status === 'delivered' ? 'bg-green-50 text-green-700' :
                o.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                'bg-yellow-50 text-yellow-700'
              }`}>
                {o.status === 'delivered' ? <CheckCircle className="w-4 h-4" /> : 
                 o.status === 'shipped' ? <Truck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                {o.status.toUpperCase()}
              </div>
              <button className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
                View Details
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your history here</p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold">Explore Catalog</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className={`p-6 rounded-3xl ${color} border border-white flex items-center justify-between shadow-sm`}>
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
      <div className="p-3 bg-white rounded-2xl shadow-sm">
        {icon}
      </div>
    </div>
  );
}
