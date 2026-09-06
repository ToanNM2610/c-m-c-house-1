"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "@/hooks/useMenu";
import { Search, Star, Sparkles, Coffee } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import BlurText from "@/components/ui/BlurText";
import CardTilt from "@/components/ui/CardTilt";
import TabsSliding from "@/components/ui/TabsSliding";
import LiquidDistortImage from "@/components/ui/LiquidDistortImage";

const Menu3DScene = dynamic(() => import("@/components/3d/Menu3DScene"), {
  ssr: false,
});

interface FeaturedItem {
  name: string;
  nameEn: string;
  price: string;
  desc: string;
  descEn: string;
  image: string;
  tag: string;
  tagEn: string;
}

const FEATURED_SIGNATURES: FeaturedItem[] = [
  {
    name: "Cà phê kem trứng",
    nameEn: "Egg Cream Coffee",
    price: "30.000đ",
    desc: "Lớp kem trứng đánh bông béo ngậy phủ lên cốt cà phê Robusta Đắk Nông rang củi đậm đà.",
    descEn: "Rich whipped egg cream poured over intense firewood-roasted Dak Nong Robusta.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    tag: "Chữ ký nhà Cẩm Cù",
    tagEn: "Cam Cu Signature",
  },
  {
    name: "Cà phê muối",
    nameEn: "Salted Coffee",
    price: "28.000đ",
    desc: "Vị muối biển dịu nhẹ hòa quyện cùng cốt dừa và sữa đặc, tôn vinh hậu vị sâu của cà phê.",
    descEn: "Subtle sea salt cream blended with condensed milk, enhancing the coffee's deep finish.",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop",
    tag: "Được yêu thích nhất",
    tagEn: "Most Loved",
  },
  {
    name: "Trà đào cam sả",
    nameEn: "Peach Orange Lemongrass Tea",
    price: "30.000đ",
    desc: "Hương sả thảo mộc vườn nhà kết hợp vị cam mọng nước và miếng đào giòn ngọt thanh mát.",
    descEn: "Garden-grown fresh lemongrass with juicy sun-ripened orange and crispy sweet peach.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop",
    tag: "Thanh mát giải nhiệt",
    tagEn: "Refreshing Tonic",
  },
  {
    name: "Sinh tố Bơ sầu riêng",
    nameEn: "Avocado Durian Smoothie",
    price: "33.000đ",
    desc: "Sự kết hợp hoàng gia giữa bơ sáp Đắk Nông béo dẻo và cơm sầu riêng Ri6 thơm nồng nàn.",
    descEn: "Royal blend of Dak Nong butter avocado and aromatic Ri6 durian pulp.",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop",
    tag: "Đặc sản cao nguyên",
    tagEn: "Highland Specialty",
  },
];

