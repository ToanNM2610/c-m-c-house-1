"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Flower2,
  Droplets,
  Coffee,
  Sparkles,
  Trees,
  Leaf,
  Flame,
  Heart,
  Users,
  ArrowRight,
  MapPin,
  PhoneCall,
  Navigation,
  CheckCircle2
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#F9F8F3] dark:bg-[#121A15] min-h-screen text-[#1B281D] dark:text-[#F5F4EE] font-sans selection:bg-[#3E5C46] selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="pt-20">
        {/* Top Narrative Intro */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 w-full text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/80 dark:bg-[#1E2B22] border border-stone-300/60 dark:border-stone-700/60 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3E5C46] dark:bg-emerald-400 animate-pulse" />
              <span className="text-xs text-[#3E5C46] dark:text-[#88B795] uppercase tracking-widest font-bold">
                Tâm Tình Từ Cao Nguyên
              </span>
              <span className="text-stone-400 dark:text-stone-600">•</span>
              <span className="text-xs text-stone-600 dark:text-stone-300 font-semibold">Gia Nghĩa • Đắk Nông</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold tracking-tight max-w-3xl mb-4 leading-tight">
              Câu Chuyện Cẩm Cù <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#7D5E4A] dark:text-[#D1A684] text-2xl sm:text-4xl lg:text-5xl block mt-2">
                Chốn Bình Yên Giữa Đất Ngàn
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed mt-2">
              Khởi nguồn từ tình yêu với thiên nhiên Gia Nghĩa và khát khao gìn giữ một khoảng xanh trong trẻo cho lữ khách ghé chân, buông bỏ muộn phiền để hòa nhịp cùng suối ngàn.
            </p>

            {/* Coordinates & Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8 text-xs font-semibold text-[#7D5E4A] dark:text-stone-200">
              <span className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-full shadow-sm">
                <Flower2 className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
                Loài hoa Hoya bền bỉ
              </span>
              <span className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-full shadow-sm">
                <Droplets className="w-4 h-4 text-[#396663] dark:text-teal-400" />
                Suối nguồn tự nhiên 100%
              </span>
              <span className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1E2B22] border border-stone-200/80 dark:border-stone-700/60 rounded-full shadow-sm">
                <Coffee className="w-4 h-4 text-[#7D5E4A] dark:text-amber-400" />
                Robusta rang củi mộc
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 1: Hành Trình Khởi Sinh */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Text Column */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#3E5C46] dark:text-[#88B795] uppercase tracking-wider">
                  Khối 01
                </span>
                <span className="w-8 h-[2px] bg-[#3E5C46]/30 dark:bg-[#88B795]/30" />
                <span className="text-xs text-stone-500 dark:text-stone-400">Sự Kỳ Diệu Của Tự Nhiên</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold leading-tight">
                Loài Hoa Bền Bỉ &amp; Mối Duyên Lành Bên Dòng Suối
              </h2>

              <div className="space-y-4 text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                <p>
                  Tên gọi <strong className="font-semibold text-[#3E5C46] dark:text-[#88B795]">&ldquo;Cẩm Cù&rdquo; (Hoya carnosa)</strong> bắt nguồn từ một loài hoa dây leo mộc mạc nép mình dưới bóng rừng Tây Nguyên. Không ồn ào khoe sắc, hoa Cẩm Cù kiên định chắt chiu sương sớm qua từng năm tháng để nở thành từng chùm hình cầu lung linh tựa cánh sứ ngũ giác. Trong phong thủy và tâm thức người bản địa, chùm hoa hình tròn trọn vẹn là biểu tượng của sự gắn kết son sắt, ấm cúng và sự an yên thanh thản sâu trong tâm hồn.
                </p>
                <p>
                  Cơ duyên tìm thấy khu đất nép bên khe suối tự nhiên tại Gia Nghĩa như một lời hẹn ước định mệnh. Thay vì san phẳng mặt bằng hay bê tông hóa thô bạo, chúng tôi chọn cách nương tựa vào mẹ thiên nhiên: từng phiến đá bazan phủ rêu xanh cổ kính, từng tán lộc vừng rợp bóng hay dòng nước róc rách luồn qua khe đá đều được bảo bọc nguyên vẹn.
                </p>
                <p className="italic text-[#7D5E4A] dark:text-[#D1A684] font-serif text-lg pt-2 border-l-2 border-[#7D5E4A]/40 pl-4">
                  &ldquo;Xây dựng không phải là chiếm đoạt, mà là thêu dệt một mái hiên che mưa nắng giữa rừng cây.&rdquo;
                </p>
              </div>

              {/* Story Fact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-[#3E5C46] dark:text-[#88B795]" />
                    <span className="text-sm font-bold text-[#3E5C46] dark:text-[#88B795]">Bảo tồn đá bazan</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    Hơn 40 khối đá tự nhiên được giữ nguyên vị trí dòng chảy, tạo ghềnh thác trong trẻo.
                  </p>
                </div>
                <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-2 mb-2">
                    <Trees className="w-5 h-5 text-[#396663] dark:text-teal-400" />
                    <span className="text-sm font-bold text-[#396663] dark:text-teal-400">Vật liệu bản địa</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    Mái tranh lợp truyền thống, đan xen tre nứa cùng vải thổ cẩm thủ công mộc mạc.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Mosaic Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative group rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-[#1E2B22] border border-stone-200/60 dark:border-stone-700/60">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                  alt="Giàn chòi mái lá bên suối mát Cẩm Cù House"
                  className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-5">
                  <div className="p-4 bg-white/90 dark:bg-[#1E2B22]/90 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 dark:border-stone-700/60 w-full">
                    <span className="text-[11px] uppercase tracking-wider text-[#7D5E4A] dark:text-[#D1A684] font-bold block">
                      Không Gian Mái Tranh
                    </span>
                    <p className="text-xs font-bold text-[#1B281D] dark:text-[#F5F4EE] mt-0.5">
                      Tiếng suối róc rách dưới giàn hoa râm mát
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-[#1E2B22] border border-stone-200/60 dark:border-stone-700/60">
                <img
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
                  alt="Góc thổ cẩm hoa tươi và nội thất mộc tại Cẩm Cù House"
                  className="w-full h-64 sm:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-5">
                  <div className="p-4 bg-white/90 dark:bg-[#1E2B22]/90 backdrop-blur-md rounded-2xl shadow-sm border border-white/60 dark:border-stone-700/60 w-full">
                    <span className="text-[11px] uppercase tracking-wider text-[#396663] dark:text-teal-400 font-bold block">
                      Hồn Đất Tây Nguyên
                    </span>
                    <p className="text-xs font-bold text-[#1B281D] dark:text-[#F5F4EE] mt-0.5">
                      Sợi thổ cẩm dệt tay bên bờ đá thiên nhiên
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Triết Lý "Cà Phê Xanh - Nước Nguồn Trong" */}
        <section className="w-full py-16 bg-stone-100/70 dark:bg-[#16231A] border-y border-stone-200/60 dark:border-stone-800/80 my-10 relative transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white dark:bg-[#1E2B22] text-[#3E5C46] dark:text-[#88B795] text-xs font-bold mb-3 shadow-sm border border-stone-200 dark:border-stone-700/60">
                <Leaf className="w-3.5 h-3.5 text-[#3E5C46] dark:text-[#88B795]" />
                <span>Triết Lý Bền Vững</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold">
                &ldquo;Cà Phê Xanh • Nước Nguồn Trong&rdquo;
              </h2>
              <p className="text-base text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                Chúng tôi tin rằng chén trà hay giọt cà phê chỉ thực sự thanh khiết khi được tạo nên từ sự tử tế với đất mẹ và giữ cho dòng nước mãi xanh trong vẹn toàn.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Visual */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-[#1E2B22] border border-stone-200/60 dark:border-stone-700/60 h-[340px] relative">
                  <img
                    src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80"
                    alt="Mâm rang cà phê củi mộc Robusta Đắk Nông thủ công"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-[#F9F8F3]/95 dark:bg-[#1E2B22]/95 backdrop-blur-md rounded-full shadow-sm border border-stone-200 dark:border-stone-700/60">
                    <span className="text-xs font-bold text-[#7D5E4A] dark:text-[#D1A684] uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#7D5E4A] dark:text-[#D1A684]" />
                      Rang Củi Mộc Bản Địa
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl overflow-hidden shadow-md h-48 relative border border-stone-200 dark:border-stone-700/60">
                    <img
                      src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                      alt="Tách cà phê sớm mai bên dòng suối Đắk Nông"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-bold">
                        Tách cà phê sớm ban mai
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 flex flex-col justify-center gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-4xl text-[#3E5C46] dark:text-[#88B795] font-bold leading-none">
                        100%
                      </span>
                      <span className="text-xs text-[#7D5E4A] dark:text-[#D1A684] font-bold uppercase">
                        Robusta Trái Chín
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      Thu hái có chọn lọc từ các nông hộ Đắk Nông canh tác dưới tán rừng, hậu vị đậm đà hương thơm cỏ cây.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Philosophy Narrative */}
              <div className="lg:col-span-6 flex flex-col justify-between gap-6">
                {/* Article 1 */}
                <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-[#16231A] flex items-center justify-center text-[#3E5C46] dark:text-[#88B795] shrink-0 shadow-sm">
                      <Coffee className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold">
                        Hạt Cà Phê Mộc Gia Nghĩa
                      </h3>
                      <span className="text-xs text-[#7D5E4A] dark:text-[#D1A684] uppercase font-semibold">
                        Không Tẩm Ướp • Thuần Bản Nguyên
                      </span>
                    </div>
                  </div>
                  <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                    Đắk Nông nổi danh với thổ nhưỡng đất đỏ bazan phì nhiêu giàu khoáng chất. Cẩm Cù House đồng hành mật thiết cùng những người nông dân địa phương, chọn hái từng hạt Robusta chín mọng. Chúng tôi rang bằng than củi tự nhiên ở nhiệt độ lửa vừa, không hóa chất phụ gia, giữ trọn vị đắng êm dịu, ngọt sâu nơi cuống họng.
                  </p>
                </div>

                {/* Article 2 */}
                <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 sm:p-8 border border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#396663]/15 dark:bg-teal-900/30 flex items-center justify-center text-[#396663] dark:text-teal-400 shrink-0 shadow-sm">
                      <Droplets className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-[#396663] dark:text-teal-400 font-bold">
                        Lời Nguyện Cầu Cho Dòng Nước
                      </h3>
                      <span className="text-xs text-[#396663] dark:text-teal-400 uppercase font-bold">
                        Zero Rác Thải Nhựa Xuống Suối
                      </span>
                    </div>
                  </div>
                  <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                    Nước suối là linh hồn của Cẩm Cù House. Toàn bộ thức uống được phục vụ cùng ống hút cỏ bàng sấy khô hoặc giấy tự phân hủy hữu cơ. Đội ngũ nhân viên mỗi tuần đều thực hiện chương trình &ldquo;Lắng Nghe Suối Ngàn&rdquo; – nhặt sạch từng mẩu rác trôi dạt từ đầu nguồn để bảo vệ đàn cá bơi lội và những cánh chuồn chuồn rừng.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-600 dark:text-stone-300">
                    <span className="inline-flex items-center gap-1.5 text-[#3E5C46] dark:text-[#88B795]">
                      <CheckCircle2 className="w-4 h-4 text-[#3E5C46] dark:text-[#88B795]" />
                      100% Cỏ Bàng Tự Nhiên
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#396663] dark:text-teal-400">
                      <CheckCircle2 className="w-4 h-4 text-[#396663] dark:text-teal-400" />
                      Bảo Hộ Đàn Cá Bản Địa
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Đội Ngũ & Tinh Thần Đắk Nông */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#7D5E4A] dark:text-[#D1A684] uppercase tracking-wider">
                  Khối 03
                </span>
                <span className="w-8 h-[2px] bg-amber-200 dark:bg-amber-700/60" />
                <span className="text-xs text-stone-500 dark:text-stone-400">Con Người &amp; Sự Đón Chào</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#3E5C46] dark:text-[#F5F4EE] font-bold leading-tight">
                Nụ Cười Chân Thật Của Người Con Đất Đỏ
              </h2>

              <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                Tại Cẩm Cù House, bạn sẽ không tìm thấy sự xa cách hay nghi thức cầu kỳ của những nhà hàng hiện đại chốn đô thành. Thay vào đó là nụ cười mộc mạc, sự ân cần hồn hậu của những người con sinh ra và lớn lên giữa đại ngàn Gia Nghĩa.
              </p>
              <p className="text-base text-stone-700 dark:text-stone-300 leading-relaxed">
                Dù bạn đến tìm một khoảng lặng đọc sách, một bữa cơm lam gà nướng thơm nồng cùng gia đình, hay đơn thuần ngâm chân dưới dòng nước mát lạnh – bạn luôn được chào đón như một người thân trở về mái nhà xưa.
              </p>

              <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3E5C46] dark:bg-[#2D4233] flex items-center justify-center text-white shrink-0 shadow-md">
                  <Heart className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="font-serif text-base font-bold text-[#3E5C46] dark:text-[#88B795]">
                    &ldquo;Đón Khách Như Đón Người Thương&rdquo;
                  </p>
                  <p className="text-xs text-[#7D5E4A] dark:text-[#D1A684] uppercase mt-0.5 tracking-wider font-semibold">
                    Kim chỉ nam trong từng cử chỉ phục vụ
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Core Commitments Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Pillar 1 */}
                <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#3E5C46] dark:bg-[#2D4233] text-white flex items-center justify-center mb-4 shadow-sm">
                      <Trees className="w-6 h-6 text-emerald-300" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#3E5C46] dark:text-[#F5F4EE] mb-1">
                      Tôn Trọng Tự Nhiên
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      Giữ gìn từng phiến đá, nhành cây, không xâm hại thô bạo vào địa mạo và dòng chảy nguyên sơ của mẹ thiên nhiên.
                    </p>
                  </div>
                  <span className="text-xs text-[#3E5C46] dark:text-[#88B795] font-bold mt-4 flex items-center gap-1">
                    Tiêu chí 01 <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Pillar 2 */}
                <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-amber-800 dark:bg-amber-900 text-white flex items-center justify-center mb-4 shadow-sm">
                      <Coffee className="w-6 h-6 text-amber-200" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#3E5C46] dark:text-[#F5F4EE] mb-1">
                      Hạt Cà Phê Mộc
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      Nguyên chất 100%, hạt chín đều đặn từ nông hộ bản xứ, tuyệt đối nói không với hương liệu nhân tạo và chất bảo quản.
                    </p>
                  </div>
                  <span className="text-xs text-[#7D5E4A] dark:text-[#D1A684] font-bold mt-4 flex items-center gap-1">
                    Tiêu chí 02 <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Pillar 3 */}
                <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#396663] dark:bg-teal-900 text-white flex items-center justify-center mb-4 shadow-sm">
                      <Heart className="w-6 h-6 text-teal-200" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#3E5C46] dark:text-[#F5F4EE] mb-1">
                      Dịch Vụ Tận Tâm
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      Lắng nghe với tấm lòng rộng mở, tạo cảm giác thân thuộc như ngôi nhà thứ hai giữa đại ngàn xanh biếc.
                    </p>
                  </div>
                  <span className="text-xs text-[#396663] dark:text-teal-400 font-bold mt-4 flex items-center gap-1">
                    Tiêu chí 03 <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Pillar 4 */}
                <div className="bg-white/90 dark:bg-[#1E2B22] backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-stone-200/60 dark:border-stone-700/60 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#3E5C46] dark:bg-[#2D4233] text-white flex items-center justify-center mb-4 shadow-sm">
                      <Users className="w-6 h-6 text-emerald-300" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#3E5C46] dark:text-[#F5F4EE] mb-1">
                      Gắn Kết Cộng Đồng
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      Tạo sinh kế bền vững cho thanh niên địa phương, quảng bá thổ cẩm và đặc sản Gia Nghĩa đến bạn bè khắp chốn.
                    </p>
                  </div>
                  <span className="text-xs text-[#3E5C46] dark:text-[#88B795] font-bold mt-4 flex items-center gap-1">
                    Tiêu chí 04 <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Invitation Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4 w-full">
          <div className="relative rounded-3xl overflow-hidden bg-[#2D4233] dark:bg-[#16231A] text-white p-8 sm:p-12 shadow-2xl border border-stone-700/50">
            <div className="relative z-10 max-w-3xl flex flex-col items-start gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 dark:bg-white/10 text-emerald-100 text-xs font-semibold shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                Hẻm 437 Hùng Vương, P. Nghĩa Trung, TP. Gia Nghĩa
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Hãy Để Dòng Suối Mát Xoa Dịu Tâm Hồn Bạn
              </h3>
              <p className="text-base text-stone-200 leading-relaxed max-w-2xl">
                Một tách cà phê Robusta rang củi ấm áp, một góc bàn dân dã bên làn nước trong vắt và tiếng chim rừng ríu rít đang đợi bạn tại Cẩm Cù House.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="tel:0382851688"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#2D4233] text-sm font-bold shadow-lg hover:bg-stone-100 transition-all hover:scale-105"
                >
                  <PhoneCall className="w-4 h-4 text-[#2D4233]" />
                  <span>Gọi Hotline: 038 285 1688</span>
                </a>
                <a
                  href="https://maps.google.com/?q=Hem+437+Hung+Vuong+Nghia+Trung+Gia+Nghia+Dak+Nong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1F2E23] text-white text-sm font-semibold hover:bg-[#16231A] transition-all border border-white/20"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Chỉ Đường Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}