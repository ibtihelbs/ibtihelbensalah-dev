import { createClient } from "@sanity/client";
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

// Initialize Sanity client
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Type definitions
export interface SanityImage {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
}

export interface NavigationItem {
  type: "page" | "section" | "homeSection";
  label: string;
  pageRoute?: string;
  sectionId?: string;
  useRelativePath?: boolean;
  isExternal?: boolean;
  externalUrl?: string;
  icon?: SanityImage;
  order?: number;
  isActive?: boolean;
}

export interface HeaderIcons {
  mobileMenuIcon?: SanityImage;
  mobileMenuIconDark?: SanityImage;
  mobileMenuCloseIcon?: SanityImage;
  mobileMenuCloseIconDark?: SanityImage;
  themeIcons?: {
    lightThemeIcon?: SanityImage;
    darkThemeIcon?: SanityImage;
  };
}

export interface HeaderData {
  name: string;
  logo?: SanityImage;
  navigationItems?: NavigationItem[];
  themeToggle?: boolean;
  icons?: HeaderIcons;
}

export interface SocialLink {
  platform: string;
  url: string;
  lightIcon: any;
  darkIcon: any;
  altText: string;
}

export interface AboutSection {
  heading: string;
  description: string;
  image: any;
  features: Array<{ text: string }>;
}

export interface SiteSettings {
  title: string;
  description: string;
  logo: any;
  heroHeadline: string;
  heroImage: any;
  email: string;
  phone: string;

  about: AboutSection;
  specialOffer: {
    enabled: boolean;
    text: string;
    expiryDate: string;
  };
}

export interface Service {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  iconLight: any;
  iconDark: any;
  iconDescription: string;
  description: string;
  features: string[];
  order: number;
}

export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  thumbnail: any;
  images: any[];
  technologies: string[];
  category: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  orderNumber: number;
  completedDate: string;
}

export interface PricingPlan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  deliveryTime: string;
  highlighted: boolean;
  order: number;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  content: any[];
  featuredImage: any;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
}

// Sanity queries
export const queries = {
  siteSettings: `*[_type == "siteSettings"][0]{
    title,
    description,
    logo,
    heroHeadline,
    heroImage,
    email,
    phone,
    about{
      heading,
      description,
      image,
      features[]{ text }
    },
    specialOffer
  }`,

  header: `*[_type == "header"][0]{
  name,
  logo,
  navigationItems[]{
    type,
    label,
    pageRoute,
    sectionId,
    useRelativePath,
    isExternal,
    externalUrl,
    icon{
      asset->{
        _id,
        url,
        metadata{
          dimensions
        }
      },
      alt
    },
    order,
    isActive
  },
  themeToggle,
  icons{
    mobileMenuIcon{
      asset->{
        _id,
        url,
        metadata{
          dimensions
        }
      },
      alt
    },
    mobileMenuIconDark{
      asset->{
        _id,
        url,
        metadata{
          dimensions
        }
      },
      alt
    },
    mobileMenuCloseIcon{
      asset->{
        _id,
        url,
        metadata{
          dimensions
        }
      },
      alt
    },
    mobileMenuCloseIconDark{
      asset->{
        _id,
        url,
        metadata{
          dimensions
        }
      },
      alt
    },
    themeIcons{
      lightThemeIcon{
        asset->{
          _id,
          url,
          metadata{
            dimensions
          }
        },
        alt
      },
      darkThemeIcon{
        asset->{
          _id,
          url,
          metadata{
            dimensions
          }
        },
        alt
      }
    }
  }
}`,

  socialSettings: `*[_type == "socialSettings"] {
    links[] {
      platform,
      url,
      altText,
      order,
      lightIcon,
      darkIcon
    }
  }[0].links`,

  services: `*[_type == "service"] | order(order asc){
    _id,
    title,
    slug,
    iconLight,
    iconDark,
    iconDescription,
    description,
    features,
    order
  }`,

  projects: `*[_type == "project"] | order(orderNumber asc){
    _id,
    title,
    slug,
    description,
    thumbnail,
    images,
    technologies,
    category,
    liveUrl,
    githubUrl,
    featured,
    orderNumber,
    completedDate
  }`,

  pricingPlans: `*[_type == "pricingPlan"] | order(order asc){
    _id,
    name,
    price,
    currency,
    features,
    deliveryTime,
    highlighted,
    order
  }`,

  blogPosts: `*[_type == "blogPost"] | order(publishedAt desc){
    _id,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    author,
    publishedAt,
    category,
    tags
  }`,
};

// Fetch functions
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch(queries.siteSettings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

export async function getHeaderData(): Promise<HeaderData | null> {
  try {
    return await client.fetch(queries.header);
  } catch (error) {
    console.error("Error fetching header data:", error);
    return null;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    return await client.fetch(queries.services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    return await client.fetch(queries.projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    return await client.fetch(queries.socialSettings);
  } catch (error) {
    console.error("Error fetching social:", error);
    return [];
  }
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    return await client.fetch(queries.pricingPlans);
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return [];
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await client.fetch(queries.blogPosts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// Utility functions
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const query = `*[_type == "project" && featured == true] | order(orderNumber asc){
      _id,
      title,
      slug,
      description,
      thumbnail,
      technologies,
      category,
      liveUrl,
      githubUrl,
      featured,
      orderNumber
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const query = `*[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      description,
      thumbnail,
      images,
      technologies,
      category,
      liveUrl,
      githubUrl,
      featured,
      orderNumber,
      completedDate
    }`;
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error("Error fetching project by slug:", error);
    return null;
  }
}

export async function getHighlightedPricingPlans(): Promise<PricingPlan[]> {
  try {
    const query = `*[_type == "pricingPlan" && highlighted == true] | order(order asc){
      _id,
      name,
      price,
      currency,
      features,
      deliveryTime,
      highlighted,
      order
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching highlighted pricing plans:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const query = `*[_type == "service" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      iconLight,
      iconDark,
      iconDescription,
      description,
      features,
      order
    }`;
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error("Error fetching service by slug:", error);
    return null;
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  try {
    const query = `*[_type == "blogPost" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      author,
      publishedAt,
      category,
      tags
    }`;
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return null;
  }
}

export async function getBlogPostsByCategory(
  category: string,
): Promise<BlogPost[]> {
  try {
    const query = `*[_type == "blogPost" && category == $category] | order(publishedAt desc){
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      author,
      publishedAt,
      category,
      tags
    }`;
    return await client.fetch(query, { category });
  } catch (error) {
    console.error("Error fetching blog posts by category:", error);
    return [];
  }
}
