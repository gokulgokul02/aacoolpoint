import React, { useCallback, useRef, useState } from 'react'
import { Star, X, Upload, GripVertical, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadFile } from '../../firebase/storage'
import { deleteFile } from '../../firebase/storage'

interface ImageMeta {
  url: string
  path: string
  alt: string
  order: number
}

interface ImageUploaderProps {
  images: ImageMeta[]
  onImagesChange: (images: ImageMeta[]) => void
  storagePath: string
  maxImages?: number
  disabled?: boolean
}

interface UploadProgress {
  fileName: string
  progress: number
  error?: string
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export default function ImageUploader({
  images,
  onImagesChange,
  storagePath,
  maxImages = 10,
  disabled = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgresses, setUploadProgresses] = useState<Record<string, UploadProgress>>({})
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isUploading = Object.values(uploadProgresses).some((p) => p.progress < 100 && !p.error)

  // ── Validate & upload files ──────────────────────────────────────
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files)
      const remaining = maxImages - images.length
      if (remaining <= 0) {
        toast.error(`Maximum ${maxImages} images allowed.`)
        return
      }
      const toUpload = fileArr.slice(0, remaining)

      for (const file of toUpload) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast.error(`"${file.name}" is not a supported image type (JPEG, PNG, WebP only).`)
          continue
        }
        if (file.size > MAX_SIZE_BYTES) {
          toast.error(`"${file.name}" exceeds the 5 MB limit.`)
          continue
        }

        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        setUploadProgresses((prev) => ({
          ...prev,
          [id]: { fileName: file.name, progress: 0 },
        }))

        try {
          const { url, path } = await uploadFile(
            file,
            `${storagePath}/${id}_${file.name}`,
            (progress) => {
              setUploadProgresses((prev) => ({
                ...prev,
                [id]: { ...prev[id], progress: Math.round(progress) },
              }))
            },
          )

          const newImage: ImageMeta = {
            url,
            path,
            alt: file.name.replace(/\.[^.]+$/, ''),
            order: images.length + toUpload.indexOf(file),
          }

          onImagesChange([...images, newImage])

          setUploadProgresses((prev) => ({
            ...prev,
            [id]: { ...prev[id], progress: 100 },
          }))

          // Remove progress bar after short delay
          setTimeout(() => {
            setUploadProgresses((prev) => {
              const copy = { ...prev }
              delete copy[id]
              return copy
            })
          }, 1200)

          toast.success(`"${file.name}" uploaded successfully.`)
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Upload failed'
          setUploadProgresses((prev) => ({
            ...prev,
            [id]: { ...prev[id], error: msg },
          }))
          toast.error(`Failed to upload "${file.name}": ${msg}`)
        }
      }
    },
    [images, maxImages, onImagesChange, storagePath],
  )

  // ── Delete image ─────────────────────────────────────────────────
  const handleDelete = async (index: number) => {
    const img = images[index]
    try {
      await deleteFile(img.path)
    } catch {
      // If file already gone, still remove from list
    }
    const updated = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }))
    onImagesChange(updated)
    toast.success('Image removed.')
  }

  // ── Drag & drop zone ──────────────────────────────────────────────
  const onDragEnterZone = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }
  const onDragLeaveZone = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const onDropZone = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files)
  }

  // ── Reorder drag ─────────────────────────────────────────────────
  const onItemDragStart = (index: number) => setDraggedIndex(index)
  const onItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }
  const onItemDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }
    const reordered = [...images]
    const [moved] = reordered.splice(draggedIndex, 1)
    reordered.splice(dropIndex, 0, moved)
    onImagesChange(reordered.map((img, i) => ({ ...img, order: i })))
    setDraggedIndex(null)
    setDragOverIndex(null)
  }
  const onItemDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const activeProgresses = Object.entries(uploadProgresses).filter(([, p]) => p.progress < 100 || p.error)

  return (
    <div className="flex flex-col gap-4">

      {/* ── Drop Zone ── */}
      {images.length < maxImages && (
        <div
          onDragEnter={onDragEnterZone}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={onDragLeaveZone}
          onDrop={onDropZone}
          onClick={() => !disabled && fileInputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
          aria-label="Upload images"
          className={`
            flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer select-none
            ${disabled ? 'opacity-50 cursor-not-allowed border-gray-600' : ''}
            ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-blue-500/60 hover:bg-blue-500/5'}
          `}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isDragging ? 'bg-blue-500/20' : 'bg-gray-700/60'}`}>
            <Upload size={22} className={isDragging ? 'text-blue-400' : 'text-gray-400'} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-300">
              Drag &amp; drop images here, or <span className="text-blue-400 underline">click to browse</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              JPEG, PNG, WebP · Max 5 MB per file · Up to {maxImages} images
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            disabled={disabled}
            className="hidden"
            onChange={(e) => { if (e.target.files) processFiles(e.target.files); e.target.value = '' }}
          />
        </div>
      )}

      {/* ── Upload Progress Bars ── */}
      {activeProgresses.length > 0 && (
        <div className="flex flex-col gap-2">
          {activeProgresses.map(([id, prog]) => (
            <div key={id} className="rounded-lg bg-gray-800/70 p-3">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400 truncate max-w-[70%]">{prog.fileName}</span>
                {prog.error ? (
                  <span className="flex items-center gap-1 text-xs text-red-400"><AlertCircle size={12} /> Error</span>
                ) : (
                  <span className="text-xs text-blue-400">{prog.progress}%</span>
                )}
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${prog.error ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${prog.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Image Preview Grid ── */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={img.path || index}
              draggable={!disabled}
              onDragStart={() => onItemDragStart(index)}
              onDragOver={(e) => onItemDragOver(e, index)}
              onDrop={(e) => onItemDrop(e, index)}
              onDragEnd={onItemDragEnd}
              className={`
                group relative aspect-square rounded-lg overflow-hidden border transition-all duration-150
                ${dragOverIndex === index && draggedIndex !== index
                  ? 'border-blue-500 scale-105 shadow-lg shadow-blue-900/40'
                  : 'border-gray-700 hover:border-blue-500/50'}
                ${draggedIndex === index ? 'opacity-40' : 'opacity-100'}
                ${disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
              `}
            >
              {/* Thumbnail */}
              <img
                src={img.url}
                alt={img.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col justify-between p-1.5">
                {/* Top row: drag handle + delete */}
                <div className="flex items-start justify-between">
                  {/* Drag handle */}
                  {!disabled && (
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-black/50 text-gray-300">
                      <GripVertical size={12} />
                    </span>
                  )}
                  {/* Delete */}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(index) }}
                      aria-label="Remove image"
                      className="flex h-6 w-6 items-center justify-center rounded bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Alt text (truncated) */}
                <p className="text-[10px] text-white/80 truncate leading-none px-0.5 pb-0.5">
                  {img.alt}
                </p>
              </div>

              {/* Primary image star badge */}
              {index === 0 && (
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded bg-yellow-500/90 px-1.5 py-0.5">
                  <Star size={10} className="fill-white text-white" />
                  <span className="text-[9px] font-semibold text-white leading-none">Primary</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          {images.length}/{maxImages} image{images.length !== 1 ? 's' : ''} · Drag to reorder · First image is the primary image
        </p>
      )}
    </div>
  )
}
