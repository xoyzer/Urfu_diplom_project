import { useState, useEffect } from 'react';
import { Plus, Phone, MessageSquare, Calendar, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];

const ORDER_STATUSES = ['Новый', 'В обработке', 'Согласован', 'Доставляется', 'Выполнен', 'Отменен'];

export function OrdersSection() {
  const [orders, setOrders] = useState<(Order & { customer: Customer })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as (Order & { customer: Customer })[]);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      await supabase
        .from('order_history')
        .insert({
          order_id: orderId,
          action_type: 'status_change',
          new_status: newStatus,
          comment: `Статус изменен на: ${newStatus}`
        });

      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Новый': 'bg-blue-100 text-blue-800',
      'В обработке': 'bg-yellow-100 text-yellow-800',
      'Согласован': 'bg-green-100 text-green-800',
      'Доставляется': 'bg-purple-100 text-purple-800',
      'Выполнен': 'bg-gray-100 text-gray-800',
      'Отменен': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-12">Загрузка заказов...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление заказами</h1>
          <p className="text-gray-600 mt-2">Все заказы с сайта и по телефону</p>
        </div>
        <button
          onClick={() => setShowAddOrder(true)}
          className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Добавить заказ (звонок)</span>
        </button>
      </div>

      <div className="mb-6 flex space-x-2 overflow-x-auto">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            selectedStatus === 'all'
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Все ({orders.length})
        </button>
        {ORDER_STATUSES.map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedStatus === status
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status} ({orders.filter(o => o.status === status).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Номер</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Клиент</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Телефон</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Сумма</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Источник</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Дата</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.order_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.customer?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order.customer?.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {order.total_amount.toLocaleString('ru-RU')} ₽
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded ${
                    order.source === 'website' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {order.source === 'website' ? 'Сайт' : 'Телефон'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                  >
                    {ORDER_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="text-orange-600 hover:text-orange-800">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
