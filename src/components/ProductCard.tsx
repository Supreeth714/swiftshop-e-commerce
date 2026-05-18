import { Product } from "../types";
import { formatCurrency } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{product.category}</span>
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h3>
          </div>
          <p className="font-bold text-lg text-gray-900">{formatCurrency(product.price)}</p>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>
        
        <div className="flex gap-2">
          <button 
            onClick={() => addItem({ ...product, productId: product.id, quantity: 1 })}
            className="flex-1 bg-gray-900 text-white text-sm font-semibold py-2 px-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <Link 
            to={`/product/${product.id}`}
            className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
