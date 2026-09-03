"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "@/hooks/useMenu";
import { Search, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import BlurText from "@/components/ui/BlurText";

const BEST_SELLERS = [
  "Cà phê kem trứng", "Egg Cream Coffee",
  "Cà phê muối", "Salted Coffee",
  "Trà đào cam sả", "Peach Orange Lemongrass Tea",
  "Bơ sầu riêng", "Sinh tố Bơ sầu riêng", "Avocado Durian Smoothie"
];

const CATEGORY_MAP_EN: Record<string, string> = {
  "CÀ PHÊ": "COFFEE",
  "TRÀ": "TEA",
  "SINH TỐ": "SMOOTHIES",
  "NƯỚC ÉP": "FRESH JUICE",
  "SODA / SỮA CHUA": "SODA & YOGURT",
  "KHÁC": "OTHERS",
  "MÓN ĂN": "FOOD & SNACKS",
};

export default function MenuPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { menu } = useMenu();
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lấy danh sách category gốc (raw)
  const rawCategories = useMemo(() => {
    const set = new Set<string>();
    menu.forEach(item => {
      if (item.category) set.add(item.category);
    });
    return ["all", ...Array.from(set)];
  }, [menu]);

  // Group menu items theo category đã localize
  const filteredMenu = useMemo(() => {
    let filtered: Record<string, any[]> = {};

    menu.forEach(item => {
      const matchesTab = activeTab === "all" || item.category === activeTab;
      if (!matchesTab) return;

      const itemName = lang === "en" ? (item.nameEn || item.name) : item.name;
      const itemDesc = item.desc || "";
      const matchesSearch = !searchQuery.trim() || 
        itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        itemDesc.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return;

      const displayCategory = lang === "en" 
        ? (item.categoryEn || CATEGORY_MAP_EN[item.category] || item.category) 
        : item.category;

      if (!filtered[displayCategory]) {
        filtered[displayCategory] = [];
      }
      filtered[displayCategory].push(item);
    });

    return filtered;
  }, [menu, activeTab, searchQuery, lang]);

  const getCategoryLabel = (rawCat: string) => {
    if (rawCat === "all") return t("menu.all");
    return lang === "en" ? (CATEGORY_MAP_EN[rawCat] || rawCat) : rawCat;
  };

  return (
    <main className="relative min-h-screen bg-transparent text-[#F4EFEA] font-sans z-10 pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-center mb-16">
          <span className="text-[#C5A880] uppercase tracking-[0.25em] text-xs sm:text-sm mb-3 block font-sans">
            {t("menu.subtitle")}
          </span>
          <BlurText 
            text={t("menu.title")}
            as="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F4EFEA]"
          />
          <div className="w-16 h-[1px] bg-[#C5A880]/40 mx-auto mt-6"></div>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          style={{ willChange: "opacity, transform" }}
          className="max-w-xl mx-auto mb-10 relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A880]/70" size={20} />
          <input 
            type="text" 
            placeholder={t("menu.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#25150E] border border-[#C5A880]/30 text-[#F4EFEA] pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#F4EFEA]/40 shadow-lg"
          />
        </motion.div>

        {/* Filter Tabs */}
        {isMounted && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
            style={{ willChange: "opacity, transform" }}
            className="flex flex-wrap justify-center gap-2.5 mb-20"
          >
            {rawCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeTab === cat 
                    ? "bg-[#C5A880] text-[#1A0F0A] shadow-md" 
                    : "bg-[#22130B] border border-[#C5A880]/25 text-[#F4EFEA]/70 hover:text-[#F4EFEA] hover:border-[#C5A880]/60"
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </motion.div>
        )}

        {isMounted ? (
          <div className="space-y-24">
            {Object.keys(filteredMenu).length === 0 ? (
              <div className="text-center py-20 text-[#F4EFEA]/50">
                <p className="text-xl">{t("menu.noResults")}</p>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveTab("all"); }} 
                  className="mt-4 text-[#C5A880] hover:text-[#F4EFEA] underline underline-offset-4 cursor-pointer"
                >
                  {t("menu.clearFilter")}
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {Object.entries(filteredMenu).map(([category, items]) => (
                  <motion.div 
                    key={category}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <h3 className="text-2xl md:text-3xl font-serif text-[#F4EFEA] mb-10 border-l-4 border-[#C5A880] pl-4 flex items-center gap-3">
                      <span>{category}</span>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-[#C5A880]/30 to-transparent"></div>
                    </h3>
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10"
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: { staggerChildren: 0.04 }
                        }
                      }}
                    >
                      {items.map((item) => {
                        const isBestSeller = BEST_SELLERS.includes(item.name) || BEST_SELLERS.includes(item.nameEn);
                        const displayName = lang === "en" ? (item.nameEn || item.name) : item.name;
                        return (
                          <motion.div 
                            key={item.id} 
                            variants={{
                              hidden: { opacity: 0, y: 15 },
                              show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
                            }}
                            className={`group cursor-default flex justify-between items-baseline border-b border-[#C5A880]/15 pb-4 transition-all duration-300 ${item.inStock ? 'hover:border-[#C5A880]/60' : 'opacity-40 grayscale pointer-events-none'}`}
                          >
                            <div className="pr-4 flex-1">
                              <h4 className="text-lg font-serif text-[#F4EFEA]/90 group-hover:text-[#C5A880] transition-colors flex items-center gap-2 flex-wrap">
                                {displayName}
                                {isBestSeller && item.inStock && (
                                  <span className="inline-flex items-center gap-1 text-[9px] uppercase bg-[#C5A880]/15 text-[#C5A880] px-2 py-0.5 rounded-full border border-[#C5A880]/40 font-sans font-semibold tracking-wider">
                                    <Star size={9} fill="currentColor" /> {t("menu.bestSeller")}
                                  </span>
                                )}
                                {!item.inStock && (
                                  <span className="text-[9px] uppercase bg-[#25150E] text-[#F4EFEA]/50 px-2 py-0.5 rounded-full font-sans">
                                    {t("menu.outOfStock")}
                                  </span>
                                )}
                              </h4>
                              {item.desc && <p className="text-[#F4EFEA]/60 font-light text-xs mt-1.5 line-clamp-2">{item.desc}</p>}
                            </div>
                            <span className="text-[#C5A880] font-sans font-medium whitespace-nowrap ml-4 text-sm">{item.price}</span>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
