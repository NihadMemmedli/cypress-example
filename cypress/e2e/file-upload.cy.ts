/// <reference types="cypress" />
import FileUploadPage from '@support/page-objects/file-upload';
import fileUpload from '@fixtures/fileUpload.json';

describe('File Upload Functionality', () => {
  beforeEach(() => {
    FileUploadPage.visit();
  });

  it('should upload a text file successfully', () => {
    const { valid } = fileUpload;
    FileUploadPage.uploadFile(valid.fileName)
      .verifyFileName(valid.fileName)
      .verifySuccessMessageContains(`You have successfully uploaded "${valid.fileName}"`);
  });

  it('should show empty file upload message when none is selected', () => {
    FileUploadPage.submitWithoutFile().verifySuccessMessageContains(
      'You have successfully uploaded ""'
    );
  });

  it('should handle large file upload (edge case)', () => {
    const { large } = fileUpload;
    // Generate and upload a 1MB blob on the fly
    FileUploadPage.uploadGeneratedFile(large.fileName, 2048)
      .verifyFileName(large.fileName)
      .verifySuccessMessageContains(`You have successfully uploaded "${large.fileName}"`);
  });
});
