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
  
  uploadFile(fileName, fileType, fileContent = 'Test file content') {
    // Ensure the file input is available with a longer timeout
    this.getFileInput().should('exist', { timeout: 10000 });
    
    // Use attachFile with retry logic
    this.getFileInput().attachFile({
      filePath: fileName,
      fileContent: fileContent,
      fileName: fileName,
      mimeType: fileType
    }).then(() => {
      cy.log(`File ${fileName} attached successfully`);
    });
    
    // Submit the form
    this.getSubmitButton().click();
  }
  
  submitWithoutFile() {
    this.getSubmitButton().should('be.visible').click();
  }
}

export default new FileUploadPage(); 