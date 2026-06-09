import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { gsap } from 'gsap'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useLogin } from '../hooks/useAuth'
import { useToast } from '../components/ui/Toast'

// Укажите правильный путь к вашему изображению (например, если оно в src/assets)
import bgImage from '../assets/login_.png' 

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const login = useLogin()
  const navigate = useNavigate()
  const toast = useToast()
  
  // Реф для контекста GSAP
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Плавный зум и проявление фона
      gsap.fromTo('.bg-image',
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
      )

      // 2. Каскадное (stagger) появление элементов интерфейса
      gsap.fromTo('.reveal-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.2 }
      )
    }, containerRef)

    return () => ctx.revert() // Очистка при размонтировании
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email) e.email = 'Введите email'
    if (!password) e.password = 'Введите пароль'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await login.mutateAsync({ email, password })
      navigate('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка входа')
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#0d0c0b]">
      
      {/* Фон и градиентный оверлей */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Atmospheric Background"
          className="bg-image w-full h-full object-cover"
        />
        {/* Оверлей делает фон темнее и добавляет легкий блюр для читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1412]/60 via-[#1a1412]/40 to-[#0a0807]/90 backdrop-blur-[4px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
        
        {/* Логотип и заголовки */}
        <div className="text-center mb-10 flex flex-col items-center w-full">
          <div className="reveal-item flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-white/5 border border-white/10 backdrop-blur-lg mb-6 shadow-2xl">
            <svg viewBox="0 0 28 28" className="w-8 h-8" fill="none">
              <rect x="4" y="6" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.9)"/>
              <rect x="4" y="13" width="15" height="2.5" rx="1.25" fill="rgba(255,255,255,0.9)"/>
              <rect x="4" y="19" width="17" height="2.5" rx="1.25" fill="rgba(255,255,255,0.9)"/>
            </svg>
          </div>
          <h1 className="reveal-item text-3xl font-light text-white tracking-wide mb-2">
            Добро пожаловать
          </h1>
          <p className="reveal-item text-sm text-white/50 font-light">
            Войдите в свой аккаунт для продолжения
          </p>
        </div>

        {/* Форма с эффектом Glassmorphism */}
        <div className="reveal-item w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="reveal-item">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={errors.email}
                autoComplete="email"
                // Если ваш компонент Input поддерживает прокидывание className
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
              />
            </div>
            <div className="reveal-item">
              <Input
                label="Пароль"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="current-password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
              />
            </div>
            <div className="reveal-item pt-4">
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-300 rounded-xl h-12 text-base font-medium"
                size="lg"
                loading={login.isPending}
              >
                Войти
              </Button>
            </div>
          </form>
        </div>

        {/* Ссылка на регистрацию */}
        <p className="reveal-item text-center text-sm text-white/50 mt-8 font-light">
          Нет аккаунта?{' '}
          <Link 
            to="/register" 
            className="text-white hover:text-[#d4c6b3] font-medium transition-colors border-b border-white/20 hover:border-[#d4c6b3]/50 pb-0.5"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}