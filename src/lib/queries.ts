import { supabase, STORAGE_BUCKET } from './supabase'
import type { Restaurant, Dish, Rating, RatingWithProfile, DishWithRestaurant, Profile, DishCategory } from '../types/db'
import {
  isDemo,
  mockDishes,
  mockRestaurants,
  mock_listRestaurants,
  mock_getRestaurant,
  mock_listDishesByRestaurant,
  mock_getDish,
  mock_searchDishes,
  mock_listRatingsByDish,
  mock_getMyRatingForDish,
  mock_upsertRating,
  mock_getProfile,
  mock_listMyRatings,
} from './mockData'

export async function listTopDishes(limit = 10): Promise<DishWithRestaurant[]> {
  if (isDemo()) {
    return mockDishes
      .slice()
      .sort((a, b) => b.avg_rating - a.avg_rating)
      .slice(0, limit)
      .map((d) => {
        const rest = mockRestaurants.find((r) => r.id === d.restaurant_id)!
        return { ...d, restaurant: { id: rest.id, name: rest.name, address: rest.address } }
      })
  }
  const { data, error } = await supabase
    .from('dishes')
    .select('*, restaurant:restaurants(id, name, address)')
    .gt('ratings_count', 0)
    .order('avg_rating', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as unknown as DishWithRestaurant[]
}

export async function listRestaurants(): Promise<Restaurant[]> {
  if (isDemo()) return mock_listRestaurants()
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('avg_dish_rating', { ascending: false })
  if (error) throw error
  return data as Restaurant[]
}

export async function getRestaurant(id: string): Promise<Restaurant | null> {
  if (isDemo()) return mock_getRestaurant(id)
  const { data, error } = await supabase.from('restaurants').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as Restaurant | null
}

export async function listDishesByRestaurant(restaurantId: string): Promise<Dish[]> {
  if (isDemo()) return mock_listDishesByRestaurant(restaurantId)
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('avg_rating', { ascending: false })
  if (error) throw error
  return data as Dish[]
}

export async function getDish(id: string): Promise<DishWithRestaurant | null> {
  if (isDemo()) return mock_getDish(id)
  const { data, error } = await supabase
    .from('dishes')
    .select('*, restaurant:restaurants(id, name, address)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as unknown as DishWithRestaurant | null
}

export async function searchDishes(q: string): Promise<DishWithRestaurant[]> {
  if (isDemo()) return mock_searchDishes(q)
  if (!q.trim()) return []
  const { data, error } = await supabase
    .from('dishes')
    .select('*, restaurant:restaurants(id, name, address)')
    .ilike('name', `%${q}%`)
    .order('avg_rating', { ascending: false })
    .limit(50)
  if (error) throw error
  return data as unknown as DishWithRestaurant[]
}

export async function listRatingsByDish(dishId: string): Promise<RatingWithProfile[]> {
  if (isDemo()) return mock_listRatingsByDish(dishId)
  const { data, error } = await supabase
    .from('ratings')
    .select('*, profile:profiles(id, display_name, avatar_url, level)')
    .eq('dish_id', dishId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data as unknown as RatingWithProfile[]
}

export async function getMyRatingForDish(dishId: string, userId: string): Promise<Rating | null> {
  if (isDemo()) return mock_getMyRatingForDish(dishId, userId)
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('dish_id', dishId)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data as Rating | null
}

export async function upsertRating(args: {
  dishId: string
  userId: string
  stars: number
  comment?: string | null
  photoUrl?: string | null
}): Promise<Rating> {
  if (isDemo()) return mock_upsertRating(args)
  const { data, error } = await supabase
    .from('ratings')
    .upsert(
      {
        dish_id: args.dishId,
        user_id: args.userId,
        stars: args.stars,
        comment: args.comment ?? null,
        photo_url: args.photoUrl ?? null,
      },
      { onConflict: 'dish_id,user_id' },
    )
    .select('*')
    .single()
  if (error) throw error
  return data as Rating
}

export async function uploadRatingPhoto(file: File, userId: string): Promise<string> {
  if (isDemo()) {
    // In demo mode just return a local preview URL
    return URL.createObjectURL(file)
  }
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (isDemo()) return mock_getProfile(userId)
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return data as Profile | null
}

export async function listMyRatings(userId: string): Promise<(Rating & { dish: { id: string; name: string; category: DishCategory; restaurant_id: string } })[]> {
  if (isDemo()) return mock_listMyRatings(userId)
  const { data, error } = await supabase
    .from('ratings')
    .select('*, dish:dishes(id, name, category, restaurant_id)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as any
}
