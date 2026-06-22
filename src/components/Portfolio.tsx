import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { projects } from '../data/projects';
import { Project } from '../types';

const projectCategories = ['Todos', ...Array.from(new Set(projects.map((p) => p.category)))];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [lightbox, setLightbox] = useState<Project | null>(null);

  const filtered = activeCategory === 'Todos'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projetos" className="py-24 lg:py-32 bg-cream-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body text-[10px] tracking-[0.35em] uppercase text-gold-400 mb-3">
            Portfólio
          </p>
          <h2 className="font-display text-4xl lg:text-5xl text-stone-800 font-light">
            Projetos Realizados
          </h2>
          <div className="divider-gold mt-5 max-w-32" />
        </motion.div>

        {/* Category filters */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {projectCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-[10px] tracking-[0.18em] uppercase font-body transition-all border ${
                activeCategory === cat
                  ? 'bg-stone-800 text-cream-100 border-stone-800'
                  : 'bg-transparent text-stone-500 border-beige-300 hover:border-stone-400 hover:text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry-style grid using CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                className="break-inside-avoid mb-4 group cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                onClick={() => setLightbox(project)}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio:
                      project.span === 'wide'
                        ? '16/9'
                        : project.span === 'tall'
                        ? '3/4'
                        : '1/1',
                  }}
                >
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <span className="font-body text-[9px] tracking-[0.25em] uppercase text-gold-200">
                      {project.category}
                    </span>
                    <h3 className="font-display text-xl text-cream-100 font-light mt-1">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <MapPin size={10} className="text-cream-300" strokeWidth={1.5} />
                      <span className="font-body text-[10px] text-cream-300">{project.location}</span>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="font-body text-[9px] tracking-[0.2em] uppercase bg-cream-100/90 text-stone-700 px-2 py-1">
                      {project.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 lg:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-stone-900/90"
              onClick={() => setLightbox(null)}
            />
            <motion.div
              className="relative z-10 max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center bg-stone-900/80 text-cream-200 hover:text-cream-100"
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              <img
                src={lightbox.image}
                alt={lightbox.title}
                className="w-full max-h-[70vh] object-cover"
              />

              <div className="bg-stone-900 px-8 py-5">
                <span className="font-body text-[9px] tracking-[0.25em] uppercase text-gold-300">
                  {lightbox.category}
                </span>
                <h3 className="font-display text-2xl text-cream-100 font-light mt-1">
                  {lightbox.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <MapPin size={11} className="text-stone-400" strokeWidth={1.5} />
                  <span className="font-body text-xs text-stone-400">{lightbox.location}</span>
                </div>
                <p className="font-body text-xs text-stone-400 leading-relaxed mt-3">
                  {lightbox.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
