"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const onStart = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-light tracking-tighter">FinTrack</div>
          <div className="hidden md:flex space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <a href="#features" className="hover:text-black transition-colors">
              Можливості
            </a>
            <a
              href="#philosophy"
              className="hover:text-black transition-colors"
            >
              Філософія
            </a>
            <a href="#pricing" className="hover:text-black transition-colors">
              Вартість
            </a>
          </div>
          <button
            onClick={onStart}
            className="px-5 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
          >
            Вхід
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 animate-fade-in">
            Нове покоління обліку
          </div>
          <h1 className="text-5xl md:text-8xl font-light tracking-tight text-gray-900 leading-[1.05]">
            Ваші гроші заслуговують <br className="hidden md:block" />
            на <span className="italic font-normal">прозорість.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-light leading-relaxed">
            FinTrack — це не просто трекер витрат. Це ваш персональний
            фінансовий архітектор, що використовує ШІ для досягнення ваших
            цілей.
          </p>
          <div className="pt-6">
            <button
              onClick={onStart}
              className="group relative inline-flex items-center px-10 py-5 bg-black text-white rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 font-medium tracking-wide">
                Почати безкоштовно
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <p className="mt-4 text-[10px] text-gray-300 uppercase tracking-widest">
              Банківська карта не потрібна
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-12 border-y border-gray-50 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-2xl font-light text-gray-900">10k+</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
              Користувачів
            </p>
          </div>
          <div>
            <p className="text-2xl font-light text-gray-900">₴1.2B</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
              Відстежено
            </p>
          </div>
          <div>
            <p className="text-2xl font-light text-gray-900">99.9%</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
              Uptime
            </p>
          </div>
          <div>
            <p className="text-2xl font-light text-gray-900">4.9/5</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
              Рейтинг
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 md:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-tight">
                Штучний інтелект <br />
                на варті ваших заощаджень.
              </h2>
              <p className="text-gray-500 font-light leading-relaxed text-lg">
                Наша система аналізує кожну транзакцію в реальному часі. Ми не
                просто показуємо графіки — ми даємо конкретні поради, як закрити
                кредит швидше або відкласти на мрію.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Автоматичне категорування витрат",
                  "Персоналізовані ШІ-інсайти від Gemini",
                  "Прогнозування балансу на кінець місяця",
                  "Розумні сповіщення про ��еревищення бюджету",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center space-x-3 text-sm text-gray-600"
                  >
                    <svg
                      className="w-5 h-5 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gray-100 aspect-square rounded-3xl overflow-hidden shadow-2xl transition-transform hover:rotate-1">
                <div className="absolute inset-8 bg-white rounded-2xl shadow-sm p-6 space-y-6">
                  <div className="h-4 w-1/3 bg-gray-50 rounded"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-50 rounded-xl"></div>
                    <div className="h-20 bg-gray-50 rounded-xl"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-50 rounded"></div>
                    <div className="h-2 w-full bg-gray-50 rounded"></div>
                    <div className="h-2 w-2/3 bg-gray-50 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 bg-black text-white px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-6xl font-light tracking-tight">
            Менше цифр — більше сенсу.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed italic">
            &ldquo;Ми віримо, що фінансова свобода починається з відмови від
            складності. Леджер спроєктований так, щоб ви витрачали не більше 2
            хвилин на день на облік, отримуючи 100% контролю.&rdquo;
          </p>
          <div className="pt-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
              — Команда FinTrack
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-40 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight">
              Чесна ціна.
            </h2>
            <p className="text-gray-500 font-light">
              Ми заробляємо на підписці, а не на ваших даних.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 border border-gray-100 rounded-3xl text-left space-y-6 hover:border-gray-200 transition-colors">
              <h3 className="text-xl font-medium text-gray-900">Basic</h3>
              <p className="text-4xl font-light">
                ₴0 <span className="text-lg text-gray-300">/ міс</span>
              </p>
              <ul className="space-y-3 text-sm text-gray-500 font-light">
                <li>Обмеження 50 транзакцій</li>
                <li>Базові категорії</li>
                <li>Локальне сховище</li>
              </ul>
              <button
                onClick={onStart}
                className="w-full py-3 border border-gray-100 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
              >
                Обрати
              </button>
            </div>
            <div className="p-10 bg-black text-white rounded-3xl text-left space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-4 right-4 bg-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                Popular
              </div>
              <h3 className="text-xl font-medium">Premium</h3>
              <p className="text-4xl font-light">
                ₴199 <span className="text-lg text-gray-600">/ міс</span>
              </p>
              <ul className="space-y-3 text-sm text-gray-400 font-light">
                <li>Безліміт транзакцій</li>
                <li>ШІ-поради від Gemini</li>
                <li>Синхронізація хмари</li>
                <li>Підтримка 24/7</li>
              </ul>
              <button
                onClick={onStart}
                className="w-full py-3 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Почати тріал
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-50 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="text-2xl font-light tracking-tighter">FinTrack</div>
            <p className="max-w-xs text-sm text-gray-400 font-light leading-relaxed">
              Інструмент для усвідомленого керування фінансами. Розроблено з
              любов&apos;ю до деталей та приватності.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
              Продукт
            </h4>
            <nav className="flex flex-col space-y-2 text-sm text-gray-400 font-light">
              <a href="#" className="hover:text-black transition-colors">
                Додаток
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Веб-версія
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Можливості
              </a>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
              Правова інформація
            </h4>
            <nav className="flex flex-col space-y-2 text-sm text-gray-400 font-light">
              <a href="#" className="hover:text-black transition-colors">
                Приватність
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Умови використання
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Cookies
              </a>
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-300 uppercase tracking-[0.2em]">
          <span>© 2026 FinTrack. Всі права захищено.</span>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-black transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-black transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
