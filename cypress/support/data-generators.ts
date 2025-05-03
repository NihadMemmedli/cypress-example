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
      lastName: faker.person.lastName()
    };
  },

  /**
   * Generate admin user credentials
   */
  admin(): { email: string; password: string; role: string } {
    return {
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin'
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
      role: 'customer'
    };
  },

  /**
   * Generate invalid credentials
   * @returns {Object} Invalid credentials
   */
  invalid(): object {
    return {
      email: `invalid_${faker.string.alphanumeric(8)}@example.com`,
      password: 'wrongpassword123'
    };
  }
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
        'France'
      ])
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
      country: 'United States of America'
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
        'Deliver to back door'
      ])
    };
  }
};

/**
 * Product data generator
 */
export const ProductGenerator = {
  /**
   * Generate test product data
   * @returns {Object} Product data
   */
  random(): object {
    return {
      name: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department()
    };
  },

  /**
   * Generate specific product names from the application
   * @returns {string} Product name
   */
  knownProduct(): string {
    return faker.helpers.arrayElement([
      'iPhone',
      'Samsung',
      'Nokia',
      'Xiaomi',
      'Huawei'
    ]);
  },

  /**
   * Generate product search terms
   * @returns {string} Search term
   */
  searchTerm(): string {
    return faker.helpers.arrayElement([
      'phone',
      'smartphone',
      'mobile',
      'android',
      'ios',
      'apple'
    ]);
  }
};

/**
 * Order data generator
 */
export const OrderGenerator = {
  /**
   * Generate complete order with user, products and shipping
   * @param productCount Number of products in order
   * @returns Complete order data
   */
  complete(productCount = 3) {
    const products: ReturnType<typeof ProductGenerator.random>[] = [];
    for (let i = 0; i < productCount; i++) {
      products.push(ProductGenerator.random());
    }

    return {
      user: UserGenerator.random(),
      products,
      shipping: AddressGenerator.shipping(),
      payment: {
        method: faker.helpers.arrayElement(['Credit Card', 'PayPal', 'Bank Transfer']),
        cardNumber: faker.finance.creditCardNumber(),
        expiryDate: `${faker.date.future().getMonth() + 1}/${faker.date.future().getFullYear()}`,
        cvv: faker.finance.creditCardCVV()
      },
      orderDate: faker.date.recent(),
      orderNumber: faker.string.alphanumeric(8).toUpperCase()
    };
  }
};

/**
 * File data generator
 */
export const FileGenerator = {
  /**
   * Generate file upload data
   * @returns {Object} File data for upload
   */
  uploadFile(): object {
    return {
      name: `test-file-${faker.string.alphanumeric(6)}.txt`,
      type: 'text/plain',
      size: '1kb'
    };
  },

  /**
   * Generate image upload data
   * @returns {Object} Image data for upload
   */
  uploadImage(): object {
    return {
      name: `test-image-${faker.string.alphanumeric(6)}.jpg`,
      type: 'image/jpeg',
      size: '10kb'
    };
  }
};

/**
 * Test data sets for different scenarios
 */
export const TestData = {
  /**
   * Happy path test data
   */
  happyPath: {
    user: UserGenerator.admin(),
    products: [ProductGenerator.knownProduct(), ProductGenerator.knownProduct()],
    shipping: AddressGenerator.us()
  },
  
  /**
   * Validation test data
   */
  validation: {
    emptyFields: {
      email: ' ',
      password: ' ',
      phone: ' ',
      street: ' ',
      city: ' '
    },
    invalidEmail: {
      email: 'invalid-email',
      password: 'password123'
    },
    shortPassword: {
      email: 'test@example.com',
      password: 'pass'
    }
  }
}; 