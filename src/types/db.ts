export type Level = 'beginner' | 'advanced' | 'experienced' | 'pro' | 'master'

export type DishCategory = 'starters' | 'mains' | 'desserts' | 'drinks' | 'sides'

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  level: Level
  ratings_count: number
  is_chef_verified: boolean
  created_at: string
}

export interface Restaurant {
  id: string
  name: string
  address: string | null
  lat: number | null
  lng: number | null
  cuisine_tags: string[] | null
  is_kosher: boolean
  is_vegan_friendly: boolean
  cover_image_url: string | null
  avg_dish_rating: number
  created_at: string
}

export interface Dish {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  category: DishCategory
  price: number | null
  image_url: string | null
  avg_rating: number
  ratings_count: number
  created_at: string
}

export interface Rating {
  id: string
  dish_id: string
  user_id: string
  stars: number
  photo_url: string | null
  comment: string | null
  created_at: string
}

export interface DishWithRestaurant extends Dish {
  restaurant: Pick<Restaurant, 'id' | 'name' | 'address'>
}

export interface RatingWithProfile extends Rating {
  profile: Pick<Profile, 'id' | 'display_name' | 'avatar_url' | 'level'>
}
