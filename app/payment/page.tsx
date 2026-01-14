'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import customersData from '@/data/customers.json';
import { Customer, CartItem, BillingDocument } from '@/types';

const customers: Customer[] = customersData;

type PaymentMethod = 'card' | 'transfer' | 'oxxo' | 'paypal';

export default function PaymentPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Card form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  const router = useRouter();

  useEffect(() => {
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
    return calculateSubtotal() * 0.16;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateIVA();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\//g, '').length <= 4) {
      setCardExpiry(formatted);
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCardCVV(value);
    }
  };

  const validateCardPayment = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Por favor ingrese un número de tarjeta válido (16 dígitos)');
      return false;
    }
    if (!cardName.trim()) {
      alert('Por favor ingrese el nombre del titular');
      return false;
    }
    if (cardExpiry.replace(/\//g, '').length !== 4) {
      alert('Por favor ingrese una fecha de expiración válida (MM/AA)');
      return false;
    }
    if (cardCVV.length < 3) {
      alert('Por favor ingrese un CVV válido');
      return false;
    }
    return true;
  };

  const simulatePaymentProcessing = async () => {
    setProcessingStep('Validando información de pago...');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setProcessingStep('Conectando con el banco...');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setProcessingStep('Procesando transacción...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessingStep('Confirmando pago...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handlePayment = async () => {
    // Validate based on payment method
    if (paymentMethod === 'card') {
      if (!validateCardPayment()) {
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await simulatePaymentProcessing();

      // Create billing document
      const billingDocument: BillingDocument = {
        id: `BILL-${Date.now()}`,
        fecha: new Date().toISOString(),
        customer: customer!,
        items: cart,
        subtotal: calculateSubtotal(),
        iva: calculateIVA(),
        total: calculateTotal(),
        estado: 'pagado', // Mark as paid
      };

      // Save billing document
      const existingBills = JSON.parse(
        localStorage.getItem('billingDocuments') || '[]'
      );
      existingBills.push(billingDocument);
      localStorage.setItem('billingDocuments', JSON.stringify(existingBills));

      // Save payment info
      const paymentInfo = {
        billingId: billingDocument.id,
        method: paymentMethod,
        fecha: new Date().toISOString(),
        monto: calculateTotal(),
        ...(paymentMethod === 'card' && {
          lastFourDigits: cardNumber.slice(-4),
        }),
      };

      const existingPayments = JSON.parse(
        localStorage.getItem('payments') || '[]'
      );
      existingPayments.push(paymentInfo);
      localStorage.setItem('payments', JSON.stringify(existingPayments));

      // Clear cart
      localStorage.removeItem('cart');

      // Redirect to success page
      router.push(`/payment/success?billId=${billingDocument.id}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      setIsProcessing(false);
      alert('Error al procesar el pago. Por favor intente nuevamente.');
    }
  };

  const handleBack = () => {
    router.push('/checkout');
  };

  if (!customer || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Procesando Pago
              </h3>
              <p className="text-gray-800">{processingStep}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              disabled={isProcessing}
              className="text-gray-700 hover:text-gray-900 disabled:opacity-50"
            >
              ← Volver
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Pasarela de Pagos
              </h1>
              <p className="text-sm text-gray-800">{customer.nombre}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Método de Pago
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    disabled={isProcessing}
                    className={`p-4 border-2 rounded-lg transition ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    } disabled:opacity-50`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💳</div>
                      <p className="text-sm font-semibold text-gray-800">Tarjeta</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('transfer')}
                    disabled={isProcessing}
                    className={`p-4 border-2 rounded-lg transition ${
                      paymentMethod === 'transfer'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    } disabled:opacity-50`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏦</div>
                      <p className="text-sm font-semibold text-gray-800">Transferencia</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('oxxo')}
                    disabled={isProcessing}
                    className={`p-4 border-2 rounded-lg transition ${
                      paymentMethod === 'oxxo'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    } disabled:opacity-50`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🏪</div>
                      <p className="text-sm font-semibold text-gray-800">OXXO</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    disabled={isProcessing}
                    className={`p-4 border-2 rounded-lg transition ${
                      paymentMethod === 'paypal'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    } disabled:opacity-50`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💰</div>
                      <p className="text-sm font-semibold text-gray-800">PayPal</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="bg-white rounded-lg shadow p-6">
                {paymentMethod === 'card' && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Información de la Tarjeta
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Número de Tarjeta
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          disabled={isProcessing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Nombre del Titular
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          placeholder="JUAN PÉREZ"
                          disabled={isProcessing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder:text-gray-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Fecha de Expiración
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/AA"
                            disabled={isProcessing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardCVV}
                            onChange={handleCVVChange}
                            placeholder="123"
                            disabled={isProcessing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 placeholder:text-gray-500"
                          />
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">Modo Demo:</span> Use
                          cualquier número de tarjeta válido (16 dígitos) para
                          probar.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'transfer' && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Datos para Transferencia Bancaria
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Banco:</p>
                        <p className="font-semibold text-gray-900">
                          BBVA Bancomer
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          Número de Cuenta:
                        </p>
                        <p className="font-semibold text-gray-900">
                          0123456789
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">CLABE:</p>
                        <p className="font-semibold text-gray-900">
                          012345678901234567
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Beneficiario:</p>
                        <p className="font-semibold text-gray-900">
                          Portal de Servicios S.A. de C.V.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Referencia:</p>
                        <p className="font-semibold text-gray-900">
                          {customer.id}-{Date.now().toString().slice(-6)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-yellow-800">
                        <span className="font-semibold">Importante:</span>{' '}
                        Incluye la referencia en tu transferencia para
                        identificar tu pago.
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Modo Demo:</span> Haz
                        clic en "Procesar Pago" para simular el proceso.
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'oxxo' && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Pago en OXXO
                    </h3>
                    <div className="text-center py-6">
                      <div className="inline-block bg-gray-100 rounded-lg p-6 mb-4">
                        <p className="text-sm text-gray-700 font-medium mb-2">
                          Código de Referencia:
                        </p>
                        <p className="text-3xl font-bold text-gray-900 tracking-wider">
                          {Date.now().toString().slice(-10)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p className="font-semibold">
                        Instrucciones para pagar en OXXO:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>
                          Acude a cualquier tienda OXXO y proporciona el código
                          de referencia al cajero
                        </li>
                        <li>
                          Realiza el pago en efectivo por la cantidad de $
                          {calculateTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                        </li>
                        <li>Guarda tu comprobante de pago</li>
                        <li>
                          Tu pago se verá reflejado en un plazo de 24-48 horas
                        </li>
                      </ol>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Modo Demo:</span> Haz
                        clic en "Procesar Pago" para simular el proceso.
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Pagar con PayPal
                    </h3>
                    <div className="text-center py-8">
                      <div className="mb-6">
                        <div className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-xl font-bold">
                          PayPal
                        </div>
                      </div>
                      <p className="text-gray-700 mb-6">
                        Serás redirigido a PayPal para completar tu pago de
                        forma segura.
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto">
                        <p className="text-sm text-gray-700 font-medium">Monto a pagar:</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${calculateTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Modo Demo:</span> Haz
                        clic en "Procesar Pago" para simular el proceso de
                        PayPal.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Procesando...' : 'Procesar Pago'}
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Resumen del Pedido
                </h2>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div
                      key={item.service.id}
                      className="flex justify-between text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {item.service.nombre}
                        </p>
                        <p className="text-xs text-gray-700">
                          {item.cantidad} × $
                          {item.service.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        $
                        {(item.service.precio * item.cantidad).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">Subtotal:</span>
                    <span className="font-semibold text-gray-900">
                      ${calculateSubtotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">IVA (16%):</span>
                    <span className="font-semibold text-gray-900">
                      ${calculateIVA().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-indigo-600">
                      ${calculateTotal().toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Pago 100% seguro y encriptado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
