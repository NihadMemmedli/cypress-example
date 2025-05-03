// Centralized types for Cypress tests and page objects

// Import UserGenerator to extract User type
import { UserGenerator } from './data-generators';

// User type based on the admin generator signature
export type User = ReturnType<typeof UserGenerator.admin>;

// Shipping address interface used across page objects and tests
export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  zip?: string;
  phone: string;
} 