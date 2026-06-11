import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import { gsap } from "gsap"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { authApi } from "../api/auth"
import { useRegister } from "../hooks/useAuth"
import { useToast } from "../components/ui/Toast"
import { getTelegramWebAppInfo } from "../utils/telegram"
import bgImage from "../assets/background.jpeg"
import logo from "../assets/logo.png"

export function RegisterPage() {
	const [email, setEmail] = useState("")
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [errors, setErrors] = useState<Record<string, string>>({})
	const register = useRegister()
	const navigate = useNavigate()
	const toast = useToast()
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				".bg-image",
				{ scale: 1.03, opacity: 0 },
				{ scale: 1, opacity: 1, duration: 1.15, ease: "power3.out" },
			)
			gsap.fromTo(
				".reveal-item",
				{ y: 16, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.75,
					stagger: 0.06,
					ease: "power3.out",
					delay: 0.08,
				},
			)
		}, containerRef)

		return () => ctx.revert()
	}, [])

	const validate = () => {
		const e: Record<string, string> = {}
		if (!email) e.email = "Введите email"
		else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Некорректный email"
		if (!username.trim()) e.username = "Введите имя пользователя"
		if (!password) e.password = "Введите пароль"
		else if (password.length < 6) e.password = "Минимум 6 символов"
		setErrors(e)
		return Object.keys(e).length === 0
	}

	const linkTelegramIfAvailable = async () => {
		const payload = getTelegramWebAppInfo()
		if (!payload) return

		try {
			await authApi.linkTelegram(payload)
		} catch (err) {
			console.warn("Не удалось связать Telegram-профиль:", err)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validate()) return

		try {
			await register.mutateAsync({ email, username, password })
			await linkTelegramIfAvailable()
			toast.success("Аккаунт создан!")
			navigate("/dashboard")
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Ошибка регистрации",
			)
		}
	}

	return (
		<div
			ref={containerRef}
			className='relative min-h-screen overflow-hidden bg-[#0c0b0a] text-white'
		>
			<div className='absolute inset-0 z-0'>
				<img
					src={bgImage}
					alt='Background'
					className='bg-image h-full w-full object-cover'
				/>
				<div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.44)_0%,rgba(12,10,9,0.34)_40%,rgba(7,6,5,0.90)_100%)]' />
			</div>

			<div className='relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6'>
				<div className='w-full max-w-105'>
					<div className='rounded-[30px] border border-white/8 bg-white/5 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.30)] backdrop-blur-2xl'>
						<div className='rounded-[28px] border border-white/10 bg-[rgba(20,18,16,0.78)] px-6 py-7 sm:px-8 sm:py-9'>
							<div className='reveal-item mb-7 flex items-center gap-3'>
								<div className='flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'>
									<img
										src={logo}
										alt='logo'
										className='h-15 w-15 rounded-2xl'
									/>
								</div>

								<div className='min-w-0'>
									<p className='text-[15px] font-semibold leading-none text-white'>
										Planner
									</p>
									<p className='mt-1 text-[12px] leading-none text-white/45'>
										Начните планировать свои цели красиво
										и эффективно
									</p>
								</div>
							</div>

							<div className='mb-7 text-center sm:mb-8'>
								<h1 className='reveal-item text-[24px] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[30px]'>
									Создать аккаунт
								</h1>
								<p className='reveal-item mx-auto mt-3 max-w-[320px] text-[14px] leading-6 text-white/55'>
									Присоединяйтесь и начните планировать
									красиво
								</p>
							</div>

							<form
								onSubmit={handleSubmit}
								className='reveal-item space-y-4'
								noValidate
							>
								<Input
									label='Email'
									type='email'
									placeholder='you@example.com'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									error={errors.email}
									autoComplete='email'
									className='h-12 rounded-[18px] border-white/10 bg-white/4 text-white placeholder:text-white/28'
								/>

								<Input
									label='Имя пользователя'
									placeholder='username'
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									error={errors.username}
									autoComplete='username'
									className='h-12 rounded-[18px] border-white/10 bg-white/4 text-white placeholder:text-white/28'
								/>

								<Input
									label='Пароль'
									type='password'
									placeholder='Минимум 6 символов'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									error={errors.password}
									autoComplete='new-password'
									className='h-12 rounded-[18px] border-white/10 bg-white/4 text-white placeholder:text-white/28'
								/>

								<div className='pt-2'>
									<Button
										type='submit'
										className='h-12 w-full rounded-[18px]'
										size='lg'
										loading={register.isPending}
									>
										Зарегистрироваться
									</Button>
								</div>
							</form>

							<div className='reveal-item mt-7 border-t border-white/8 pt-5 text-center sm:mt-8'>
								<p className='text-[14px] leading-6 text-white/48'>
									Уже есть аккаунт?{" "}
									<Link
										to='/login'
										className='font-medium text-white transition-colors hover:text-[#d7c8b5]'
									>
										Войти
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
