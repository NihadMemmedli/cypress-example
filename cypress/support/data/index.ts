/**
 * Data Generator Module
 *
 * Uses Faker.js to generate realistic test data for different scenarios
 */

import { faker } from '@faker-js/faker';

/**
 * User data generator with various presets
 */
export const UserGenerator = {
  /**
   * Generate random user credentials
   * @returns {Object} User credentials object
   */
  random(): object {
    return {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10, memorable: true }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  },

  /**
   * Generate admin user credentials
   */
  admin(): { email: string; password: string; role: string } {
    return {
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin',
    };
  },

  /**
   * Generate customer user credentials
   * @returns {Object} Customer user credentials
   */
  customer(): object {
    return {
      email: `customer.${faker.number.int({ min: 1000, max: 9999 })}@example.com`,
      password: 'customer123',
      role: 'customer',
    };
  },

  /**
   * Generate invalid credentials
   * @returns {Object} Invalid credentials
   */
  invalid(): object {
    return {
      email: `invalid_${faker.string.alphanumeric(8)}@example.com`,
      password: 'wrongpassword123',
    };
  },
};

/**
 * Address data generator
 */
export const AddressGenerator = {
  /**
   * Generate random address
   * @returns {Object} Random address
   */
  random(): object {
    return {
      phone: faker.phone.number(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      country: faker.helpers.arrayElement([
        'United States of America',
        'Canada',
        'United Kingdom',
        'Australia',
        'Germany',
        'France',
      ]),
    };
  },

  /**
   * Generate US address
   * @returns {Object} US address
   */
  us(): object {
    return {
      phone: faker.helpers.replaceSymbols('###-###-####'),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode('#####'),
      country: 'United States of America',
    };
  },

  /**
   * Generate shipping address
   * @returns {Object} Shipping address with delivery instructions
   */
  shipping(): object {
    const base = this.random();
    return {
      ...base,
      deliveryInstructions: faker.helpers.arrayElement([
        'Leave at door',
        'Signature required',
        'Call upon arrival',
        'Deliver to back door',
      ]),
    };
  },
};
