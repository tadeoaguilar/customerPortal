'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import customersData from '@/data/customers.json';
import { Customer, CartItem, BillingDocument } from '@/types';

const customers: Customer[] = customersData;

export default function CheckoutPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Obtener el cliente y carrito del localStorage
    const customerId = localStorage.getItem('customerId');
    const cartData = localStorage.getItem('cart');

    if (!customerId || !cartData) {
      router.push('/');
      return;
    }

    const foundCustomer = customers.find((c) => c.id === customerId);
    if (foundCustomer) {
      setCustomer(foundCustomer);
    }

    try {
      const parsedCart: CartItem[] = JSON.parse(cartData);
      if (parsedCart.length === 0) {
        router.push('/services');
        return;
      }
      setCart(parsedCart);
    } catch (error) {
      console.error('Error parsing cart:', error);
      router.push('/services');
    }
  }, [router]);

  const calculateSubtotal = () => {
    return cart.reduce(
      (total, item) => total + item.service.precio * item.cantidad,
      0
    );
  };

  const calculateIVA = () => {
    return calculateSubtotal() * 0.16; // 16% IVA
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateIVA();
  };

  const handleConfirmBilling = async () => {
    setIsProcessing(true);

    // Simular proceso de generación de factura
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Crear documento de facturación
    const billingDocument: BillingDocument = {
      id: `BILL-${Date.now()}`,
      fecha: new Date().toISOString(),
      customer: customer!,
      items: cart,
      subtotal: calculateSubtotal(),
      iva: calculateIVA(),
      total: calculateTotal(),
      estado: 'pendiente',
    };

    // Guardar el documento en localStorage (en producción, esto se enviaría a Acumatica)
    const existingBills = JSON.parse(localStorage.getItem('billingDocuments') || '[]');
    existingBills.push(billingDocument);
    localStorage.setItem('billingDocuments', JSON.stringify(existingBills));

    // Limpiar el carrito
    localStorage.removeItem('cart');

    // Redirigir a la página de confirmación
    router.push(`/billing/${billingDocument.id}`);
  };

  const handleBack = () => {
    router.push('/services');
  };

  if (!customer || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Volver
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Confirmación de Facturación
              </h1>
              <p className="text-sm text-gray-600">{customer.nombre}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Información del Cliente
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Empresa:</span>
                  <p className="text-gray-600">{customer.nombre}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">RFC:</span>
                  <p className="text-gray-600">{customer.rfc}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-600">{customer.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Teléfono:</span>
                  <p className="text-gray-600">{customer.telefono}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Dirección:</span>
                  <p className="text-gray-600">{customer.direccion}</p>
                </div>
              </div>
            </div>

            {/* Billing Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Resumen de Facturación
              </h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.service.id}
                    className="flex justify-between items-start border-b border-gray-200 pb-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">
                        {item.service.nombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.cantidad} × ${item.service.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ${(item.service.precio * item.cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-800">
                      ${calculateSubtotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA (16%):</span>
                    <span className="font-medium text-gray-800">
                      ${calculateIVA().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-indigo-600">
                      ${calculateTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Details */}
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Detalle de Servicios
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Servicio
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">
                      Precio Unit.
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.service.id} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-gray-600">
                        {item.service.codigo}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {item.service.nombre}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.service.descripcion}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800">
                        {item.cantidad}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800">
                        ${item.service.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        ${(item.service.precio * item.cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Confirmation Button */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  ¿Confirmar Facturación?
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Al confirmar, se generará un documento de facturación que será procesado en Acumatica ERP
                </p>
              </div>
              <button
                onClick={handleConfirmBilling}
                disabled={isProcessing}
                className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Procesando...' : 'Confirmar Facturación'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
