'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import servicesData from '@/data/services.json';
import customersData from '@/data/customers.json';
import { Service, Customer, CartItem } from '@/types';

const services: Service[] = servicesData;
const customers: Customer[] = customersData;

export default function ServicesPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  useEffect(() => {
    // Obtener el cliente del localStorage
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      router.push('/');
      return;
    }

    const foundCustomer = customers.find((c) => c.id === customerId);
    if (foundCustomer) {
      setCustomer(foundCustomer);
    }
  }, [router]);

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [serviceId]: Math.max(1, quantity),
    }));
  };

  const addToCart = (service: Service) => {
    const quantity = quantities[service.id] || 1;
    const existingItem = cart.find((item) => item.service.id === service.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.service.id === service.id
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { service, cantidad: quantity }]);
    }

    // Reset quantity
    setQuantities((prev) => ({ ...prev, [service.id]: 1 }));
  };

  const removeFromCart = (serviceId: string) => {
    setCart(cart.filter((item) => item.service.id !== serviceId));
  };

  const updateCartQuantity = (serviceId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(serviceId);
    } else {
      setCart(
        cart.map((item) =>
          item.service.id === serviceId ? { ...item, cantidad } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.service.precio * item.cantidad,
      0
    );
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      // Guardar el carrito en localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      router.push('/checkout');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('cart');
    router.push('/');
  };

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  const availableServices = services.filter((s) => s.disponible);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Portal de Servicios
              </h1>
              <p className="text-sm text-gray-600">{customer.nombre}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Servicios Disponibles
            </h2>
            <div className="grid gap-4">
              {availableServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {service.nombre}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Código: {service.codigo} | {service.categoria}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {service.descripcion}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-indigo-600">
                        ${service.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-500">por {service.unidad}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      value={quantities[service.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          service.id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => addToCart(service)}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Carrito de Servicios
              </h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  El carrito está vacío
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.service.id}
                        className="border-b border-gray-200 pb-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800 text-sm flex-1">
                            {item.service.nombre}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.service.id)}
                            className="text-red-500 hover:text-red-700 text-sm ml-2"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.service.id,
                                  item.cantidad - 1
                                )
                              }
                              className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.service.id,
                                  item.cantidad + 1
                                )
                              }
                              className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">
                            ${(item.service.precio * item.cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-indigo-600">
                        ${calculateTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Proceder a Facturación
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
