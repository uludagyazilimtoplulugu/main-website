"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
}

export function ImageUpload({ value, onChange, placeholder = "Fotoğraf yükle veya URL gir" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan büyük olamaz")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Yükleme hatası")
      }

      onChange(data.url)
      toast.success("Fotoğraf yüklendi")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Yükleme hatası")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      {value && (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
          <img src={value} alt="Önizleme" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  )
}
