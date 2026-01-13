'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import customersData from '@/data/customers.json';
import { Customer } from '@/types';

const customers: Customer[] = customersData;

export default function Home() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCustomer) {
      // Guardar el cliente seleccionado en localStorage
      localStorage.setItem('customerId', selectedCustomer);
      // Redirigir a la página de servicios
      router.push('/services');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Portal de Servicios
            </h1>
            <p className="text-gray-600">
              Bienvenido, por favor seleccione su empresa
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="customer"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Seleccione su Empresa
                </label>
                <select
                  id="customer"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                >
                  <option value="">-- Seleccione una empresa --</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCustomer && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Información del Cliente
                  </h3>
                  {customers
                    .filter((c) => c.id === selectedCustomer)
                    .map((customer) => (
                      <div key={customer.id} className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">RFC:</span> {customer.rfc}</p>
                        <p><span className="font-medium">Email:</span> {customer.email}</p>
                        <p><span className="font-medium">Teléfono:</span> {customer.telefono}</p>
                      </div>
                    ))}
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedCustomer}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Acceder al Portal
              </button>
            </form>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Portal conectado a Acumatica ERP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
