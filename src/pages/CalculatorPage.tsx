import { useState, useEffect } from 'react';
import { Calculator, Truck, MapPin, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Product = Database['public']['Tables']['products']['Row'];

interface CalculatorPageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export function CalculatorPage({ onNavigate }: CalculatorPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [deliveryType, setDeliveryType] = useState<'manipulator' | 'truck'>('manipulator');
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name');
    setProducts(data || []);
  }

  const calculateDeliveryCost = () => {
    if (distance === 0) return 0;

    const baseRate = deliveryType === 'manipulator' ? 150 : 120;
    const quantityMultiplier = quantity > 100 ? 1.2 : 1;

    return Math.round(distance * baseRate * quantityMultiplier);
  };

  const productCost = selectedProduct ? selectedProduct.price_per_sqm * quantity : 0;
  const deliveryCost = calculateDeliveryCost();
  const totalCost = productCost + deliveryCost;

  const handleOrder = () => {
    if (!selectedProduct || quantity === 0) return;

    onNavigate('order', {
      product: selectedProduct,
      quantity,
      deliveryType,
      distance,
      productCost,
      deliveryCost,
      totalCost
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <Calculator className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Калькулятор стоимости</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Выберите продукт
              </label>
              <select
                value={selectedProduct?.id || ''}
                onChange={(e) => {
                  const product = products.find(p => p.id === e.target.value);
                  setSelectedProduct(product || null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">-- Выберите продукт --</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.price_per_sqm} ₽/м²
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2"><span className="font-semibold">Категория:</span> {selectedProduct.category}</p>
                <p className="text-sm text-gray-600 mb-2"><span className="font-semibold">Описание:</span> {selectedProduct.description}</p>
                <p className="text-sm text-gray-600"><span className="font-semibold">В наличии:</span> {selectedProduct.stock_quantity} м²</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Количество (м²)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Введите количество в м²"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Тип доставки
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryType('manipulator')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    deliveryType === 'manipulator'
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-300 hover:border-orange-400'
                  }`}
                >
                  <Truck className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div className="font-semibold">Манипулятор</div>
                  <div className="text-sm text-gray-600">150 ₽/км</div>
                </button>
                <button
                  onClick={() => setDeliveryType('truck')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    deliveryType === 'truck'
                      ? 'border-orange-600 bg-orange-50'
                      : 'border-gray-300 hover:border-orange-400'
                  }`}
                >
                  <Truck className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div className="font-semibold">Фура</div>
                  <div className="text-sm text-gray-600">120 ₽/км</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Расстояние до места доставки (км)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Введите расстояние в км"
              />
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border-2 border-orange-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Расчет стоимости</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Стоимость материала:</span>
                  <span className="font-semibold">{productCost.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Стоимость доставки:</span>
                  <span className="font-semibold">{deliveryCost.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="border-t-2 border-orange-300 pt-2 mt-2 flex justify-between text-xl font-bold text-orange-700">
                  <span>Итого:</span>
                  <span>{totalCost.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={!selectedProduct || quantity === 0}
              className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-lg font-semibold"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Оформить заявку</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
