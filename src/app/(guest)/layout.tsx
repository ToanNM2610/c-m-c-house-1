export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full">
      {/* Header mộc mạc cho Khách */}
      <header className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-transparent">
        <div className="text-xl font-serif text-stone-100 drop-shadow-md">Cẩm Cù</div>
        <nav className="flex gap-8 text-stone-200 text-sm tracking-widest font-light drop-shadow-md">
          <a href="/about" className="hover:text-white transition">CHUYỆN NHÀ</a>
          <a href="/menu" className="hover:text-white transition">THỰC ĐƠN</a>
          <a href="/gallery" className="hover:text-white transition">GÓC ẢNH</a>
          <a href="/contact" className="hover:text-white transition">GHÉ CHƠI</a>
        </nav>
      </header>
      
      {/* Smooth scroll container can be added here if needed */}
      <div className="guest-scroll-container">
        {children}
      </div>
    </div>
  );
}
