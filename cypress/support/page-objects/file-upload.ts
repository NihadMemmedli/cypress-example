/// <reference types="cypress" />
import { FILE_UPLOAD } from '../selectors';

// File Upload page object class
class FileUploadPage {
  // Elements
  getFileInput() {
    return cy.get(FILE_UPLOAD.FILE_INPUT);
  }
  
  getSubmitButton() {
    return cy.get(FILE_UPLOAD.SUBMIT_BUTTON);
  }
  
  getSuccessMessage() {
    // Response message element after upload or empty submission
    return cy.get(FILE_UPLOAD.RESPONSE_MESSAGE);
  }
  
  getErrorMessage() {
    return cy.get(FILE_UPLOAD.ERROR_MESSAGE);
  }
  
  getFileInfo() {
    return cy.get(FILE_UPLOAD.FILE_INFO);
  }
  
  // Actions
  visit(): this {
    cy.visit(Cypress.env('fileUploadUrl'));
    cy.get('body').should('be.visible');
    this.getFileInput().should('exist');
    return this;
  }
  
  uploadFile(fileName: string): this {
    // Attach a file from cypress/fixtures by filename
    this.getFileInput().attachFile(fileName);
    this.getSubmitButton().click();
    return this;
  }
  
  submitWithoutFile(): this {
    this.getSubmitButton().should('be.visible').click();
    return this;
  }
  
  // Verification helpers
  verifyFileName(expected: string): this {
    this.getFileInput()
      .invoke('prop', 'files')
      .its('0.name')
      .should('equal', expected);
    return this;
  }

  verifySuccessMessageContains(text: string): this {
    this.getSuccessMessage().should('contain.text', text);
    return this;
  }

  verifyErrorMessageContains(text: string): this {
    this.getErrorMessage().should('contain.text', text);
    return this;
  }

  /**
   * Verify no file is selected in the input
   */
  verifyNoFileSelected(): this {
    this.getFileInput()
      .should('have.prop', 'files')
      .its('length')
      .should('equal', 0);
    return this;
  }

  /** Verify the uploaded file info displays the correct filename */
  verifyFileInfoContains(expected: string): this {
    this.getFileInfo()
      .should('contain.text', expected);
    return this;
  }

  /** Generate a Blob of given size in KB */
  private generateBlob(sizeInKB: number, mimeType: string = 'text/plain'): Blob {
    const size = sizeInKB * 1024;
    const array = new Uint8Array(size);
    return new Blob([array], { type: mimeType });
  }

  /** Upload a dynamically generated file of specified KB size */
  uploadGeneratedFile(fileName: string, sizeInKB: number, mimeType: string = 'text/plain'): this {
    const blob = this.generateBlob(sizeInKB, mimeType);
    this.getFileInput().attachFile({ fileContent: blob, fileName, mimeType });
    this.getSubmitButton().click();
    return this;
  }
}

export default new FileUploadPage(); 