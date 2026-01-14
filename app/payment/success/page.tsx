'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BillingDocument } from '@/types';

function SuccessContent() {
  const [billingDoc, setBillingDoc] = useState<BillingDocument | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const billId = searchParams.get('billId');

    if (!billId) {
      router.push('/');
      return;
    }

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

    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  }, [searchParams, router]);

  const handleViewBillingDoc = () => {
    if (billingDoc) {
      router.push(`/billing/${billingDoc.id}`);
    }
  };

  const handleBackToServices = () => {
    router.push('/services');
  };

  const handleGoHome = () => {
    localStorage.removeItem('customerId');
    router.push('/');
  };

  if (!billingDoc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: [
                    '#10b981',
                    '#34d399',
                    '#6ee7b7',
                    '#a7f3d0',
                    '#d1fae5',
                  ][Math.floor(Math.random() * 5)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-scale-in">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-3">
                ¡Pago Exitoso!
              </h1>
              <p className="text-lg text-gray-600">
                Tu transacción ha sido procesada correctamente
              </p>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Detalles de la Transacción
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de Factura:</span>
                  <span className="font-semibold text-gray-800">
                    {billingDoc.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(billingDoc.fecha).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-semibold text-gray-800">
                    {billingDoc.customer.nombre}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-gray-600">Monto Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${billingDoc.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    PAGADO
                  </span>
                </div>
              </div>
            </div>

            {/* Services Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Servicios Contratados
              </h3>
              <div className="space-y-2">
                {billingDoc.items.map((item) => (
                  <div
                    key={item.service.id}
                    className="flex justify-between text-sm py-2 border-b border-gray-100"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.service.nombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ${(item.service.precio * item.cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Confirmation Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">
                    Confirmación Enviada
                  </p>
                  <p className="text-sm text-blue-700">
                    Hemos enviado un comprobante de pago y el documento de
                    facturación a <strong>{billingDoc.customer.email}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleViewBillingDoc}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Ver Documento de Facturación
              </button>

              <button
                onClick={handleBackToServices}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Contratar Más Servicios
              </button>

              <button
                onClick={handleGoHome}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition"
              >
                Cerrar Sesión
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                ¿Necesitas ayuda? Contacta a nuestro equipo de soporte
              </p>
              <p className="text-sm font-semibold text-indigo-600 mt-1">
                soporte@portalservicios.com
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              El documento será procesado en Acumatica ERP automáticamente
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <p className="text-gray-700">Cargando...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
