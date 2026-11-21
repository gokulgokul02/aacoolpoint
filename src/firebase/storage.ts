export interface UploadProgress {
  progress: number
  url?: string
  path?: string
  error?: string
}

// Resilient helper to convert and optimize file to Data URL if offline or API limit reached
const fileToBase64 = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.onerror = () => resolve((e.target?.result as string) || '')
      img.src = (e.target?.result as string) || ''
    }
    reader.onerror = () => resolve('')
    reader.readAsDataURL(file)
  })
}

/**
 * Upload image to ImgBB with real-time progress tracking
 * Used by ProductForm, ImageUploader, GalleryManagement, and ServiceForm
 */
export const uploadFile = (
  file: File,
  _path?: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string }> => {
  return new Promise((resolve) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY || 'c7757c5488930442cca28920d221fbd5'

    const formData = new FormData()
    formData.append('image', file)
    formData.append('name', file.name.replace(/\.[^/.]+$/, ''))

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.imgbb.com/1/upload?key=${apiKey}`)

    // Real-time progress bar tracking for ImageUploader
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress?.(percent)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          if (response.success && response.data) {
            onProgress?.(100)
            const imageUrl = response.data.display_url || response.data.url
            resolve({
              url: imageUrl,
              path: `imgbb_${response.data.id}`,
            })
            return
          }
        } catch (e) {
          console.warn('ImgBB response parse failed:', e)
        }
      }

      console.warn('ImgBB upload error, falling back to local Base64:', xhr.responseText)
      fileToBase64(file).then((fallbackUrl) => {
        onProgress?.(100)
        resolve({ url: fallbackUrl, path: `local_${Date.now()}` })
      })
    }

    xhr.onerror = () => {
      console.warn('ImgBB network error, falling back to local Base64')
      fileToBase64(file).then((fallbackUrl) => {
        onProgress?.(100)
        resolve({ url: fallbackUrl, path: `local_${Date.now()}` })
      })
    }

    xhr.send(formData)
  })
}

/**
 * Upload multiple files sequentially
 */
export const uploadMultipleFiles = async (
  files: File[],
  basePath: string,
  onProgress?: (index: number, progress: number) => void
): Promise<{ url: string; path: string }[]> => {
  const results: { url: string; path: string }[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileName = `${Date.now()}_${i}_${file.name.replace(/\s+/g, '_')}`
    const path = `${basePath}/${fileName}`
    const result = await uploadFile(file, path, (progress) => {
      onProgress?.(i, progress)
    })
    results.push(result)
  }

  return results
}

/**
 * Delete image handler (ImgBB public images don't require deletion)
 */
export const deleteFile = async (_path: string): Promise<void> => {
  return Promise.resolve()
}

/**
 * Retrieve Image URL
 */
export const getFileUrl = async (path: string): Promise<string> => {
  return path
}