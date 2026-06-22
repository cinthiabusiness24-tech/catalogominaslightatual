import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginProps {
  navigate: (to: string) => void;
}

export default function Login({ navigate }: LoginProps) {
  const { signIn, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError('Email ou senha inválidos. Verifique suas credenciais.');
    } else {
      navigate('/admin');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await resetPassword(email);
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-beige-200 opacity-60" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-beige-200 opacity-40" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-8">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" stroke="#B8945A" strokeWidth="1" />
                <circle cx="16" cy="16" r="5" fill="#B8945A" opacity="0.3" />
                <circle cx="16" cy="16" r="2" fill="#B8945A" />
              </svg>
            </div>
            <span className="font-display text-2xl tracking-[0.22em] text-stone-700">
              MINAS LIGHT
            </span>
          </div>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-stone-400">
            Painel Administrativo
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-beige-200 shadow-sm p-8">
          {mode === 'login' ? (
            <>
              <h1 className="font-display text-2xl text-stone-800 font-light mb-1">
                Bem-vindo de volta
              </h1>
              <p className="font-body text-xs text-stone-400 mb-8">
                Entre com suas credenciais para acessar o painel.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@minaslight.com.br"
                    className="w-full px-4 py-3 bg-cream-100 border border-beige-300 text-stone-700 placeholder-stone-300 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 block mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 bg-cream-100 border border-beige-300 text-stone-700 placeholder-stone-300 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPwd ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    className="font-body text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-luxury w-full flex items-center justify-center gap-2.5 bg-stone-800 text-cream-100 py-3.5 hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-cream-300 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={14} strokeWidth={1.5} />
                      Entrar no Painel
                    </>
                  )}
                </button>
              </form>

              <button
                onClick={() => { setMode('reset'); setError(''); }}
                className="mt-5 w-full font-body text-xs text-stone-400 hover:text-stone-600 text-center transition-colors"
              >
                Esqueci minha senha
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="flex items-center gap-1.5 font-body text-xs text-stone-400 hover:text-stone-700 mb-6 transition-colors"
              >
                <ArrowLeft size={13} strokeWidth={1.5} /> Voltar ao login
              </button>

              <h1 className="font-display text-2xl text-stone-800 font-light mb-1">
                Recuperar senha
              </h1>
              <p className="font-body text-xs text-stone-400 mb-8">
                Enviaremos um link de recuperação para seu email.
              </p>

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@minaslight.com.br"
                    className="w-full px-4 py-3 bg-cream-100 border border-beige-300 text-stone-700 placeholder-stone-300 font-body text-sm focus:outline-none focus:border-gold-300 transition-colors"
                  />
                </div>

                {error && (
                  <p className="font-body text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="font-body text-xs text-green-600 bg-green-50 border border-green-100 px-3 py-2">
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-luxury w-full bg-stone-800 text-cream-100 py-3.5 hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center font-body text-[10px] text-stone-400 mt-6">
          © {new Date().getFullYear()} Minas Light — Acesso restrito
        </p>
      </motion.div>
    </div>
  );
}
