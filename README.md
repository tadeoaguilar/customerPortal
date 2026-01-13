# Portal de Servicios para Clientes

Portal web desarrollado con Next.js, TypeScript y Tailwind CSS para gestión de servicios y facturación, preparado para conectarse con Acumatica ERP.

## 📋 Características

- ✅ **Selección de Cliente**: Interfaz para que los clientes se identifiquen
- ✅ **Catálogo de Servicios**: Visualización de servicios disponibles con detalles completos
- ✅ **Carrito de Compras**: Sistema de selección múltiple de servicios con cantidades
- ✅ **Cálculo Automático**: Cálculo de subtotales, IVA (16%) y totales
- ✅ **Confirmación de Facturación**: Proceso de revisión y confirmación
- ✅ **Generación de Documentos**: Creación de documentos de facturación con folio único
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
│   │   └── page.tsx               # Página de confirmación de facturación
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
5. **Confirmación**: El usuario confirma la facturación
6. **Documento Generado**: Se crea y muestra el documento de facturación

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

## 🔧 Tecnologías Utilizadas

- **Next.js 16.1+**: Framework de React para producción
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Framework de CSS utilitario
- **React 19+**: Biblioteca de UI
- **ESLint**: Linter para mantener código limpio

## 💾 Almacenamiento de Datos

Actualmente, el portal utiliza:
- **localStorage** para almacenar sesión del cliente y carrito
- **Archivos JSON** para datos dummy de clientes y servicios

### Próximos Pasos para Integración con Acumatica

Para conectar con Acumatica ERP, será necesario:

1. Crear endpoints API en Next.js (Route Handlers)
2. Implementar autenticación con Acumatica
3. Conectar los servicios a través de API REST de Acumatica
4. Reemplazar localStorage por llamadas a la API
5. Implementar manejo de errores y validaciones del ERP

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
