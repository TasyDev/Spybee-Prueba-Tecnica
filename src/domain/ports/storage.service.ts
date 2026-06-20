export interface FileUploadResult {
  url: string
  path: string
  bucket: string
}

export interface IFileStorageService {
  upload(
    bucket: string,
    path: string,
    file: Buffer,
    contentType: string
  ): Promise<FileUploadResult>
  
  delete(bucket: string, path: string): Promise<void>
  
  getPublicUrl(bucket: string, path: string): string
}
