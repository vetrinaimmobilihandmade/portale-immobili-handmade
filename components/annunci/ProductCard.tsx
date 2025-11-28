import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Palette, Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  title: string;
  description: string | null;
  category_name?: string;
  municipality_name: string | null;
  province_name?: string;
  cover_image_url: string | null;
  materials: string | null;
  is_customizable: boolean;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected';
  showStatus?: boolean;
}

export default function ProductCard({
  id,
  title,
  description,
  category_name,
  municipality_name,
  province_name,
  cover_image_url,
  materials,
  is_customizable,
  created_at,
  status,
  showStatus = false,
}: ProductCardProps) {
  return (
    <Link href={`/handmade/${id}`}>
      <div className="bg-white border border-neutral-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group h-full flex flex-col">
        
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
              <Palette className="w-16 h-16 text-text-disabled" />
            </div>
          )}
          
          {is_customizable && (
            <div className="absolute top-3 left-3">
              <Badge variant="default" className="bg-secondary text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                Personalizzabile
              </Badge>
            </div>
          )}

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

        <div className="p-4 flex-1 flex flex-col">
          
          {(municipality_name || province_name) && (
            <div className="flex items-center gap-1 text-sm text-text-secondary mb-2">
              <MapPin className="w-4 h-4" />
              <span>
                {municipality_name}
                {province_name && ` (${province_name})`}
              </span>
            </div>
          )}

          <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
            {title}
          </h3>

          {description && (
            <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-1">
              {description}
            </p>
          )}

          {materials && (
            <div className="text-sm text-text-secondary mb-3">
              <span className="font-medium">Materiali:</span> {materials}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-neutral-border">
            {category_name ? (
              <span className="text-xs text-text-disabled">
                {category_name}
              </span>
            ) : (
              <span className="text-xs text-text-disabled">Handmade</span>
            )}
            <span className="text-xs text-text-disabled">
              {formatRelativeTime(created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
