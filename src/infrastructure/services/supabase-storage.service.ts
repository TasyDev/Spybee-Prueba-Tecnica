import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { IFileStorageService, FileUploadResult } from "@domain/ports/storage.service"

export class SupabaseStorageService implements IFileStorageService {
  private supabase: SupabaseClient | null = null

  private getClient(): SupabaseClient {
    if (this.supabase) {
      return this.supabase
    }
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!url || !serviceKey) {
      throw new Error("Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    }
    
    this.supabase = createClient(url, serviceKey)
    return this.supabase
  }

  async upload(
    bucket: string,
    path: string,
    file: Buffer,
    contentType: string
  ): Promise<FileUploadResult> {
    const supabase = this.getClient()
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: false,
      })
    
    if (error) {
      throw new Error(`Failed to upload file to Supabase Storage: ${error.message}`)
    }
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return {
      url: urlData.publicUrl,
      path: data.path,
      bucket,
    }
  }

  async delete(bucket: string, path: string): Promise<void> {
    const supabase = this.getClient()
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) {
      throw new Error(`Failed to delete file from Supabase Storage: ${error.message}`)
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const supabase = this.getClient()
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}
