import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Home, Bed, Bath, Maximize } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';

interface PropertyCardProps {
  id: string;
  title: string;
  description: string | null;
  property_type: 'vendita' | 'affitto' | 'affitto_breve';
  property_category: string;
  municipality_name: string | null;
  province_name?: string;
  cover_image_url: string | null;
  surface_mq: number | null;
  rooms: number | null;
  bathrooms: number | null;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected';
  showStatus?: boolean;
}

export default function PropertyCard({
  id,
  title,
  description,
  property_type,
  property_category,
  municipality_name,
  province_name,
  cover_image_url,
  surface_mq,
  rooms,
  bathrooms,
  created_at,
  status,
  showStatus = false,
}: PropertyCardProps) {
  const typeLabels = {
    vendita: 'Vendita',
    affitto: 'Affitto',
    affitto_breve: 'Affitto Breve',
  };

  return (
    <Link href={`/immobili/${id}`}>
      <div className="bg-white border border-neutral-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group h-full flex flex-col">
        
        {/* Immagine */}
        <div className="relative aspect-[4/3] bg-neutral-main overflow-hidden">
          {cover_image_url ? (
            <Image
              src={cover_image_url}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="w-16 h-16 text-text-disabled" />
            </div>
          )}
          
          {/* Badge Tipo */}
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="bg-primary text-white">
              {typeLabels[property_type]}
            </Badge>
          </div>

          {/* Badge Status (se admin) */}
          {showStatus && status && (
            <div className="absolute top-3 right-3">
              <Badge variant={status}>
                {status === 'pending' && 'In attesa'}
                {status === 'approved' && 'Approvato'}
                {status === 'rejected' && 'Rifiutato'}
              </Badge>
            </div>
          )}
        </div>

        {/* Contenuto */}
        <div className="p-4 flex-1 flex flex-col">
          
          {/* Località */}
          {(municipality_name || province_name) && (
            <div className="flex items-center gap-1 text-sm text-text-secondary mb-2">
              <MapPin className="w-4 h-4" />
              <span>
                {municipality_name}
                {province_name && ` (${province_name})`}
              </span>
            </div>
          )}

          {/* Titolo */}
          <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Descrizione */}
          {description && (
            <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-1">
              {description}
            </p>
          )}

          {/* Caratteristiche */}
          <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
            {surface_mq && (
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4" />
                <span>{surface_mq} m²</span>
              </div>
            )}
            {rooms && (
              <div className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span>{rooms} locali</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{bathrooms}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-border">
            <span className="text-xs text-text-disabled capitalize">
              {property_category}
            </span>
            <span className="text-xs text-text-disabled">
              {formatRelativeTime(created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
