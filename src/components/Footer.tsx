import { motion } from 'framer-motion';
import { MessageCircle, Instagram, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#B8945A" strokeWidth="0.8" />
                  <circle cx="12" cy="12" r="4" fill="#B8945A" opacity="0.3" />
                  <circle cx="12" cy="12" r="1.5" fill="#B8945A" />
                </svg>
              </div>
              <span className="font-display text-base tracking-[0.22em] text-cream-100">
                MINAS LIGHT
              </span>
            </div>
            <p className="font-body text-xs leading-relaxed text-stone-500 max-w-xs">
              Projetos de iluminação em tela tensionada com design sofisticado e acabamento impecável.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://wa.me/553534220999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-stone-700 text-stone-500 hover:border-green-500 hover:text-green-500 transition-colors"
              >
                <MessageCircle size={14} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.instagram.com/minas_light/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-stone-700 text-stone-500 hover:border-gold-400 hover:text-gold-400 transition-colors"
              >
                <Instagram size={14} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-stone-600 mb-4">
              Produtos
            </p>
            <ul className="space-y-2.5">
              {['Tela Tensionada', 'Pendentes', 'Lineares', 'Embutidos', 'Decorativos'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
                    className="font-body text-xs text-stone-500 hover:text-stone-300 transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-stone-600 mb-4">
              Serviços
            </p>
            <ul className="space-y-2.5">
              {[
                'Projeto Luminotécnico',
                'Instalação Premium',
                'Consultoria de Luz',
                'Manutenção',
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                    className="font-body text-xs text-stone-500 hover:text-stone-300 transition-colors text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-stone-600 mb-4">
              Contato
            </p>
            <div className="space-y-3">
              <p className="font-body text-xs text-stone-500">(35) 3422-0999</p>
              <p className="font-body text-xs text-stone-500">Pouso Alegre - MG</p>
            </div>
            <a
              href="https://wa.me/553534220999"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury inline-flex items-center gap-2 mt-5 bg-green-600 text-white px-5 py-2.5 hover:bg-green-700 transition-colors text-[10px]"
            >
              <MessageCircle size={12} />
              Solicitar Orçamento
            </a>
          </div>
        </div>

        <div className="divider-gold my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-[10px] tracking-[0.1em] text-stone-600">
            © {new Date().getFullYear()} Minas Light. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-body text-[10px] text-stone-600">
              Iluminação Premium · Design Luminotécnico
            </span>
            <motion.button
              onClick={scrollTop}
              className="w-8 h-8 flex items-center justify-center border border-stone-700 text-stone-500 hover:border-gold-400 hover:text-gold-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              <ArrowUp size={14} strokeWidth={1.5} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
