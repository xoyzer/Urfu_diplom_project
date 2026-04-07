import { useState, useEffect } from 'react';
import { Plus, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

type Product = Database['public']['Tables']['products']['Row'];
type InventoryTransaction = Database['public']['Tables']['inventory_transactions']['Row'] & {
  product: { name: string };
};

export function InventorySection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
    loadTransactions();
  }, []);

  async function loadInventory() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('stock_quantity', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTransactions() {
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select(`
          *,
          product:products(name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data as InventoryTransaction[]);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  const lowStockProducts = products.filter(p => p.stock_quantity < 50);

  if (loading) {
    return <div className="text-center py-12">Загрузка склада...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Складской учет</h1>
          <p className="text-gray-600 mt-2">Остатки продукции и движение товаров</p>
        </div>
        <button className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Добавить приход</span>
        </button>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Package className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Товары с низким остатком</h3>
          </div>
          <div className="space-y-1">
            {lowStockProducts.map(product => (
              <p key={product.id} className="text-sm text-yellow-800">
                {product.name}: {product.stock_quantity} м²
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Остатки на складе</h2>
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    product.stock_quantity < 50 ? 'text-red-600' :
                    product.stock_quantity < 100 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {product.stock_quantity} м²
                  </div>
                  <div className="text-xs text-gray-500">
                    {product.price_per_sqm} ₽/м²
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Последние операции</h2>
          <div className="space-y-3">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className={`mt-1 ${
                  transaction.transaction_type === 'incoming' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.transaction_type === 'incoming' ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.product?.name}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.transaction_type === 'incoming' ? 'Приход' :
                         transaction.transaction_type === 'outgoing' ? 'Расход' : 'Корректировка'}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${
                      transaction.transaction_type === 'incoming' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.quantity > 0 ? '+' : ''}{transaction.quantity} м²
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(transaction.created_at).toLocaleString('ru-RU')}
                  </p>
                  {transaction.notes && (
                    <p className="text-sm text-gray-600 mt-1">{transaction.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Статистика склада</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{products.length}</div>
            <div className="text-sm text-gray-600 mt-1">Наименований</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {products.reduce((sum, p) => sum + p.stock_quantity, 0).toFixed(0)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Общий остаток (м²)</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">{lowStockProducts.length}</div>
            <div className="text-sm text-gray-600 mt-1">Низкий остаток</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">
              {products.reduce((sum, p) => sum + (p.stock_quantity * p.price_per_sqm), 0).toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-gray-600 mt-1">Стоимость склада (₽)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
