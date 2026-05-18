import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingBag, ArrowRight, Zap, Shield, Sparkles } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col gap-20 py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold animate-pulse">
            <Sparkles className="w-4 h-4" /> New Season Collection Just Landed
          </div>
          <h1 className="text-7xl font-black text-gray-900 leading-[1.1]">
            Elevate Your <span className="text-blue-600">Lifestyle</span> with SwiftShop
          </h1>
          <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
            Experience the future of e-commerce. Fast, secure, and curated products from top sellers around the world.
          </p>
          <div className="flex gap-4">
            <Link to="/products" className="px-8 py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-blue-500/20">
              Shop Now <ArrowRight className="w-6 h-6" />
            </Link>
            <Link to="/auth" className="px-8 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95">
              Start Selling
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-8 left-8 p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border border-white/50 max-w-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <span className="font-bold text-gray-900">Popular Choice</span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">"The best shopping experience I've had in years. SwiftShop is a game-changer!"</p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<Zap className="w-8 h-8" />} 
            title="Instant Delivery" 
            desc="Our advanced logistics network ensures your products reach you in record time." 
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8" />} 
            title="Secure Payments" 
            desc="Multi-layered encryption powered by Stripe keeps your data safe and private." 
          />
          <FeatureCard 
            icon={<ShoppingBag className="w-8 h-8" />} 
            title="Curated Quality" 
            desc="Every product is vetted for quality and authenticity before listing." 
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
