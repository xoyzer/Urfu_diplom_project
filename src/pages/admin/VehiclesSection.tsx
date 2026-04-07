import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type Delivery = Database['public']['Tables']['deliveries']['Row'] & { order: { order_number: string } };

export function VehiclesSection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadVehicles();
    loadDeliveries();
  }, [selectedDate]);

  async function loadVehicles() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('name');

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadDeliveries() {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          *,
          order:orders(order_number)
        `)
        .eq('scheduled_date', selectedDate)
        .order('scheduled_date');

      if (error) throw error;
      setDeliveries(data as Delivery[]);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    }
  }

  if (loading) {
    return <div className="text-center py-12">Загрузка транспорта...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление транспортом</h1>
          <p className="text-gray-600 mt-2">Автопарк и график доставок</p>
        </div>
        <button className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Добавить транспорт</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Автопарк</h2>
          <div className="space-y-4">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      vehicle.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {vehicle.type} • {vehicle.license_plate} • Грузоподъемность: {vehicle.capacity}т
                  </p>
                </div>
                <button className="text-orange-600 hover:text-orange-800">
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">График доставок</h2>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {deliveries.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              Нет запланированных доставок на выбранную дату
            </div>
          ) : (
            <div className="space-y-3">
              {deliveries.map(delivery => {
                const vehicle = vehicles.find(v => v.id === delivery.vehicle_id);
                return (
                  <div key={delivery.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Заказ: {delivery.order?.order_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          Транспорт: {vehicle?.name || 'Не назначен'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        delivery.status === 'Выполнена' ? 'bg-green-100 text-green-800' :
                        delivery.status === 'В пути' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {delivery.status}
                      </span>
                    </div>
                    {delivery.driver_notes && (
                      <p className="text-sm text-gray-600 mt-2">{delivery.driver_notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Статистика использования транспорта</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">{vehicles.filter(v => v.is_active).length}</div>
            <div className="text-sm text-gray-600 mt-1">Активных единиц</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{deliveries.filter(d => d.status === 'В пути').length}</div>
            <div className="text-sm text-gray-600 mt-1">Доставок в пути</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{deliveries.filter(d => d.status === 'Выполнена').length}</div>
            <div className="text-sm text-gray-600 mt-1">Выполнено сегодня</div>
          </div>
        </div>
      </div>
    </div>
  );
}
