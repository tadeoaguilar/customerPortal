'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BillingDocument } from '@/types';

export default function BillingDocumentPage() {
  const [billingDoc, setBillingDoc] = useState<BillingDocument | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const billId = params.id as string;
    const billingDocuments = JSON.parse(
      localStorage.getItem('billingDocuments') || '[]'
    );

    const foundDoc = billingDocuments.find(
      (doc: BillingDocument) => doc.id === billId
    );

    if (foundDoc) {
      setBillingDoc(foundDoc);
    } else {
      router.push('/');
    }
  }, [params.id, router]);

  const handleBackToServices = () => {
    router.push('/services');
  };

  const handlePrintDocument = () => {
    window.print();
  };

  if (!billingDoc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Documento de Facturación
            </h1>
            <div className="flex gap-4">
              <button
                onClick={handlePrintDocument}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Imprimir / PDF
              </button>
              <button
                onClick={handleBackToServices}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Volver a Servicios
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 print:hidden">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-green-800">
                  ¡Facturación Confirmada!
                </h2>
                <p className="text-sm text-green-700 mt-1">
                  Su documento de facturación ha sido generado exitosamente y será procesado en Acumatica ERP
                </p>
              </div>
            </div>
          </div>

          {/* Billing Document */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Document Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    DOCUMENTO DE FACTURACIÓN
                  </h1>
                  <p className="text-gray-600">
                    Portal de Servicios - Acumatica ERP
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Folio:</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {billingDoc.id}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Fecha:</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(billingDoc.fecha)}
                  </p>
                  <div className="mt-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        billingDoc.estado === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : billingDoc.estado === 'pagado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {billingDoc.estado.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                Datos del Cliente
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Razón Social</p>
                  <p className="font-medium text-gray-800">
                    {billingDoc.customer.nombre}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">RFC</p>
                  <p className="font-medium text-gray-800">
                    {billingDoc.customer.rfc}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">
                    {billingDoc.customer.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Teléfono</p>
                  <p className="font-medium text-gray-800">
                    {billingDoc.customer.telefono}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-600">Dirección</p>
                  <p className="font-medium text-gray-800">
                    {billingDoc.customer.direccion}
                  </p>
                </div>
              </div>
            </div>

            {/* Services Table */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                Servicios Contratados
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
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
                        Importe
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingDoc.items.map((item, index) => (
                      <tr
                        key={item.service.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
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

            {/* Totals */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-800">
                      ${billingDoc.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA (16%):</span>
                    <span className="font-medium text-gray-800">
                      ${billingDoc.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-3">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-indigo-600">
                      ${billingDoc.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Este documento será procesado en el sistema Acumatica ERP.
                Recibirá una notificación por correo electrónico cuando el proceso se complete.
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">
                Para cualquier duda o aclaración, por favor contacte a su ejecutivo de cuenta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
