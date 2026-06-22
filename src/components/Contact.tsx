import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Mail, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', interest: 'residencial' });
  const [sent, setSent] = useState(false);

  const handleWhatsApp = () => {
    const msg = `Olá! Me chamo *${form.name}* e tenho interesse em um projeto de iluminação ${form.interest}.\n\nEmail: ${form.email}\n\n${form.message}`;
    window.open(`https://wa.me/553534220999?text=${encodeURIComponent(msg)}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contato" className="py-24 lg:py-32 bg-cream-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-body text-[10px] tracking-[0.35em] uppercase text-gold-400 mb-3">
            Fale Conosco
          </p>
          <h2 className="font-display text-4xl lg:text-5xl text-stone-800 font-light">
            Inicie seu Projeto
          </h2>
          <div className="divider-gold mt-5 mx-auto max-w-32" />
          <p className="font-body text-sm text-stone-500 mt-6 max-w-lg mx-auto leading-relaxed">
            Conte-nos sobre seu projeto e nossa equipe entrará em contato para criar a iluminação perfeita para o seu espaço.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form — 3 cols */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 block mb-1.5">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 bg-cream-100 border border-beige-300 text-stone-700 placeholder-stone-300 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 bg-cream-100 border border-beige-300 text-stone-700 placeholder-stone-300 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 block mb-1.5">
                  Tipo de Projeto
                </label>
                <select
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="w-full px-4 py-3 bg-cream-100 border border-beige-300 text-stone-700 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors appearance-none cursor-pointer"
                >
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="corporativo">Corporativo</option>
                  <option value="hotelaria">Hotelaria</option>
                  <option value="academia/fitness">Academia / Fitness</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 block mb-1.5">
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Conte sobre seu projeto: metragem, ambientes, estilo desejado..."
                  className="w-full px-4 py-3 bg-cream-100 border border-beige-300 text-stone-700 placeholder-stone-300 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleWhatsApp}
                disabled={!form.name || !form.message}
                className="btn-luxury w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {sent ? (
                  'Redirecionando ao WhatsApp...'
                ) : (
                  <>
                    <Send size={15} />
                    Enviar via WhatsApp
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Contact info — 2 cols */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {/* WhatsApp CTA */}
            <div className="p-6 bg-stone-800 text-cream-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 flex items-center justify-center">
                  <MessageCircle size={16} />
                </div>
                <span className="font-display text-lg font-light">WhatsApp Direto</span>
              </div>
              <p className="font-body text-xs text-stone-400 leading-relaxed mb-4">
                Prefere conversar agora? Clique e fale diretamente com nosso especialista.
              </p>
              <a
                href="https://wa.me/553534220999"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury flex items-center justify-center gap-2 bg-green-500 text-white py-3 w-full hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={14} />
                Chamar no WhatsApp
              </a>
            </div>

            {/* Info */}
            <div className="space-y-5">
              {[
                {
                  icon: Phone,
                  label: 'Telefone / WhatsApp',
                  value: '(35) 3422-0999',
                },
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'contato@minaslight.com.br',
                },
                {
                  icon: MapPin,
                  label: 'Atendimento',
                  value: 'Enviamos pra todo Brasil',
                },
              ].map((c) => (
                <div key={c.label} className="flex gap-4">
                  <div className="w-9 h-9 flex-shrink-0 border border-beige-300 flex items-center justify-center">
                    <c.icon size={15} strokeWidth={1.5} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="font-body text-[10px] tracking-[0.15em] uppercase text-stone-400">
                      {c.label}
                    </p>
                    <p className="font-body text-sm text-stone-700 mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="p-5 border border-beige-300">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 mb-3">
                Horário de Atendimento
              </p>
              <div className="space-y-1.5">
                {[
                  { day: 'Segunda a Sexta', time: '08h às 18h' },
                  { day: 'Sábado', time: '09h às 13h' },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between">
                    <span className="font-body text-xs text-stone-500">{h.day}</span>
                    <span className="font-body text-xs text-stone-700">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
