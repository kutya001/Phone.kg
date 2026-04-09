import categoriesData from '@/data/categories.json';
import brandsData from '@/data/brands.json';
import productsData from '@/data/products.json';
import sellersData from '@/data/sellers.json';
import offersData from '@/data/offers.json';
import reviewsData from '@/data/reviews.json';
import { Category, Brand, Product, Seller, SellerOffer, ProductReview } from '@/types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getCategories = async (): Promise<Category[]> => {
  await delay(200);
  return categoriesData as Category[];
};

export const getBrands = async (): Promise<Brand[]> => {
  await delay(200);
  return brandsData as Brand[];
};

export const getProducts = async (): Promise<Product[]> => {
  await delay(300);
  return productsData as Product[];
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  await delay(300);
  return (productsData as Product[]).find(p => p.slug === slug);
};

export const getSellers = async (): Promise<Seller[]> => {
  await delay(200);
  return sellersData as Seller[];
};

export const getSellerById = async (id: string): Promise<Seller | undefined> => {
  await delay(200);
  return (sellersData as Seller[]).find(s => s.id === id);
};

export const getOffers = async (): Promise<SellerOffer[]> => {
  await delay(200);
  return offersData as SellerOffer[];
};

export const getOffersByProductId = async (productId: string): Promise<SellerOffer[]> => {
  await delay(200);
  return (offersData as SellerOffer[]).filter(o => o.productId === productId);
};

export const getReviewsByProductId = async (productId: string): Promise<ProductReview[]> => {
  await delay(200);
  return (reviewsData as ProductReview[]).filter(r => r.productId === productId);
};
