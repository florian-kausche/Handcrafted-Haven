// Shared frontend types for Product and CartItem
export type Product = {
  id: string | number
  title: string
  // price may come as string from server or as number after parsing
  price: number | string
  // images: some endpoints use `image` and others use `image_url`
  image?: string
  image_url?: string
  images?: Array<{ url: string; alt?: string; type?: string }>
  featured?: boolean
  description?: string
  rating?: number
  artisanName?: string
  artisan_name?: string
  category?: string
}

export type CartItem = {
  id: string | number
  product_id: string | number
  quantity: number
  title: string
  price: string
  image_url?: string
  stock_quantity?: number
}

export default {} as any
