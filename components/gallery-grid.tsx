"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryImage {
  id: string
  imageUrl: string
  caption: string | null
}

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Henuz fotograf eklenmemis.</p>
      </div>
    )
  }

  function prev() {
    if (lightboxIndex === null) return
    setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1)
  }

  function next() {
    if (lightboxIndex === null) return
    setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1)
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
            onClick={() => setLightboxIndex(i)}
          >
            <img
              src={img.imageUrl}
              alt={img.caption || "Galeri fotografi"}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setLightboxIndex(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
          <div className="max-w-4xl max-h-[80vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex].imageUrl}
              alt={images[lightboxIndex].caption || ""}
              className="max-h-[80vh] w-auto mx-auto rounded-lg"
            />
            {images[lightboxIndex].caption && (
              <p className="text-white text-center mt-4">{images[lightboxIndex].caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
