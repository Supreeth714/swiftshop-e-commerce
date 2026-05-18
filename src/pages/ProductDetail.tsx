import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Product } from "../types";
import { formatCurrency } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() } as Product);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">Loading...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition-colors font-medium">
        <ArrowLeft className="w-5 h-5" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[2.5rem] overflow-hidden bg-gray-100 aspect-square">
          <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">{product.category}</span>
          <h1 className="text-5xl font-black text-gray-900 mb-6">{product.name}</h1>
          <p className="text-3xl font-black text-gray-900 mb-8">{formatCurrency(product.price)}</p>
          
          <div className="prose prose-blue mb-10">
            <p className="text-gray-500 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="flex gap-4 mb-12">
            <button 
              onClick={() => addItem({ ...product, productId: product.id, quantity: 1 })}
              className="flex-1 bg-gray-900 text-white rounded-2xl py-5 font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <ShoppingCart className="w-6 h-6" /> Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-gray-100 pt-8">
            <Feature icon={<ShieldCheck />} text="Secure Payment" />
            <Feature icon={<Truck />} text="Fast Delivery" />
            <Feature icon={<RefreshCw />} text="30-Day Returns" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <div className="text-blue-600">{icon}</div>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{text}</span>
    </div>
  );
}
