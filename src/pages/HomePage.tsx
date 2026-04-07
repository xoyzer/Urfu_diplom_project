import { Package, Truck, Calculator, ShieldCheck } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-700 text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Тротуарная плитка и бордюры
            </h1>
            <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
              Широкий ассортимент качественной продукции с доставкой по всему региону
            </p>
            <button
              onClick={() => onNavigate('catalog')}
              className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg"
            >
              Смотреть каталог
            </button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Package className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Большой ассортимент</h3>
              <p className="text-gray-600">Более 100 видов брусчатки и бордюров</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Гарантия качества</h3>
              <p className="text-gray-600">Вся продукция сертифицирована</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Быстрая доставка</h3>
              <p className="text-gray-600">Доставка манипулятором и фурой</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Calculator className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Калькулятор расчета</h3>
              <p className="text-gray-600">Рассчитайте стоимость онлайн</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Популярные категории</h2>
            <p className="text-lg text-gray-600">Выберите подходящий вариант для вашего проекта</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('catalog')}>
              <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-400"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Брусчатка</h3>
                <p className="text-gray-600">Различные формы и цвета для любых задач</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('catalog')}>
              <div className="h-48 bg-gradient-to-br from-gray-400 to-gray-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Бордюры</h3>
                <p className="text-gray-600">Надежное ограждение для дорожек</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('catalog')}>
              <div className="h-48 bg-gradient-to-br from-gray-500 to-gray-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Плитка</h3>
                <p className="text-gray-600">Декоративные решения для вашего участка</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы сделать заказ?</h2>
          <p className="text-xl mb-8 text-orange-100">Рассчитайте стоимость и оформите заявку прямо сейчас</p>
          <button
            onClick={() => onNavigate('calculator')}
            className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg"
          >
            Перейти к калькулятору
          </button>
        </div>
      </section>
    </div>
  );
}
