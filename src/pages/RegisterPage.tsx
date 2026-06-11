import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { gsap } from "gsap";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useRegister } from "../hooks/useAuth";
import { useToast } from "../components/ui/Toast";
import bgImage from "../assets/background.jpeg";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const register = useRegister();
  const navigate = useNavigate();
  const toast = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bg-image",
        { scale: 1.06, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out" },
      );
      gsap.fromTo(
        ".reveal-item",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out",
          delay: 0.15,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Введите email";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Некорректный email";
    if (!username.trim()) e.username = "Введите имя пользователя";
    if (!password) e.password = "Введите пароль";
    else if (password.length < 6) e.password = "Минимум 6 символов";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register.mutateAsync({ email, username, password });
      toast.success("Аккаунт создан!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка регистрации");
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen flex items-center justify-center overflow-hidden bg-[#0d0c0b] text-white"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className="bg-image h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,11,10,0.45)_0%,rgba(15,11,10,0.28)_35%,rgba(8,7,6,0.88)_100%)] backdrop-blur-[3px]" />
      </div>

      <div className="z-10 flex w-full max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-10 text-center">
          <h1 className="reveal-item text-3xl font-light tracking-[-0.03em] text-white">
            Создать аккаунт
          </h1>
          <p className="reveal-item mt-2 text-sm text-white/50">
            Присоединяйтесь и начните планировать красиво
          </p>
        </div>

        <div className="reveal-item rounded-4xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              className="bg-white/5 text-white"
            />
            <Input
              label="Имя пользователя"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              autoComplete="username"
              className="bg-white/5 text-white"
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
              className="bg-white/5 text-white"
            />
            <div className="pt-2">
              <Button
                type="submit"
                className="h-12 w-full"
                size="lg"
                loading={register.isPending}
              >
                Зарегистрироваться
              </Button>
            </div>
          </form>
        </div>

        <p className="reveal-item m-40 text-center text-sm text-white/50">
          <Link
            to="/login"
            className="border-b border-white/20 pb-0.5 font-medium text-white transition-colors hover:border-[#d4c6b3]/50 hover:text-[#d4c6b3]"
          >
           Уже есть аккаунт? Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
