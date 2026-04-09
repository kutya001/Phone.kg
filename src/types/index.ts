export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  productCount: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  country: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  
  images: ProductImage[];
  
  shortDescription: string;
  description: string;
  
  specs: SpecGroup[];
  
  releaseYear: number;
  isPopular: boolean;
  isNew: boolean;
  
  rating: number;
  reviewCount: number;
  
  minPriceNew: number | null;
  minPriceUsed: number | null;
  
  tags: string[];
  relatedProducts: string[];
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface SpecGroup {
  groupName: string;
  specs: Spec[];
}

export interface Spec {
  name: string;
  value: string;
  highlight?: boolean;
}

export interface Seller {
  id: string;
  slug: string;
  name: string;
  type: "individual" | "shop";
  
  avatar?: string;
  description?: string;
  
  verified: boolean;
  
  rating: number;
  reviewCount: number;
  
  location: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  contacts: SellerContacts;
  
  memberSince: string;
  totalOffers: number;
  successfulDeals: number;
}

export interface SellerContacts {
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
  website?: string;
  workingHours?: string;
}

export interface SellerOffer {
  id: string;
  productId: string;
  sellerId: string;
  
  price: number;
  currency: "KGS" | "USD";
  
  condition: "new" | "used";
  usedCondition?: "excellent" | "good" | "fair";
  usedDescription?: string;
  
  inStock: boolean;
  quantity?: number;
  
  warranty?: string;
  updatedAt: string;
  notes?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  
  authorName: string;
  authorAvatar?: string;
  
  rating: number;
  
  pros?: string;
  cons?: string;
  comment: string;
  
  usagePeriod?: string;
  
  helpful: number;
  
  date: string;
  verified: boolean;
  
  images?: string[];
}
