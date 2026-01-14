# Portal de Servicios para Clientes

Portal web desarrollado con Next.js, TypeScript y Tailwind CSS para gestión de servicios y facturación, preparado para conectarse con Acumatica ERP.

## 📋 Características

- ✅ **Selección de Cliente**: Interfaz para que los clientes se identifiquen
- ✅ **Catálogo de Servicios**: Visualización de servicios disponibles con detalles completos
- ✅ **Carrito de Compras**: Sistema de selección múltiple de servicios con cantidades
- ✅ **Cálculo Automático**: Cálculo de subtotales, IVA (16%) y totales
- ✅ **Confirmación de Facturación**: Proceso de revisión y confirmación
- ✅ **Pasarela de Pagos Demo**: Sistema completo de procesamiento de pagos con múltiples métodos
  - 💳 Pago con Tarjeta de Crédito/Débito
  - 🏦 Transferencia Bancaria
  - 🏪 Pago en OXXO
  - 💰 PayPal
- ✅ **Simulación de Procesamiento**: Animación realista del proceso de pago
- ✅ **Generación de Documentos**: Creación de documentos de facturación con folio único
- ✅ **Confirmación de Pago**: Página de éxito con detalles completos de la transacción
- ✅ **Interfaz en Español**: Todo el contenido en idioma español
- ✅ **Datos Dummy**: Utiliza archivos JSON para simular datos de clientes y servicios
- ✅ **Diseño Responsivo**: Funciona en dispositivos móviles, tablets y escritorio

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- npm, yarn, pnpm o bun

### Instalación

```bash
# Si ya tienes el proyecto clonado, instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
portal-servicios/
├── app/
│   ├── page.tsx                    # Página de selección de cliente
│   ├── services/
│   │   └── page.tsx               # Página de servicios y carrito
│   ├── checkout/
│   │   └── page.tsx               # Página de revisión y confirmación
│   ├── payment/
│   │   ├── page.tsx               # Pasarela de pagos
│   │   └── success/
│   │       └── page.tsx           # Confirmación de pago exitoso
│   └── billing/
│       └── [id]/
│           └── page.tsx           # Página de documento de facturación
├── components/                     # Componentes reutilizables
├── data/
│   ├── customers.json             # Datos dummy de clientes
│   └── services.json              # Datos dummy de servicios
├── types/
│   └── index.ts                   # Definiciones TypeScript
└── lib/                           # Utilidades y funciones auxiliares
```

## 🎯 Flujo de Usuario

1. **Selección de Cliente**: El usuario selecciona su empresa de una lista
2. **Visualización de Servicios**: Se muestran los servicios disponibles con precios
3. **Selección de Servicios**: El usuario agrega servicios al carrito con cantidades
4. **Revisión**: Se muestra el resumen con subtotal, IVA y total
5. **Pasarela de Pagos**: El usuario selecciona un método de pago
   - **Tarjeta**: Ingresa datos de tarjeta de crédito/débito
   - **Transferencia**: Obtiene datos bancarios para transferir
   - **OXXO**: Recibe código de referencia para pagar en tienda
   - **PayPal**: Simula redirección a PayPal
6. **Procesamiento**: Animación de procesamiento del pago
7. **Confirmación de Pago**: Página de éxito con detalles de la transacción
8. **Documento Generado**: Acceso al documento de facturación pagado

## 📊 Datos de Prueba

### Clientes Disponibles

- **Empresa ABC S.A.** (RFC: ABC123456789)
- **Servicios XYZ Ltda.** (RFC: XYZ987654321)
- **Industrias del Norte** (RFC: IDN456789123)
- **Comercializadora Global** (RFC: CGM321654987)

### Servicios Disponibles

- Consultoría Empresarial - $5,000.00 MXN
- Desarrollo de Software - $8,500.00 MXN
- Mantenimiento Preventivo - $12,000.00 MXN
- Capacitación Técnica - $3,500.00 MXN
- Auditoría de Seguridad - $15,000.00 MXN
- Y más...

### Métodos de Pago de Prueba

La pasarela de pagos está en modo **DEMO**. Puedes usar los siguientes datos de prueba:

#### Pago con Tarjeta
- **Número de Tarjeta**: Cualquier número de 16 dígitos (ej: 4111 1111 1111 1111)
- **Nombre**: Cualquier nombre
- **Fecha de Expiración**: Cualquier fecha futura en formato MM/AA
- **CVV**: Cualquier código de 3-4 dígitos

#### Transferencia Bancaria
- Se generan datos bancarios automáticamente
- Haz clic en "Procesar Pago" para simular

#### Pago en OXXO
- Se genera un código de referencia automático
- Haz clic en "Procesar Pago" para simular

#### PayPal
- Simula el proceso de redirección a PayPal
- Haz clic en "Procesar Pago" para simular

## 🔧 Tecnologías Utilizadas

- **Next.js 16.1+**: Framework de React para producción
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Framework de CSS utilitario
- **React 19+**: Biblioteca de UI
- **ESLint**: Linter para mantener código limpio

## 💾 Almacenamiento de Datos

Actualmente, el portal utiliza:
- **localStorage** para almacenar:
  - Sesión del cliente
  - Carrito de compras
  - Documentos de facturación generados
  - Historial de pagos procesados
- **Archivos JSON** para datos dummy de clientes y servicios

### Próximos Pasos para Integración con Acumatica

Para conectar con Acumatica ERP, será necesario:

1. Crear endpoints API en Next.js (Route Handlers)
2. Implementar autenticación con Acumatica
3. Conectar los servicios a través de API REST de Acumatica
4. Reemplazar localStorage por llamadas a la API
5. Implementar manejo de errores y validaciones del ERP

### Integración con Pasarelas de Pago Reales

Para integrar con proveedores de pago reales:

1. **Stripe**:
   - Instalar `@stripe/stripe-js` y `stripe`
   - Configurar API keys
   - Implementar Checkout Session
   - Manejar webhooks para confirmación

2. **Conekta** (México):
   - Instalar SDK de Conekta
   - Configurar API keys
   - Implementar tokenización de tarjetas
   - Integrar OXXO Pay y SPEI

3. **OpenPay**:
   - Instalar SDK de OpenPay
   - Configurar merchant ID y API keys
   - Implementar métodos de pago locales

4. **PayPal**:
   - Integrar PayPal SDK
   - Configurar OAuth
   - Implementar Smart Payment Buttons

## 🎨 Personalización

### Modificar Clientes

Edita el archivo `data/customers.json` para agregar o modificar clientes.

### Modificar Servicios

Edita el archivo `data/services.json` para agregar o modificar servicios.

### Cambiar Tasa de IVA

En `app/checkout/page.tsx`, modifica la línea:
```typescript
const calculateIVA = () => {
  return calculateSubtotal() * 0.16; // Cambiar 0.16 por el porcentaje deseado
};
```

## 📱 Características de UI/UX

- Diseño moderno y limpio
- Gradientes y sombras para profundidad
- Botones con estados hover y disabled
- Formularios con validación
- Tablas responsivas para listados
- Tarjetas de información estructuradas
- Sistema de notificaciones visuales
- Documento de facturación imprimible

## 🏗️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint
```

## 📄 Licencia

Este proyecto fue creado para demostración y uso interno.

## 🤝 Contribuciones

Para contribuir al proyecto:
1. Crea una rama para tu feature
2. Realiza tus cambios
3. Asegúrate de que el código pase el linter
4. Crea un pull request

## 📞 Soporte

Para soporte o preguntas sobre el portal, contacta al equipo de desarrollo.

---

**Desarrollado con Next.js, TypeScript y Tailwind CSS**
