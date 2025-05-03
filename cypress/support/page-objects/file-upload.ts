/// <reference types="cypress" />
// File Upload page object class
class FileUploadPage {
  // Elements
  getFileInput() {
    return cy.get('input[type="file"]');
  }
  
  getSubmitButton() {
    return cy.get('button[type="submit"], input[type="submit"], .submit-button');
  }
  
  getSuccessMessage() {
    return cy.get('.success-message, .alert-success, .upload-success, [data-testid="success-message"]');
  }
  
  getErrorMessage() {
    return cy.get('.error-message, .alert-danger, .upload-error, [data-testid="error-message"]');
  }
  
  getFileInfo() {
    return cy.get('.file-info, .uploaded-file-info, .file-name, [data-testid="file-info"]');
  }
  
  // Actions
  visit() {
    cy.visit(Cypress.env('fileUploadUrl'));
    // Ensure the page has loaded - look for either the file input or a container element
    cy.get('body').should('be.visible');
    // Ensure the file input is visible
    this.getFileInput().should('exist');
  }
  
  uploadFile(fileName: string, fileType: string, fileContent: string = 'Test file content') {
    // Ensure the file input is available with a longer timeout
    this.getFileInput().should('exist', { timeout: 10000 });
    
    // Convert string content to Blob for attachFile
    const blob = new Blob([fileContent], { type: fileType });
    this.getFileInput().attachFile({
      fileContent: blob,
      fileName,
      mimeType: fileType
    }).then(() => cy.log(`File ${fileName} attached successfully`));
    
    // Submit the form
    this.getSubmitButton().click();
  }
  
  submitWithoutFile() {
    this.getSubmitButton().should('be.visible').click();
  }
}

export default new FileUploadPage(); 