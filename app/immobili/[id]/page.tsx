import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PropertyWithContact from './PropertyWithContact';
import { formatDate } from '@/lib/utils';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Verifica se l'utente è loggato
  const { data: { user } } = await supabase.auth.getUser();

  const { data: property, error } = await supabase
    .from('properties')
    .select(`
      *,
      regions (name),
      provinces (name, code),
      property_images (thumbnail_url, full_url, display_order)
    `)
    .eq('id', params.id)
    .eq('status', 'approved')
    .single();

  if (error || !property) {
    notFound();
  }

  const typeLabels = {
    vendita: 'Vendita',
    affitto: 'Affitto',
    affitto_breve: 'Affitto Breve',
  };

  const categoryLabels = {
    appartamento: 'Appartamento',
    villa: 'Villa',
    terreno: 'Terreno',
    ufficio: 'Ufficio',
    negozio: 'Negozio',
    garage: 'Garage',
    altro: 'Altro',
  };

  const images = property.property_images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];

  return (
    <PropertyWithContact
      property={property}
      user={user}
      typeLabels={typeLabels}
      categoryLabels={categoryLabels}
      images={images}
      formatDate={formatDate}
    />
  );
}
