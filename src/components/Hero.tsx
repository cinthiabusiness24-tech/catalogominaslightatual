import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleParallax = () => {
      if (videoRef.current) {
        const scroll = window.scrollY;
        videoRef.current.style.transform = `translateY(${scroll * 0.35}px)`;
      }
    };
    window.addEventListener('scroll', handleParallax, { passive: true });
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  const scrollToCatalog = () =>
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });

  const scrollToContact = () =>
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden flex items-center">
      {/* Background */}
      <div ref={videoRef} className="absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/40 to-stone-900/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/30 via-transparent to-transparent" />
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/*
        pt values push content well below the fixed navbar:
          mobile  (h=80px): pt-[120px]
          tablet  (h=80px): pt-[140px]
          desktop (h=90px): pt-[160px]
      */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-[120px] md:pt-[140px] lg:pt-[160px] pb-24">
        <div className="w-full max-w-[700px]">

          {/* Eyebrow — at least 32px clear of logo area due to pt above */}
          <motion.p
            className="font-body text-[10px] tracking-[0.3em] uppercase text-gold-200 mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.6 }}
          >
            Iluminação em Tela Tensionada & Projetos Luminotécnicos
          </motion.p>

          {/* Heading — clamp scales per viewport width with no breakpoint jumps */}
          <motion.h1
            className="font-display font-light text-cream-100 mb-8"
            style={{ lineHeight: '0.97', letterSpacing: '-0.01em' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.75 }}
          >
            <span className="block" style={{ fontSize: 'clamp(42px, 10vw, 110px)' }}>
              Transforme seu
            </span>
            <span className="block" style={{ fontSize: 'clamp(42px, 10vw, 110px)' }}>
              Ambiente com
            </span>
            <span className="block text-gold-gradient font-normal" style={{ fontSize: 'clamp(42px, 10vw, 110px)' }}>
              Iluminação
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="font-body text-cream-300 text-sm md:text-base lg:text-lg font-light leading-relaxed max-w-xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.0 }}
          >
            Projetos luminotécnicos de alto padrão para residências, espaços corporativos e
            ambientes que exigem o máximo em sofisticação e design.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.15 }}
          >
            <button
              onClick={scrollToContact}
              className="btn-luxury bg-gold-300 text-stone-900 px-8 py-4 hover:bg-gold-400 font-medium"
            >
              Solicitar Projeto
            </button>
            <button
              onClick={scrollToCatalog}
              className="btn-luxury border border-cream-300 text-cream-100 px-8 py-4 hover:bg-cream-100/10"
            >
              Ver Catálogo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex items-center gap-8 lg:gap-10 mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.4 }}
          >
            {[
              { value: '500+', label: 'Projetos Realizados' },
              { value: '12', label: 'Anos de Experiência' },
              { value: '100%', label: 'Satisfação' },
            ].map((stat) => (
              <div key={stat.value} className="flex flex-col">
                <span className="font-display text-xl lg:text-2xl text-cream-100 font-light">{stat.value}</span>
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-cream-400 mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToCatalog}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-300 hover:text-cream-100 transition-colors z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3.6 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={18} strokeWidth={1.5} />
        </motion.div>
        <span className="text-[10px] tracking-[0.25em] uppercase">Explorar</span>
      </motion.button>
    </section>
  );
}
