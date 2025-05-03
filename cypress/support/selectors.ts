/**
 * Centralized Selector Repository
 * 
 * This file contains all selectors used in tests, organized by page and component.
 */

// Selector Strategy Priority:
// 1. IDs and data attributes
// 2. ARIA attributes
// 3. CSS attribute contains selectors
// 4. Partial text matching with :contains()
// 5. Position-based selectors (last resort)

// Login Page Selectors
export const LOGIN = {
  // Prioritize unique ID. Add type attribute for specificity if needed.
  EMAIL_FIELD: '#email',
  PASSWORD_FIELD: '#password',
  // Keep submit button and error message selectors slightly broader if necessary, but prioritize IDs/data-attributes
  SUBMIT_BUTTON: '#submitLoginBtn, button[type="submit"]:contains("Login"), button[type="submit"]:contains("Sign In")',
  ERROR_MESSAGE: '.error-message, .alert-danger, [role="alert"]' // Simplified error message selector
};

// E-commerce Page Selectors
export const ECOMMERCE = {
  // Prioritize specific classes observed in original code/tests
  SHOP_ITEM: '.shop-item',
  SHOP_ITEM_TITLE: '.shop-item-title',
  SHOP_ITEM_BUTTON: '.shop-item-button',
  SHOP_ITEM_PRICE: '.shop-item-price, .price',
  // Keep others slightly broader if needed, but prioritize specific attributes/classes
  CART_ITEMS: '.cart-items',
  CART_QUANTITY: '.cart-quantity',
  CART_BUTTON: '[data-qa="cart"], .cart-icon, #cart-button', // Removed generic contains
  CHECKOUT_BUTTON: '.btn-purchase', // Assuming this is the primary selector
  LOGOUT_BUTTON: '[data-qa="logout"], .logout-button, #logout' // Removed generic contains
};

// Order confirmation selectors
export const ORDER_CONFIRMATION = {
  CONTAINER: '#message, [data-qa="order-confirmation"], .order-confirmation',
  AMOUNT_BOLD: '#message b:nth-of-type(1)',
  INFO_BOLD: '#message b:nth-of-type(2)'
};

// Shipping Form Selectors
export const SHIPPING = {
  FORM: '#shippingForm, form[class*="shipping"], form[class*="checkout"], form',
  PHONE_FIELD: '#phone, [name="phone"], [type="tel"], input[class*="phone"], input[placeholder*="phone"]',
  STREET_FIELD: 'input[name="street"], [name="address"], [class*="street"], [class*="address"], input[placeholder*="street"], input[placeholder*="address"]',
  CITY_FIELD: 'input[name="city"], [class*="city"], input[placeholder*="city"]',
  COUNTRY_DROPDOWN: '#countries_dropdown_menu, select[name="country"], select[class*="country"], select',
  SUBMIT_ORDER_BUTTON: '#submitOrderBtn, [type="submit"], button[class*="submit"], button[class*="order"], button:contains("Submit"), button:contains("Order")'
};

// File Upload Page Selectors
export const FILE_UPLOAD = {
  FILE_INPUT: 'input[type="file"], [class*="file-input"]',
  SUBMIT_BUTTON: 'button[type="submit"], [class*="upload-button"], button:contains("Upload"), button:contains("Submit")',
  SUCCESS_MESSAGE: '.success-message, .alert-success, [class*="success"], div:contains("Successfully uploaded")'
};

// Common UI Elements
export const COMMON = {
  LOADING_INDICATOR: '.loading, .spinner, .loader, [class*="loading"], [class*="spinner"], [aria-busy="true"]',
  SUCCESS_MESSAGE: '.success-message, .order-success, .alert-success, [class*="success"], [role="alert"][class*="success"], div:contains("Success")',
  ERROR_MESSAGE: '.error-message, .alert-danger, .validation-error, [class*="error"], [role="alert"][class*="danger"], div:contains("Error")',
  MODAL: '.modal, .dialog, .popup, [role="dialog"], [class*="modal"], [class*="popup"]',
  MODAL_CLOSE: '.close, .modal-close, .dialog-close, [class*="close"], button[aria-label="Close"], button:contains("×")'
};
