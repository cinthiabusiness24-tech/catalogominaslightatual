import { motion } from 'framer-motion';
import { Award, Lightbulb, Layers, Users } from 'lucide-react';

const pillars = [
  {
    icon: Lightbulb,
    title: 'Projeto Luminotécnico',
    desc: 'Desenvolvemos projetos de iluminação sob medida com estudo de ambientes, paleta de luz e integração arquitetural.',
  },
  {
    icon: Layers,
    title: 'Tela Tensionada LED',
    desc: 'Projetos de iluminação em tela tensionada com design sofisticado e acabamento impecável.',
  },
  {
    icon: Award,
    title: 'Alto Padrão',
    desc: 'Utilizamos materiais de primeira linha e componentes europeus para garantir qualidade incomparável e longevidade.',
  },
  {
    icon: Users,
    title: 'Atendimento Premium',
    desc: 'Acompanhamento completo do projeto, desde a concepção até a instalação e pós-venda exclusivo.',
  },
];

export default function About() {
  return (
    <section id="sobre" className="py-24 lg:py-32 bg-stone-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-[10px] tracking-[0.35em] uppercase text-gold-300 mb-4">
              Sobre a Minas Light
            </p>
            <h2 className="font-display text-4xl lg:text-5xl text-cream-100 font-light leading-tight">
              Onde a Luz<br />
              <span className="italic text-gold-gradient">encontra a Arte.</span>
            </h2>
            <div className="divider-gold mt-6 max-w-24" />
            <p className="font-body text-stone-300 text-sm leading-relaxed mt-8">
              A Minas Light nasceu da paixão pela iluminação como elemento transformador de espaços. Com mais de 12 anos de experiência, somos referência em iluminação em tela tensionada e projetos luminotécnicos de alto padrão em Minas Gerais e em todo o Brasil.
            </p>
            <p className="font-body text-stone-400 text-sm leading-relaxed mt-4">
              Nossa equipe une expertise técnica em luminotécnica com sensibilidade estética, criando projetos que elevam a percepção de qualquer ambiente — de residências exclusivas a grandes espaços corporativos.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-stone-700">
              {[
                { n: '500+', l: 'Projetos' },
                { n: '12', l: 'Anos' },
                { n: '100%', l: 'Dedicação' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-3xl text-gold-300 font-light">{s.n}</p>
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 mt-1">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                className="p-6 bg-stone-700/50 border border-stone-700 hover:border-gold-400/40 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="w-10 h-10 flex items-center justify-center border border-gold-400/30 mb-4">
                  <p.icon size={18} strokeWidth={1} className="text-gold-300" />
                </div>
                <h3 className="font-display text-lg text-cream-200 font-light">{p.title}</h3>
                <p className="font-body text-xs text-stone-400 leading-relaxed mt-2">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
