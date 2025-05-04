/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /** Log in with email and password or user object */
    login(emailOrUser: string | Record<string, unknown>, password?: string): Chainable<void>;
    /** Log in as admin using cached session */
    loginAsAdmin(): Chainable<void>;
    /** Log in with invalid credentials and verify error state */
    loginWithInvalidCredentials(): Chainable<void>;
    /** Add products to cart by count, name, or index */
    addToCart(productsOrCount: number | Array<string | number>): Chainable<void>;
    /** Proceed to checkout */
    proceedToCheckout(): Chainable<void>;
    /** Complete shipping form */
    completeShipping(addressOrPhone: Record<string, unknown> | string, street?: string, city?: string, country?: string): Chainable<void>;
    /** Verify order success message contains expected details */
    verifyOrderSuccess(address?: Record<string, unknown>): Chainable<void>;
    /** Verify shipping form fields are visible and enabled */
    verifyShippingForm(): Chainable<void>;
    /** Verify validation errors on shipping form */
    verifyValidationErrors(count?: number): Chainable<void>;
    /** Log out of session */
    logout(): Chainable<void>;
    /** Click command that scrolls element into view, checks visibility, and clicks */
    safeClick(target: string | Chainable<JQuery<HTMLElement>>, options?: Partial<Cypress.Timeoutable & Cypress.Loggable>): Chainable<JQuery<HTMLElement>>;
    /** Start or restore a cached session */
    session<K extends string | unknown[]>(id: K, fn: () => void, options?: Partial<Cypress.SessionOptions>): Chainable<void>;
    /** Attach a file to a file input using cypress-file-upload */
    attachFile(fileName: string | { fileContent: Blob; fileName?: string; mimeType?: string }, options?: any): Chainable<JQuery<HTMLElement>>;
  }
} 