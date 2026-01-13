export interface Customer {
  id: string;
  nombre: string;
  rfc: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface Service {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  unidad: string;
  disponible: boolean;
}

export interface CartItem {
  service: Service;
  cantidad: number;
}

export interface BillingDocument {
  id: string;
  fecha: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'pagado' | 'cancelado';
}
