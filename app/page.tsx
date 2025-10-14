"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Phone,
  Menu,
  X,
  Home as HomeIcon,
  GraduationCap,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const galleryItem: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Общие варианты анимации
const fadeInFromLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const fadeInFromBottom: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInWithScale: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContent: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

const slideDown: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function Home() {
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Optimized animation variants for mobile
  const optimizedContainer: Variants = isMobile
    ? {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08 }, // Faster stagger on mobile
        },
      }
    : container;

  const optimizedItem: Variants = isMobile
    ? {
        hidden: { opacity: 0, y: 20 }, // Reduced movement on mobile
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4, // Shorter duration on mobile
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }
    : item;

  const optimizedGalleryItem: Variants = isMobile
    ? {
        hidden: { opacity: 0, y: 20 }, // Reduced movement on mobile
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3, // Shorter duration on mobile
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }
    : galleryItem;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const openGalleryModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeGalleryModal = () => {
    setSelectedImage(null);
  };

  const navigateGallery = useCallback(
    (direction: "prev" | "next") => {
      if (selectedImage === null) return;
      const images = [
        "/gallery/1_optimized.jpg",
        "/gallery/2_optimized.jpg",
        "/gallery/3_optimized.jpg",
        "/gallery/4_optimized.jpg",
        "/gallery/5.png",
        "/gallery/6.png",
      ];

      if (direction === "prev") {
        setSelectedImage(
          selectedImage > 0 ? selectedImage - 1 : images.length - 1
        );
      } else {
        setSelectedImage(
          selectedImage < images.length - 1 ? selectedImage + 1 : 0
        );
      }
    },
    [selectedImage]
  );

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "masterclasses", "contacts"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (event.key === "Escape") {
        closeGalleryModal();
      } else if (event.key === "ArrowLeft") {
        navigateGallery("prev");
      } else if (event.key === "ArrowRight") {
        navigateGallery("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, navigateGallery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as Element;
        if (!target.closest("nav")) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const el = reviewsRef.current;
    if (!el) return;

    let frameId: number | null = null;
    let last = 0;
    const speedMobile = 0.08; // px per ms (very slow for comfortable reading)

    const step = (t: number) => {
      if (!last) last = t;
      const dt = t - last;
      last = t;
      if (window.innerWidth < 768 && !isPaused) {
        if (el.scrollWidth > el.clientWidth) {
          el.scrollLeft += dt * speedMobile;
          if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
            el.scrollLeft = 0;
          }
        }
      }
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isPaused]);

  // Detect mobile device for animation optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Background image transition effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans min-h-screen bg-gray-50 text-[#1a1a1a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between h-16">
            <motion.div
              variants={fadeInFromLeft}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="text-xl font-bold text-[#1a1a1a] hover:text-[#d4a762] transition-colors cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Barber Baxha
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "home", label: "Главная", icon: HomeIcon },
                { id: "about", label: "Обо мне", icon: HomeIcon },
                {
                  id: "masterclasses",
                  label: "Мастер-классы",
                  icon: GraduationCap,
                },
                { id: "contacts", label: "Контакты", icon: MapPin },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    role="button"
                    aria-label={`Перейти к разделу ${item.label}`}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                      activeSection === item.id
                        ? "bg-[#d4a762] text-black font-semibold"
                        : "text-gray-700 hover:text-[#d4a762] hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={
                isMobileMenuOpen
                  ? "Закрыть главное меню"
                  : "Открыть главное меню"
              }
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200 z-40"
            id="mobile-menu"
            aria-hidden={!isMobileMenuOpen}
            role="navigation"
            aria-label="Главное меню"
          >
            <div
              className="px-6 py-4 space-y-2"
              onClick={(e) => e.stopPropagation()}
              role="menu"
            >
              {[
                { id: "home", label: "Главная", icon: HomeIcon },
                { id: "about", label: "Обо мне", icon: HomeIcon },
                {
                  id: "masterclasses",
                  label: "Мастер-классы",
                  icon: GraduationCap,
                },
                { id: "contacts", label: "Контакты", icon: MapPin },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    role="menuitem"
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors touch-manipulation ${
                      activeSection === item.id
                        ? "bg-[#d4a762] text-black font-semibold"
                        : "text-gray-700 hover:text-[#d4a762] hover:bg-gray-100 active:bg-gray-200"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <header
        id="home"
        className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden"
      >
        {/* Background Images with smooth transition */}
        <div className="absolute inset-0">
          {/* First background image */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentBgImage === 0 ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Image
              src="/gallery/bg_optimized.jpg"
              alt="Интерьер барбершопа"
              fill
              className="object-cover object-center md:object-[center_20%] opacity-70"
              sizes="100vw"
              quality={70}
              priority
            />
          </motion.div>

          {/* Second background image */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentBgImage === 1 ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Image
              src="/gallery/bg1.png"
              alt="Интерьер барбершопа"
              fill
              className="object-cover object-center md:object-[center_20%] opacity-70"
              sizes="100vw"
              quality={70}
            />
          </motion.div>

          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </div>

        {/* Floating elements - появляются после фона */}
        <motion.div
          className="hidden md:block absolute top-1/4 left-1/4 w-2 h-2 bg-[#d4a762] rounded-full opacity-40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
            y: [-10, 10, -10],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.8 },
            scale: { duration: 0.8, delay: 0.8 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6">
          {/* Main Title - появляется вторым */}
          <motion.div
            variants={fadeInWithScale}
            initial="hidden"
            animate="visible"
            transition={{
              duration: isMobile ? 0.5 : 0.8, // Shorter on mobile
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: isMobile ? 0.3 : 0.6, // Faster on mobile
            }}
            className="mb-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: isMobile ? 0.4 : 0.6,
                delay: isMobile ? 0.5 : 0.8,
              }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 relative font-serif tracking-tight"
            >
              Баха Бабаджанов
            </motion.h1>
          </motion.div>

          {/* Subtitle - появляется третьим */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl mb-8 px-4 sm:px-0"
            variants={fadeInFromBottom}
            initial="hidden"
            animate="visible"
            transition={{
              duration: isMobile ? 0.4 : 0.6,
              delay: isMobile ? 0.7 : 1.0,
              ease: "easeOut",
            }}
          >
            Я стригу и обучаю мастеров <br /> «Профессиональный барбер с 15+ лет
            опыта. Индивидуальный стиль, современная техника и атмосфера.»
          </motion.p>

          {/* Button - появляется последним */}
          <motion.div
            variants={fadeInWithScale}
            initial="hidden"
            animate="visible"
            transition={{
              duration: isMobile ? 0.4 : 0.6,
              delay: isMobile ? 0.9 : 1.3,
              ease: "easeOut",
            }}
          >
            <Link
              href="https://n70399.yclients.com/company/27708/personal/menu?o=m20847&fbclid=PARlRTSANbIyBleHRuA2FlbQIxMQABp9avW6DlOWpxW2W2EkH__LuWE1DmUKzklv3RTQqsgytGJPGTpsDOUvQo0SvR_aem_GUQa6L0WLR4cAdoDyFVnKw"
              target="_blank"
              aria-label="Записаться на стрижку онлайн"
              className="bg-[#d4a762] hover:bg-amber-600 text-black font-bold py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition inline-block"
            >
              Записаться
            </Link>
          </motion.div>
        </div>
      </header>

      <main>
        {/* About */}
        <section
          id="about"
          className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 pt-20 sm:pt-24"
        >
          <motion.div
            variants={optimizedContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-10 sm:grid-cols-2 items-center"
          >
            <motion.div variants={optimizedItem}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl sm:text-3xl font-bold mb-6 font-serif tracking-tight"
              >
                Обо мне
              </motion.h2>
              <p className="mt-0 text-base sm:text-lg text-gray-700 leading-7 mb-6">
                Привет! Я — профессиональный барбер с опытом более X лет.
                Специализируюсь на мужских стрижках, классических и современных
                фейдах, уходе за бородой и индивидуальном подборе стиля
              </p>

              <div className="bg-[#d4a762]/10 p-4 sm:p-6 rounded-lg border-l-4 border-[#d4a762]">
                <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-3 flex items-center gap-2 font-serif">
                  <span className="text-xl sm:text-2xl">✂️</span>
                  Моя миссия
                </h3>
                <p className="text-base sm:text-lg text-gray-700 leading-7">
                  Сделать так, чтобы каждый клиент чувствовал уверенность в себе
                  после стрижки. Для меня барберинг — это не просто работа, а
                  искусство и способ подчеркнуть твою индивидуальность
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={optimizedItem}
              className="relative aspect-[3/4] w-full"
            >
              <Image
                src="/gallery/hero.png"
                alt="Барбер за работой"
                fill
                className="object-contain bg-gray-100 rounded-lg shadow-xl"
                sizes="(max-width: 640px) 100vw, 50vw"
                quality={70}
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Gallery */}
        <section
          id="gallery"
          className="py-16 sm:py-20 pt-20 sm:pt-24 px-4 sm:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl font-bold mb-6 text-center font-serif tracking-tight"
            >
              Мои работы
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base sm:text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto px-4"
            >
              Примеры моих работ: от классических стрижек до современных
              трендов. Каждая стрижка выполняется с вниманием к деталям и
              индивидуальным подходом к клиенту
            </motion.p>
            <motion.div
              variants={
                isMobile
                  ? {
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.08,
                          delayChildren: 0.1,
                        }, // Faster on mobile
                      },
                    }
                  : {
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.15,
                          delayChildren: 0.2,
                        },
                      },
                    }
              }
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
            >
              {[
                // 1 — барбершоп интерьер
                "/gallery/1_optimized.jpg",
                // остальное — мужские стрижки
                "/gallery/2_optimized.jpg",
                "/gallery/3_optimized.jpg",
                "/gallery/4_optimized.jpg",
                "/gallery/5.png",
                "/gallery/6.png",
              ].map((src, i) => (
                <motion.div
                  key={src}
                  variants={optimizedGalleryItem}
                  className="relative w-full h-48 sm:h-64 cursor-pointer group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  onClick={() => openGalleryModal(i)}
                  whileHover={
                    isMobile
                      ? {}
                      : {
                          // Disable hover animations on mobile
                          scale: 1.02,
                        }
                  }
                  transition={
                    isMobile
                      ? {
                          duration: 0.2,
                          ease: "easeOut",
                        }
                      : {
                          duration: 0.2,
                          ease: "easeOut",
                        }
                  }
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={src}
                      alt={
                        i === 0
                          ? "Современный интерьер барбершопа с зеркалами и креслами"
                          : i === 1
                          ? "Классическая мужская стрижка с аккуратными линиями"
                          : i === 2
                          ? "Модная стрижка с фейдом и укладкой"
                          : i === 3
                          ? "Стильная мужская прическа с текстурой"
                          : i === 4
                          ? "Профессиональная стрижка и оформление бороды"
                          : "Качественная мужская стрижка от мастера"
                      }
                      fill
                      className="object-cover object-center md:object-[center_25%] transition-all duration-300 group-hover:brightness-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      quality={70}
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <ZoomIn
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      size={32}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Masterclasses */}
        <section id="masterclasses" className="py-20 pt-24 bg-gray-100 px-6">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-12 text-center sm:text-left text-[#1a1a1a] font-serif tracking-tight">
                  Мастер-классы
                </h2>
                <p className="text-xl text-center sm:text-left mb-12">
                  Обучайтесь у профессионала! Поделитесь опытом и освоите новые
                  техники барберинга
                </p>
              </div>
              <Link
                href="https://t.me/Bakha2505"
                target="_blank"
                aria-label="Записаться на мастер-класс барберинга в Telegram"
                className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-6 py-3 pb-4 md:pb-3 text-white font-bold hover:bg-gray-800 transition mb-6"
              >
                Записаться на мастер-класс
              </Link>
            </div>

            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-bold mb-2">
                  15 октября 2025, 14:00
                </h4>
                <p className="text-gray-600 mb-4">
                  Тема: Современные мужские стрижки
                </p>
                <p className="text-lg font-bold text-[#d4a762]">Места: 5/10</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-bold mb-2">
                  20 октября 2025, 11:00
                </h4>
                <p className="text-gray-600 mb-4">
                  Тема: Уход и стайлинг бороды
                </p>
                <p className="text-lg font-bold text-[#d4a762]">Места: 8/12</p>
              </div>
            </div>
            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-bold mb-4 font-serif tracking-tight">
                  Современные мужские стрижки
                </h4>
                <div className="text-gray-700 space-y-2">
                  <p>
                    Практический мастер-класс по техникам фейдинга,
                    текстурирования и стайлинга
                  </p>
                  <p>
                    <strong>Длительность:</strong> 4 часа
                  </p>
                  <p>
                    <strong>Программа:</strong> Демонстрация и самостоятельная
                    практика
                  </p>
                </div>
                <p className="text-lg font-bold text-[#d4a762] mb-0">
                  Стоимость: 5000 ₽
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-bold mb-4 font-serif tracking-tight">
                  Уход и стайлинг бороды
                </h4>
                <div className="text-gray-700 space-y-2">
                  <p>
                    Формование контуров, масла и инструменты для идеальной
                    бороды
                  </p>
                  <p>
                    <strong>Длительность:</strong> 3 часа
                  </p>
                  <p>
                    <strong>Программа:</strong> Теория + практика
                  </p>
                </div>
                <p className="text-lg font-bold text-[#d4a762] mb-0">
                  Стоимость: 4000 ₽
                </p>
              </div>
            </div>

            {/* Полный курс обучения */}
            <div className="mb-16 bg-white p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-center font-serif tracking-tight">
                Курс обучения барберов с нуля
              </h3>
              <div className="text-lg text-gray-700 mb-8 text-center space-y-2">
                <p>Комплексная программа для начинающих барберов</p>
                <p>
                  Изучите все аспекты профессии от базовых техник до работы с
                  клиентами
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold mb-6 text-[#1a1a1a] font-serif tracking-tight">
                    В программу обучения ВХОДЯТ:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4a762] font-bold">•</span>
                      <span>Коммерческие мужские стрижки</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4a762] font-bold">•</span>
                      <span>Фэйдинг и работа машинками</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4a762] font-bold">•</span>
                      <span>Удлиненные стрижки и работа ножницами</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4a762] font-bold">•</span>
                      <span>Укладки и подбор стайлинга</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4a762] font-bold">•</span>
                      <span>Создание текстур</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4a762] font-bold">•</span>
                      <span>Оформление бороды и работа бритвой</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4a762] font-bold">•</span>
                      <span>Сервис осуществления услуг</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4a762] font-bold">•</span>
                      <span>Фотография своих работ</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4a762] font-bold">•</span>
                      <span>Классическое бритье головы и лица</span>
                    </li>
                  </ul>

                  <div className="mt-6 space-y-3">
                    <p className="text-gray-700">
                      <strong>Длительность:</strong> 40 часов
                    </p>
                    <p className="text-gray-700">
                      <strong>Формат:</strong> Индивидуальные занятия
                    </p>
                    <p className="text-gray-700">
                      <strong>Результат:</strong> Готовность к работе с
                      клиентами
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src="/education/educ1.png"
                      alt="Обучение барберингу"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      quality={80}
                      loading="lazy"
                    />
                  </div>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src="/education/educ2.png"
                      alt="Практические занятия"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      quality={80}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="https://t.me/Bakha2505"
                  target="_blank"
                  aria-label="Записаться на полный курс обучения барберинга в Telegram"
                  className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-8 py-4 text-white font-bold hover:bg-gray-800 transition text-lg"
                >
                  Записаться на полный курс
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="py-20 pt-24 bg-gray-100 px-6">
          <div className="mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-12 text-center"
            >
              Отзывы учеников
            </motion.h2>
            <div
              ref={reviewsRef}
              className="md:grid md:grid-cols-3 md:gap-8 flex md:flex-none gap-4 overflow-x-auto pr-2 touch-pan-x"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {[
                {
                  name: "Алексей",
                  text: "Отличный мастер-класс по мужским стрижкам! Научился техникам фейдинга, которые теперь использую в своей работе.",
                },
                {
                  name: "Анна",
                  text: "Прошла курс по уходу за бородой. Получила много практических навыков и качественных инструментов для работы.",
                },
                {
                  name: "Елена",
                  text: "Прекрасный преподаватель! Объясняет все доступно, показывает на практике. Рекомендую всем барберам.",
                },
                {
                  name: "Сергей",
                  text: "Мастер-класс превзошел ожидания. Узнал секреты профессионального стайлинга и текстурирования волос.",
                },
                {
                  name: "Павел",
                  text: "После курса мои клиенты стали намного довольнее результатом. Спасибо за ценные знания!",
                },
                {
                  name: "Никита",
                  text: "Инвестиция в образование, которая окупилась за месяц! Теперь работаю с большей уверенностью.",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  className="bg-white p-6 rounded-lg shadow-md min-w-[85%] md:min-w-0"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#d4a762]/20 text-[#1a1a1a] mr-4 flex items-center justify-center font-bold">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold">{r.name}</h4>
                    </div>
                  </div>
                  <p className="text-gray-700">“{r.text}”</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contacts */}
        <section id="contacts" className="py-20 pt-24 px-6">
          <div className="mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-12 text-center"
            >
              Контакты
            </motion.h2>
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-6">Как записаться</h3>
                <div className="space-y-4">
                  <p className="flex items-center justify-center gap-2 text-lg">
                    <Phone size={20} className="text-[#d4a762]" />
                    <span>+7 (999) 123-45-67</span>
                  </p>
                  <p className="text-lg">WhatsApp: +7 (999) 123-45-67</p>
                  <p className="text-lg">Telegram: @Bakha2505</p>
                </div>
              </div>
              <Link
                href="https://n70399.yclients.com/company/27708/personal/menu?o=m20847&fbclid=PARlRTSANbIyBleHRuA2FlbQIxMQABp9avW6DlOWpxW2W2EkH__LuWE1DmUKzklv3RTQqsgytGJPGTpsDOUvQo0SvR_aem_GUQa6L0WLR4cAdoDyFVnKw"
                target="_blank"
                aria-label="Записаться на онлайн консультацию"
                className="bg-[#d4a762] hover:bg-amber-600 text-black font-bold py-4 px-12 rounded-full text-xl transition inline-block"
              >
                Записаться онлайн
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-12 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3
                className="text-2xl font-bold mb-2 hover:text-[#d4a762] transition-colors cursor-pointer font-serif tracking-tight"
                onClick={() => window.location.reload()}
              >
                Barber Baxha
              </h3>
              <p className="text-gray-300 mb-2">© 2025 Все права защищены</p>
              <p className="text-sm text-gray-400">
                Профессиональные стрижки и обучение барберов
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Сайт создан:{" "}
                <Link
                  href="https://t.me/PapyRoy"
                  target="_blank"
                  className="hover:text-[#d4a762] transition-colors"
                >
                  Roy&dev
                </Link>
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-center md:text-right">
                <p className="text-gray-300 mb-2">Свяжитесь со мной</p>
                <div className="flex items-center justify-center md:justify-end gap-4 text-lg">
                  <Link
                    href="https://www.instagram.com/bakha2505?igsh=cDlvMmgwY2VvbWI1"
                    target="_blank"
                    className="hover:text-[#d4a762] transition-colors flex items-center gap-2"
                    aria-label="Instagram профиль"
                  >
                    <span>Instagram</span>
                  </Link>
                  <Link
                    href="https://t.me/Bakha2505"
                    target="_blank"
                    className="hover:text-[#d4a762] transition-colors flex items-center gap-2"
                    aria-label="Telegram канал"
                  >
                    <span>Telegram</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Gallery Modal */}
      {selectedImage !== null && (
        <motion.div
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeGalleryModal}
        >
          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeGalleryModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X size={32} />
            </button>

            <button
              onClick={() => navigateGallery("prev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={() => navigateGallery("next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
            >
              <ChevronRight size={32} />
            </button>

            <Image
              src={
                [
                  "/gallery/1_optimized.jpg",
                  "/gallery/2_optimized.jpg",
                  "/gallery/3_optimized.jpg",
                  "/gallery/4_optimized.jpg",
                  "/gallery/5.png",
                  "/gallery/6.png",
                ][selectedImage]
              }
              alt={
                selectedImage === 0
                  ? "Современный интерьер барбершопа с зеркалами и креслами"
                  : selectedImage === 1
                  ? "Классическая мужская стрижка с аккуратными линиями"
                  : selectedImage === 2
                  ? "Модная стрижка с фейдом и укладкой"
                  : selectedImage === 3
                  ? "Стильная мужская прическа с текстурой"
                  : selectedImage === 4
                  ? "Профессиональная стрижка и оформление бороды"
                  : "Качественная мужская стрижка от мастера"
              }
              width={800}
              height={600}
              className="rounded-lg shadow-2xl"
              quality={90}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
              <p className="text-lg font-semibold">
                {selectedImage === 0
                  ? "Интерьер барбершопа"
                  : `Работа ${selectedImage}`}
              </p>
              <p className="text-sm text-gray-300">{selectedImage + 1} из 6</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
