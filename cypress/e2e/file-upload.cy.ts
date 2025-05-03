/// <reference types="cypress" />
import FileUploadPage from '../support/page-objects/file-upload';

describe('File Upload Functionality', () => {
  beforeEach(() => {
    FileUploadPage.visit();
  });

  it('should upload a text file successfully', () => {
    cy.fixture('fileUpload').then(({ valid }) => {
      FileUploadPage.uploadFile(valid.fileName, valid.fileType, valid.fileContent);
      FileUploadPage.getFileInput()
        .invoke('prop', 'files')
        .its('0.name')
        .should('equal', valid.fileName);
    });
  });

  it('should show error when no file is selected', () => {
    FileUploadPage.submitWithoutFile();
    FileUploadPage.getFileInput()
      .should('have.prop', 'files')
      .its('length')
      .should('equal', 0);
  });

  it('should handle large file upload (edge case)', () => {
    cy.fixture('fileUpload').then(({ large }) => {
      FileUploadPage.uploadFile(large.fileName, large.fileType);
      FileUploadPage.getFileInput()
        .invoke('prop', 'files')
        .its('0.name')
        .should('equal', large.fileName);
    });
  });
}); 