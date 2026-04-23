import Papa from 'papaparse';

export interface SupportPoint {
  id: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  type: string;
  isFree?: string;
  notes?: string;
  lat?: number;
  lng?: number;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZL8b6AvN7_FVnwRIZc9bqRRjx0D5fBxSj9M2Z517Zg5Dgc96ku831jF6daDCIABQSeYa9YhjIg4EH/pub?output=csv';
const CACHE_KEY = 'istanbul_pati_coords_cache';

interface CoordsCache {
  [address: string]: { lat: number; lng: number };
}

export const fetchSupportPoints = async (): Promise<SupportPoint[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: async (results) => {
        const rawData = results.data as any[];
        // Map CSV headers to our interface. Based on provided link structure
        // Assuming columns: Adı, İlçesi, Adresi, Telefonu
        const points: SupportPoint[] = rawData
          .filter(row => row['Yer Adı'] && row['İlçe'])
          .map((row, index) => {
            const point: SupportPoint = {
              id: index.toString(),
              name: row['Yer Adı'],
              district: row['İlçe'],
              address: row['Adres'] || '',
              phone: row['Telefon'] || 'Bilgi Yok',
              type: row['Tür'] || 'Diğer',
              isFree: row['Ücretsiz mi'],
              notes: row['Not']
            };

            // If coordinates exist in CSV, use them directly
            const csvLat = parseFloat(row['Enlem'] || row['lat']);
            const csvLng = parseFloat(row['Boylam'] || row['lng'] || row['lon']);
            
            if (!isNaN(csvLat) && !isNaN(csvLng)) {
              point.lat = csvLat;
              point.lng = csvLng;
            }

            return point;
          });
        
        resolve(points);
      },
      error: (error) => reject(error),
    });
  });
};

const getCache = (): CoordsCache => {
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : {};
};

const saveCache = (cache: CoordsCache) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const geocodeAddress = async (address: string, district: string): Promise<{ lat: number; lng: number } | null> => {
  const cache = getCache();
  const query = `${address}, ${district}, Istanbul, Turkey`.trim();
  
  if (cache[query]) {
    return cache[query];
  }

  try {
    // Adding a delay to respect Nominatim rate limits (1 req/sec)
    await new Promise(r => setTimeout(r, 1000));
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      cache[query] = coords;
      saveCache(cache);
      return coords;
    }
  } catch (error) {
    console.error('Geocoding error for:', query, error);
  }

  // Fallback: search by district if full address fails
  try {
    const districtQuery = `${district}, Istanbul, Turkey`.trim();
    if (cache[districtQuery]) return cache[districtQuery];

    await new Promise(r => setTimeout(r, 1000));
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(districtQuery)}`);
    const data = await response.json();

    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      cache[districtQuery] = coords;
      saveCache(cache);
      return coords;
    }
  } catch (error) {
    console.warn('Fallback geocoding error for:', district, error);
  }

  return null;
};
