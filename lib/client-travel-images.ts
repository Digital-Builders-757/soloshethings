/**
 * Client Travel Images
 * 
 * Curated selection of authentic travel images for brand storytelling.
 * These images showcase the client's real travel experiences around the world.
 * 
 * Images should be placed in: /public/client-travel/
 */

export interface ClientTravelImage {
  src: string;
  alt: string;
  location: string;
  category: 'cities' | 'food-culture' | 'landscapes' | 'people';
  isHeic?: boolean; // HEIC files need special handling
}

/**
 * Curated selection of 12 images for MVP gallery
 * Selected for maximum visual impact, brand alignment, and diversity
 */
export const CLIENT_TRAVEL_IMAGES: ClientTravelImage[] = [
  // Cities & Landmarks (High visual impact, recognizable destinations)
  {
    src: '/client-travel/lisbon-belem-tower.jpg.HEIC',
    alt: 'Woman with blonde and dark dreadlocks standing on beach in front of Belém Tower, Lisbon, Portugal',
    location: 'Lisbon, Portugal',
    category: 'cities',
    isHeic: true,
  },
  {
    src: '/client-travel/paris-eiffel-tower.JPG',
    alt: 'Young Black woman in vibrant patterned cardigan standing confidently in front of the Eiffel Tower, Paris',
    location: 'Paris, France',
    category: 'cities',
  },
  {
    src: '/client-travel/lisbon-teatro-trindade.HEIC',
    alt: 'Vibrant street scene with pink Teatro da Trindade building and tram tracks, Lisbon',
    location: 'Lisbon, Portugal',
    category: 'cities',
    isHeic: true,
  },
  {
    src: '/client-travel/historic-train-station.HEIC',
    alt: 'Grand ornate historic train station building with clock tower under blue sky',
    location: 'Europe',
    category: 'cities',
    isHeic: true,
  },

  // Food & Culture (Warm, inviting, authentic)
  {
    src: '/client-travel/restaurant-shrimp-dish.HEIC',
    alt: 'Warm restaurant scene with shrimp dish, wine, and traditional Portuguese atmosphere',
    location: 'Portugal',
    category: 'food-culture',
    isHeic: true,
  },
  {
    src: '/client-travel/market-spices-yarn.JPG',
    alt: 'Vibrant indoor market filled with colorful yarns, spices, and traditional goods',
    location: 'North Africa',
    category: 'food-culture',
  },
  {
    src: '/client-travel/bakery-olives-bread.JPG',
    alt: 'Traditional bakery shop with golden bread rolls and colorful olives in display case',
    location: 'North Africa',
    category: 'food-culture',
  },

  // Landscapes & Nature (Adventure, freedom, global reach)
  {
    src: '/client-travel/safari-elephants-sunset.HEIC',
    alt: 'Serene African safari scene at sunset with elephants grazing in marshy landscape',
    location: 'Africa',
    category: 'landscapes',
    isHeic: true,
  },
  {
    src: '/client-travel/mountain-summit-city-view.JPG',
    alt: 'Person standing triumphantly on rocky peak overlooking sprawling city and bay',
    location: 'Europe',
    category: 'landscapes',
  },
  {
    src: '/client-travel/desert-camel-caravan.JPG',
    alt: 'Person riding camel leading caravan across sandy desert landscape',
    location: 'North Africa',
    category: 'landscapes',
  },

  // People & Culture (Authentic moments, African heritage)
  {
    src: '/client-travel/desert-portrait-scarves.JPG',
    alt: 'Two people in vibrant colorful scarves and head coverings in desert landscape',
    location: 'North Africa',
    category: 'people',
  },
  {
    src: '/client-travel/garden-tiled-staircase.JPG',
    alt: 'Woman sitting on vibrant blue and green tiled staircase surrounded by lush garden foliage',
    location: 'Mediterranean/North Africa',
    category: 'people',
  },
];

/**
 * Get images by category
 */
export function getImagesByCategory(category: ClientTravelImage['category']): ClientTravelImage[] {
  return CLIENT_TRAVEL_IMAGES.filter(img => img.category === category);
}

/**
 * Get random selection of images (for variety)
 */
export function getRandomImages(count: number = 8): ClientTravelImage[] {
  const shuffled = [...CLIENT_TRAVEL_IMAGES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

