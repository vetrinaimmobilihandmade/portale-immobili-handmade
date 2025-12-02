'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  bucket: 'avatars' | 'property-images' | 'product-images';
  userId: string;
  maxImages?: number;
  maxSizeMB?: number;
  onImagesChange: (imageUrls: string[]) => void;
  initialImages?: string[];
}

export default function ImageUpload({
  bucket,
  userId,
  maxImages = 10,
  maxSizeMB = 5,
  onImagesChange,
  initialImages = [],
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Verifica numero massimo immagini
    if (images.length + files.length > maxImages) {
      setError(`Puoi caricare massimo ${maxImages} immagini`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Verifica dimensione file
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
          setError(`L'immagine ${file.name} supera ${maxSizeMB}MB`);
          continue;
        }

        // Verifica tipo file
        if (!file.type.startsWith('image/')) {
          setError(`${file.name} non è un'immagine valida`);
          continue;
        }

        // Genera nome file unico
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload su Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          setError(`Errore caricamento ${file.name}`);
          continue;
        }

        // Ottieni URL pubblico
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      // Aggiorna state con nuove immagini
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onImagesChange(newImages);

    } catch (err: any) {
      console.error('Error uploading images:', err);
      setError('Errore durante il caricamento');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (imageUrl: string, index: number) => {
    try {
      // Estrai il path dal URL pubblico
      const urlParts = imageUrl.split(`${bucket}/`);
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        // Elimina da Storage
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([filePath]);

        if (deleteError) {
          console.error('Delete error:', deleteError);
        }
      }

      // Rimuovi da state
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesChange(newImages);

    } catch (err) {
      console.error('Error removing image:', err);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        Immagini {images.length > 0 && `(${images.length}/${maxImages})`}
      </label>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Preview Immagini */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Foto ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-neutral-border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(imageUrl, index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Copertina
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-border rounded-lg cursor-pointer bg-neutral-main hover:bg-neutral-hover transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-text-secondary mb-2" />
                <p className="text-sm text-text-secondary mb-1">
                  <span className="font-semibold">Clicca per caricare</span> o trascina qui
                </p>
                <p className="text-xs text-text-disabled">
                  PNG, JPG o WEBP (max {maxSizeMB}MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading || images.length >= maxImages}
          />
        </label>
      )}

      <p className="text-xs text-text-secondary mt-2">
        La prima immagine sarà usata come copertina dell'annuncio
      </p>
    </div>
  );
}
