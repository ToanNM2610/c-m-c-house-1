"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Loader2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

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

export default function PostDetailPage() {
  const { id } = useParams();
  const { lang, t } = useLanguage();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          const found = data.posts.find((p: Post) => String(p.id) === String(id));
          if (found && (!found.status || found.status === "publish")) {
            setPost(found);
            return;
          }
        }
        
        // Fallback default posts
        const defaultPosts = [
          {
            id: "post-1",
            title: "Một buổi sáng sương mờ bên bờ suối",
            titleEn: "A misty morning by the stream",
            coverImage: "/images/hero.jpg",
            date: "2023-11-12",
            summary: "Những giọt sương mai đọng trên lá, tiếng suối chảy róc rách mang lại cảm giác bình yên đến lạ.",
            content: "Sáng sớm ở Đắk Nông mang một vẻ đẹp rất riêng. Khi lớp sương mờ chưa kịp tan, chúng tôi đã thức dậy để chuẩn bị những mẻ cà phê rang mộc đầu tiên trong ngày. Tiếng chim hót ríu rít bên tai hòa cùng tiếng suối chảy róc rách tạo nên một bản nhạc giao hưởng tuyệt vời của thiên nhiên.\n\nMời bạn ghé thăm Cẩm Cù House, nhấp một ngụm cà phê ấm nóng và cảm nhận hơi thở của núi rừng Tây Nguyên.",
            contentEn: "Early morning in Dak Nong has a very unique beauty. When the morning mist had not yet melted, we woke up to prepare the first batches of rustic roasted coffee of the day. The chirping of birds mixed with the babbling stream creates a wonderful symphony of nature.\n\nCome visit Cam Cu House, take a sip of warm coffee and feel the breath of the Central Highlands mountains and forests.",
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
            content: "Để có được một ly cà phê chuẩn vị, chúng tôi phải đi qua một quá trình dài từ việc chăm sóc cây giống, thu hoạch thủ công cho đến việc rang xay tỉ mỉ.\n\nCà phê mộc không tẩm ướp, giữ trọn vẹn hương vị nguyên bản của đất trời. Khi thưởng thức, bạn sẽ cảm nhận được vị đắng nhẹ, chua thanh và hậu vị ngọt sâu đọng lại nơi cuống họng. Đó chính là tinh túy của vùng đất bazan màu mỡ.",
            contentEn: "To get a standard cup of coffee, we have to go through a long process from caring for seedlings, manual harvesting to meticulous roasting.\n\nRustic coffee without marination, preserving the original flavor of heaven and earth. When enjoying it, you will feel a slight bitterness, mild sourness and a deep sweet aftertaste lingering in your throat. That is the essence of the fertile basalt land.",
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
            content: "Cẩm Cù (Hoya) là loại dây leo với những chùm hoa hình ngôi sao năm cánh, kết thành hình cầu tuyệt đẹp. Tên quán - Cẩm Cù House - cũng bắt nguồn từ niềm yêu thích đặc biệt với loài hoa mộc mạc nhưng đầy sức sống này.\n\nMùa này, những giàn hoa cẩm cù quanh hiên nhà đang thi nhau bung nở, tỏa hương thơm dịu nhẹ, ngọt ngào, thu hút những đàn bướm nhỏ bay lượn, tạo nên một khung cảnh thực sự nên thơ.",
            contentEn: "Hoya is a climbing plant with beautiful five-pointed star-shaped flower clusters, formed into a sphere. The name of the shop - Cam Cu House - also originated from our special love for this rustic but full-of-vitality flower.\n\nThis season, the Hoya flower trellises around the porch are blooming, emitting a gentle, sweet fragrance, attracting small butterflies flying around, creating a truly poetic scene.",
            category: "Chuyện Nhà",
            categoryEn: "Stories",
            author: "admin"
          }
        ];
        
        const fallbackPost = defaultPosts.find(p => String(p.id) === String(id));
        if (fallbackPost) {
          setPost(fallbackPost);
        }
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (isLoading) {
    return (
      <main className="relative min-h-screen bg-transparent text-[#F4EFEA] font-sans z-10 pt-32 pb-32 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C5A880]" size={40} />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="relative min-h-screen bg-transparent text-[#F4EFEA] font-sans z-10 pt-40 pb-32 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif text-[#F4EFEA]/80 mb-6">{t("posts.notFound")}</h1>
        <Link 
          href="/posts" 
          className="inline-flex items-center gap-2 border border-[#C5A880]/40 hover:border-[#C5A880] text-[#C5A880] hover:text-[#F4EFEA] px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          <ArrowLeft size={16} /> {t("posts.backToPosts")}
        </Link>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-transparent text-[#F4EFEA] font-sans z-10 pt-28 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Nút quay lại */}
        <div className="mb-10">
          <Link 
            href="/posts" 
            className="inline-flex items-center gap-2 text-[#C5A880] hover:text-[#F4EFEA] transition-colors font-medium text-xs font-sans tracking-widest uppercase"
          >
            <ArrowLeft size={14} /> {t("posts.backToPosts")}
          </Link>
        </div>

        {/* Header Bài viết */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F4EFEA] mb-6 leading-tight drop-shadow-sm">
            {lang === "en" ? (post.titleEn || post.title) : post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#C5A880]/80 text-xs font-sans font-medium tracking-wider uppercase">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#C5A880]" />
              <span>
                {new Date(post.date).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-[#C5A880]" />
              <span>{post.author || "Admin"}</span>
            </div>
            {post.category && (
              <div className="flex items-center gap-1.5">
                <Tag size={14} className="text-[#C5A880]" />
                <span>{lang === "en" ? (post.categoryEn || post.category) : post.category}</span>
              </div>
            )}
          </div>
        </header>

        {/* Ảnh đại diện */}
        <div className="relative w-full aspect-[21/10] min-h-[300px] mb-16 rounded-3xl overflow-hidden shadow-2xl bg-[#24140C] border border-[#C5A880]/25">
          {post.coverImage && post.coverImage.trim() !== "" ? (
            <Image 
              src={post.coverImage} 
              alt={lang === "en" ? (post.titleEn || post.title) : post.title} 
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              className="object-cover filter brightness-95"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#F4EFEA]/40 text-sm">
              {t("posts.noImage")}
            </div>
          )}
        </div>

        {/* Nội dung bài viết */}
        <article className="prose prose-invert max-w-none prose-lg">
          <div className="whitespace-pre-line leading-relaxed text-[#F4EFEA]/80 text-lg font-light tracking-wide font-sans">
            {lang === "en" ? (post.contentEn || post.content) : post.content}
          </div>
        </article>
      </div>
    </main>
  );
}
