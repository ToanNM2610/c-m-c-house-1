"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import PostImage from "@/components/ui/PostImage";
import { useLanguage } from "@/context/LanguageContext";
import BlurText from "@/components/ui/BlurText";
import CardTilt from "@/components/ui/CardTilt";
import AvatarGroup from "@/components/ui/AvatarGroup";

interface Post {
  id: string;
  title: string;
  titleEn?: string;
  coverImage: string;
  date: string;
  summary: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
  category?: string;
  categoryEn?: string;
  status?: string;
  author?: string;
}

export default function PostsClient({ posts }: { posts: Post[] }) {
  const { lang, t } = useLanguage();

  const safePosts = Array.isArray(posts) && posts.length > 0 ? posts : [
    {
      id: "post-1",
      title: "Một buổi sáng sương mờ bên bờ suối",
      titleEn: "A misty morning by the stream",
      coverImage: "/images/hero.jpg",
      date: "2023-11-12",
      summary: "Những giọt sương mai đọng trên lá, tiếng suối chảy róc rách mang lại cảm giác bình yên đến lạ.",
      summaryEn: "Morning dew drops on the leaves, the babbling stream brings a strangely peaceful feeling.",
      content: "",
      category: "Không Gian",
      categoryEn: "Space",
      author: "admin"
    },
    {
      id: "post-2",
      title: "Hương vị cà phê nguyên bản Đắk Nông",
      titleEn: "The original coffee flavor of Dak Nong",
      coverImage: "/images/hero.jpg",
      date: "2023-12-05",
      summary: "Mỗi hạt cà phê tại Cẩm Cù House đều được tuyển chọn kỹ lưỡng từ những rẫy cà phê sinh thái xanh mướt.",
      summaryEn: "Every coffee bean at Cam Cu House is carefully selected from green ecological coffee farms.",
      content: "",
      category: "Cà Phê",
      categoryEn: "Coffee",
      author: "admin"
    },
    {
      id: "post-3",
      title: "Góc hoa cẩm cù nở rộ mùa này",
      titleEn: "The Hoya flower corner is blooming this season",
      coverImage: "/images/hero.jpg",
      date: "2024-01-20",
      summary: "Hoa cẩm cù - biểu tượng của sự may mắn và sức sống mãnh liệt đã bắt đầu khoe sắc rực rỡ tại góc vườn nhỏ.",
      summaryEn: "Hoya flower - the symbol of luck and strong vitality has begun to bloom brilliantly in the small garden corner.",
      content: "",
      category: "Chuyện Nhà",
      categoryEn: "Stories",
      author: "admin"
    }
  ];

  return (
    <main className="relative min-h-screen bg-transparent text-[#F4EFEA] font-sans z-10 pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <span className="text-[#C5A880] uppercase tracking-[0.25em] text-xs sm:text-sm mb-3 block font-sans">
            {t("posts.subtitle")}
          </span>
          <BlurText 
            text={t("posts.title")}
            as="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F4EFEA]"
          />
          <div className="w-16 h-[1px] bg-[#C5A880]/40 mx-auto mt-6 mb-12"></div>
          
          <div className="flex justify-center">
            <AvatarGroup 
              className="gap-2 p-1.5 bg-[#25150E]/80 border border-[#C5A880]/20 rounded-full"
              items={[
                <span key="all" className="px-4 py-2 rounded-full bg-[#1A0F0A] text-[#C5A880] text-xs font-semibold uppercase tracking-wider border border-[#C5A880]/30 shadow-md block cursor-pointer">Tất cả</span>,
                <span key="space" className="px-4 py-2 rounded-full bg-transparent text-[#F4EFEA]/60 text-xs font-semibold uppercase tracking-wider hover:text-[#F4EFEA] hover:bg-[#1A0F0A]/50 transition-colors block cursor-pointer">Không gian</span>,
                <span key="coffee" className="px-4 py-2 rounded-full bg-transparent text-[#F4EFEA]/60 text-xs font-semibold uppercase tracking-wider hover:text-[#F4EFEA] hover:bg-[#1A0F0A]/50 transition-colors block cursor-pointer">Cà phê</span>,
                <span key="story" className="px-4 py-2 rounded-full bg-transparent text-[#F4EFEA]/60 text-xs font-semibold uppercase tracking-wider hover:text-[#F4EFEA] hover:bg-[#1A0F0A]/50 transition-colors block cursor-pointer">Chuyện nhà</span>
              ]}
            />
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.06, delayChildren: 0.1 }
            }
          }}
        >
          {safePosts.map((post) => (
            <motion.div 
              key={post.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
              }}
            >
              <CardTilt className="h-full block" cardClassName="group flex flex-col bg-[#24140C] rounded-3xl border border-[#C5A880]/25 hover:border-[#C5A880]/70 overflow-hidden transition-all duration-300 shadow-xl h-full">
                <Link 
                  href={`/posts/${post.id}`} 
                  data-cursor-text="Đọc tiếp"
                  className="flex flex-col h-full t-learn cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#180D07]">
                    {post.coverImage && post.coverImage.trim() !== "" ? (
                      <PostImage 
                        src={post.coverImage} 
                        alt={lang === "en" ? (post.titleEn || post.title) : post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#F4EFEA]/40 text-sm font-light">
                        {t("posts.noImage")}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#180D07] via-transparent to-transparent opacity-60 pointer-events-none"></div>
                  </div>
                  <div className="p-8 flex flex-col flex-1 bg-gradient-to-b from-[#24140C] to-[#1C0F08]">
                    <div className="flex items-center gap-2 text-[#C5A880]/80 text-xs font-sans tracking-wider uppercase mb-3">
                      <Calendar size={13} className="text-[#C5A880]" />
                      <span>
                        {new Date(post.date).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif text-[#F4EFEA] mb-3 group-hover:text-[#C5A880] transition-colors line-clamp-2">
                      {lang === "en" ? (post.titleEn || post.title) : post.title}
                    </h3>
                    <p className="text-[#F4EFEA]/70 font-light text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                      {lang === "en" ? (post.summaryEn || post.summary) : post.summary}
                    </p>
                    <div className="flex items-center gap-2 text-[#C5A880] text-xs font-sans font-semibold uppercase tracking-widest group-hover:text-[#F4EFEA] transition-colors mt-auto">
                      <span>{t("posts.readMore")}</span>
                      <span className="t-learn-chevron">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path className="t-learn-arm t-learn-arm-top" d="M6 4L10 8"/>
                          <path className="t-learn-arm t-learn-arm-bot" d="M10 8L6 12"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </CardTilt>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