const BEST_SELLERS_NAMES = [
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
  const { lang, t, formatPrice } = useLanguage();
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
      {/* 3D WebGL Background: Golden Aroma & Coffee Crystal Fog */}
      <Menu3DScene />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header Title */}
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

        {/* 3D Parallax Signature & Best Seller Showcase with Liquid Distortion */}
        {activeTab === "all" && !searchQuery.trim() && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#C5A880]" />
                <h2 className="text-2xl sm:text-3xl font-serif text-[#F4EFEA] tracking-wide">
                  {lang === "en" ? "Signatures & Best Sellers" : "Bộ Sưu Tập Tiêu Biểu"}
                </h2>
              </div>
              <span className="text-xs tracking-widest text-[#C5A880] uppercase font-sans border-b border-[#C5A880]/30 pb-1">
                {lang === "en" ? "Interactive Water Distortion" : "Chạm lướt gợn sóng"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_SIGNATURES.map((feat, idx) => (
                <motion.div
                  key={feat.name}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.76, 0, 0.24, 1] }}
                >
                  <CardTilt 
                    className="h-full w-full"
                    cardClassName="h-full rounded-2xl bg-[#25150E]/60 backdrop-blur-md border border-[#C5A880]/25 overflow-hidden hover:border-[#C5A880]/80 transition-all duration-500 shadow-2xl flex flex-col group"
                  >
                    {/* Liquid Distortion Image Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1A0F0A]">
                      <LiquidDistortImage
                        src={feat.image}
                        alt={feat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-sans font-semibold bg-[#1A0F0A]/85 backdrop-blur-md text-[#C5A880] px-3 py-1 rounded-full border border-[#C5A880]/40 shadow-lg">
                          <Star size={10} fill="currentColor" />
                          {lang === "en" ? feat.tagEn : feat.tag}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 z-20">
                        <span className="font-serif text-sm font-semibold text-[#1A0F0A] bg-[#C5A880] px-3 py-1 rounded-full shadow-lg">
                          {formatPrice(feat.price)}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-serif text-[#F4EFEA] group-hover:text-[#C5A880] transition-colors">
                          {lang === "en" ? feat.nameEn : feat.name}
                        </h3>
                        <p className="text-xs text-[#F4EFEA]/65 font-light mt-2 leading-relaxed line-clamp-3">
                          {lang === "en" ? feat.descEn : feat.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#C5A880]/15 flex items-center justify-between text-[11px] text-[#C5A880]/80">
                        <span className="flex items-center gap-1">
                          <Coffee size={12} /> {lang === "en" ? "Handcrafted" : "Pha thủ công"}
                        </span>
                        <span className="uppercase tracking-wider font-mono text-[9px] text-[#F4EFEA]/40">
                          CAMCU-SIGNATURE
                        </span>
                      </div>
                    </div>
                  </CardTilt>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-xl mx-auto mb-10 relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A880]/70" size={20} />
          <input 
            type="text" 
            placeholder={t("menu.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#25150E]/80 backdrop-blur-md border border-[#C5A880]/30 text-[#F4EFEA] pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#F4EFEA]/40 shadow-lg"
          />
        </motion.div>

        {/* Filter Tabs */}
        {isMounted && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
            className="flex justify-center mb-20"
          >
            <TabsSliding 
              tabs={rawCategories.map(cat => ({ id: cat, label: getCategoryLabel(cat) }))}
              activeTab={activeTab}
              onChange={setActiveTab}
              className="bg-[#25150E]/70 backdrop-blur-md border border-[#C5A880]/25 p-1.5 rounded-full [--tabs-pill-bg:#C5A880] [--tabs-bar-bg:transparent] shadow-xl"
              tabClassName="px-4 py-2 sm:px-6 sm:py-2.5 text-[10px] sm:text-xs tracking-widest uppercase font-sans whitespace-nowrap !text-[#F4EFEA]/70 hover:!text-[#C5A880] transition-colors [&.active]:!text-[#1A0F0A] [&.active]:font-semibold"
            />
          </motion.div>
        )}

        {/* Menu Items with Deep Darkness Reveal on Scroll */}
        {isMounted ? (
          <div className="space-y-28">
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
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="relative"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-2 h-8 bg-gradient-to-b from-[#C5A880] to-[#8C6D46] rounded-full"></div>
                      <h3 className="text-2xl md:text-3xl font-serif text-[#F4EFEA] tracking-wide">
                        {category}
                      </h3>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-[#C5A880]/40 via-[#C5A880]/15 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
                      {items.map((item) => {
                        const isBestSeller = BEST_SELLERS_NAMES.includes(item.name) || BEST_SELLERS_NAMES.includes(item.nameEn);
                        const displayName = lang === "en" ? (item.nameEn || item.name) : item.name;
                        return (
                          <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <CardTilt 
                              className="h-full w-full block" 
                              cardClassName={`p-5 rounded-2xl bg-[#25150E]/50 backdrop-blur-sm border border-[#C5A880]/20 transition-all duration-300 shadow-lg ${item.inStock ? 'hover:border-[#C5A880]/70 hover:bg-[#25150E]/80 hover:shadow-xl' : 'opacity-40 grayscale pointer-events-none'}`}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <h4 className="text-lg font-serif text-[#F4EFEA] flex items-center gap-2 flex-wrap">
                                    {displayName}
                                    {isBestSeller && item.inStock && (
                                      <span 
                                        className="inline-flex items-center gap-1 text-[9px] uppercase bg-[#C5A880]/20 px-2.5 py-0.5 rounded-full border border-[#C5A880]/50 font-sans font-semibold tracking-wider text-[#C5A880]"
                                      >
                                        <Star size={9} fill="currentColor" /> {t("menu.bestSeller")}
                                      </span>
                                    )}
                                    {!item.inStock && (
                                      <span className="text-[9px] uppercase bg-[#25150E] text-[#F4EFEA]/50 px-2 py-0.5 rounded-full font-sans">
                                        {t("menu.outOfStock")}
                                      </span>
                                    )}
                                  </h4>
                                  {item.desc && (
                                    <p className="text-[#F4EFEA]/65 font-light text-xs mt-2 line-clamp-2 leading-relaxed">
                                      {item.desc}
                                    </p>
                                  )}
                                </div>
                                <span className="text-[#C5A880] font-sans font-medium whitespace-nowrap text-sm bg-[#1A0F0A]/90 px-3 py-1 rounded-full border border-[#C5A880]/30 shadow-inner">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            </CardTilt>
                          </motion.div>
                        );
                      })}
                    </div>
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
