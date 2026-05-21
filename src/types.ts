export interface Car {
  id: string;
  model: string;
  price: number;
  status: 'available' | 'reserved' | 'sold';
}

export interface Property {
  id: string;
  type: string;
  location: string;
  area: number;
  price: number;
  status: 'available' | 'sold';
}

export interface Expense {
  date: string;
  amount: number;
  description: string;
}

export type UserRole = 'مدير' | 'مبيعات' | null;

export type TabType = 'home' | 'cars' | 'properties' | 'add' | 'reports' | 'flutter-code';
