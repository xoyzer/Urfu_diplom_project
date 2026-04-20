import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CatalogPage } from './pages/CatalogPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ContactsPage } from './pages/ContactsPage';
import { OrderFormPage } from './pages/OrderFormPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

interface OrderData {
  product: { id: string; name: string; price_per_sqm: number };
  quantity: number;
  deliveryType: string;
  distance: number;
  productCost: number;
  deliveryCost: number;
  totalCost: number;
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [orderData, setOrderData] = useState<OrderData | undefined>();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const handleNavigate = (page: string, data?: OrderData) => {
    setCurrentPage(page);
    if (data) setOrderData(data);
  };

  const handleCalculatorResult = (data: OrderData) => {
    setOrderData(data);
    setCurrentPage('order-form');
  };

  const isAdminPage = currentPage === 'admin' || currentPage === 'login';

  return (
    <div className="min-h-screen bg-white">
      {!isAdminPage && <Header onNavigate={handleNavigate} />}

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'catalog' && <CatalogPage onNavigate={handleNavigate} />}
      {currentPage === 'calculator' && <CalculatorPage onNavigate={handleCalculatorResult} />}
      {currentPage === 'contacts' && <ContactsPage />}
      {currentPage === 'order-form' && <OrderFormPage orderData={orderData} onNavigate={handleNavigate} />}
      {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === 'admin' && user ? <AdminDashboard /> : null}

      {currentPage === 'admin' && !user && <LoginPage onNavigate={handleNavigate} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
