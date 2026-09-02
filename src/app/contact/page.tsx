"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Navigation, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import BlurText from "@/components/ui/BlurText";

const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=10605553198031545365&q=C%E1%BA%A9m+C%C3%B9+House";

export default function ContactPage() {
  const { t, lang } = useLanguage();

  return (
    <main className="relative min-h-screen bg-transparent text-[#F4EFEA] z-10 pt-32 pb-32 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[#C5A880] uppercase tracking-[0.25em] text-xs sm:text-sm mb-3 block font-sans">
            {t("contact.mapSubtitle")}
          </span>
          <BlurText 
            text={t("contact.mapTitle")}
            as="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F4EFEA] mb-6"
          />
          <div className="w-16 h-[1px] bg-[#C5A880]/40 mx-auto mt-4"></div>
        </div>

        {/* 2-Column Content Layout: Info & Google Maps Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Direct Contact & Direction Cards (5 Cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col justify-between gap-6"
          >
            {/* Address & Navigation Card */}
            <div className="p-8 rounded-2xl bg-[#24140C] border border-[#C5A880]/25 hover:border-[#C5A880]/60 transition-all duration-300 shadow-xl flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[#1E1008] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                <MapPin size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg text-[#F4EFEA]">{t("contact.addressLabel")}</h3>
                  <span className="text-[10px] uppercase font-sans tracking-wider bg-[#C5A880]/15 text-[#C5A880] px-2 py-0.5 rounded-full border border-[#C5A880]/30">
                    Gia Nghĩa
                  </span>
                </div>
                <p className="text-[#F4EFEA]/80 font-light text-sm leading-relaxed mb-4">
                  {t("contact.address")}
                </p>
                <a 
                  href={GOOGLE_MAPS_URL}
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#F4EFEA] hover:bg-[#C5A880] text-[#1A0F0A] px-5 py-2.5 rounded-xl font-sans font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm"
                >
                  <Navigation size={13} />
                  <span>{t("contact.openMapBtn")}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Opening Hours Card */}
            <div className="p-8 rounded-2xl bg-[#24140C] border border-[#C5A880]/25 hover:border-[#C5A880]/60 transition-all duration-300 shadow-xl flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[#1E1008] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                <Clock size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-[#F4EFEA] mb-1.5">{t("contact.hoursLabel")}</h3>
                <div className="text-[#C5A880] text-sm font-sans font-semibold tracking-wide mb-2">
                  {t("contact.dailyHours")}
                </div>
                <div className="text-[#F4EFEA]/70 font-light text-xs space-y-1 leading-relaxed">
                  <p>{t("contact.hours1")}</p>
                  <p>{t("contact.hours2")}</p>
                </div>
              </div>
            </div>

            {/* Hotline & Direct Booking Card */}
            <div className="p-8 rounded-2xl bg-[#24140C] border border-[#C5A880]/25 hover:border-[#C5A880]/60 transition-all duration-300 shadow-xl flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[#1E1008] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shrink-0 mt-0.5">
                <Phone size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-[#F4EFEA] mb-1.5">{t("contact.phoneLabel")}</h3>
                <p className="text-2xl font-serif text-[#C5A880] font-bold tracking-wider mb-4">0382 851 688</p>
                <a 
                  href="tel:0382851688" 
                  className="inline-flex items-center justify-center gap-2 bg-[#1E1008] hover:bg-[#C5A880] hover:text-[#1A0F0A] text-[#F4EFEA] border border-[#C5A880]/40 px-6 py-2.5 rounded-xl font-sans font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm"
                >
                  <Phone size={14} /> {t("contact.directCall")}
                </a>
              </div>
            </div>

            {/* Social Channels Bar */}
            <div className="p-6 rounded-2xl bg-[#1A0F0A] border border-[#C5A880]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-sans tracking-widest text-[#C5A880] uppercase font-semibold">
                {t("contact.socialLabel")}
              </span>
              <div className="flex gap-3">
                {/* Facebook */}
                <a 
                  href="https://www.facebook.com/share/1DVLMySW8H" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-[#24140C] border border-[#C5A880]/30 flex items-center justify-center text-[#F4EFEA]/80 hover:text-[#1A0F0A] hover:bg-[#C5A880] hover:border-[#C5A880] transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a 
                  href="https://youtube.com/@Cam_Cu_House" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-[#24140C] border border-[#C5A880]/30 flex items-center justify-center text-[#F4EFEA]/80 hover:text-[#1A0F0A] hover:bg-[#C5A880] hover:border-[#C5A880] transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M21.582 6.186a2.67 2.67 0 0 0-1.884-1.888C17.962 3.8 12 3.8 12 3.8s-5.962 0-7.698.498a2.67 2.67 0 0 0-1.884 1.888C1.92 7.922 1.92 12 1.92 12s0 4.078.498 5.814a2.67 2.67 0 0 0 1.884 1.888C6.038 20.2 12 20.2 12 20.2s5.962 0 7.698-.498a2.67 2.67 0 0 0 1.884-1.888C22.08 16.078 22.08 12 22.08 12s0-4.078-.498-5.814zM9.9 15.3v-6.6l5.7 3.3-5.7 3.3z"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a 
                  href="https://www.tiktok.com/@camcuhousedaknong" 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="TikTok"
                  className="w-10 h-10 rounded-full bg-[#24140C] border border-[#C5A880]/30 flex items-center justify-center text-[#F4EFEA]/80 hover:text-[#1A0F0A] hover:bg-[#C5A880] hover:border-[#C5A880] transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.22-2.39.81-4.78 2.63-6.2 1.53-1.22 3.51-1.72 5.43-1.49v4.06c-1.16-.1-2.31.25-3.18 1.01-.76.63-1.23 1.59-1.25 2.58-.02 1.35.8 2.67 2.03 3.23 1.11.53 2.45.54 3.56.05 1.1-.48 1.89-1.44 2.11-2.61.12-.66.11-1.33.11-2.01V.02z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Google Maps Large Interactive Embed (7 Cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="w-full h-full min-h-[420px] lg:min-h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-[#1E1008] border border-[#C5A880]/30 relative flex flex-col">
              
              {/* Header inside Map Box */}
              <div className="p-4 px-6 bg-[#1A0F0A]/95 border-b border-[#C5A880]/20 flex justify-between items-center z-10">
                <div className="flex items-center gap-2 text-xs font-sans tracking-wider text-[#F4EFEA]/90">
                  <MapPin size={15} className="text-[#C5A880]" />
                  <span className="font-medium">Cẩm Cù House • Gia Nghĩa, Đắk Nông</span>
                </div>
                <a 
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-sans text-[#C5A880] hover:text-[#F4EFEA] uppercase tracking-widest flex items-center gap-1.5 transition-colors font-medium"
                >
                  <span>{t("contact.openMapBtn")}</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Exact Google Maps Embed Iframe */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4802.49617262464!2d107.7030752!3d11.9758153!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3173c7ccbd4cd55f%3A0x932e986e061ca415!2zQ-G6qW0gQ8O5IEhvdXNl!5e1!3m2!1svi!2s!4v1788347215068!5m2!1svi!2s"
                className="w-full h-[350px] md:h-[450px] lg:h-full min-h-[380px] lg:min-h-[520px] rounded-b-2xl border-0 shadow-2xl filter contrast-[1.05] opacity-95 hover:opacity-100 transition-opacity duration-300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title={lang === "en" ? "Cam Cu House Location" : "Vị trí Cẩm Cù House"}
              />
            </div>
          </motion.div>

        </div>

      </div>
    </main>
  );
}
