import type {
  Restaurant,
  Dish,
  Rating,
  RatingWithProfile,
  DishWithRestaurant,
  Profile,
  DishCategory,
} from '../types/db'

export const MOCK_USER_ID = 'mock-user-1'

export const mockProfiles: Profile[] = [
  {
    id: MOCK_USER_ID,
    display_name: 'ירון לוי',
    avatar_url: null,
    level: 'experienced',
    ratings_count: 18,
    is_chef_verified: false,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'mock-user-2',
    display_name: 'דנה כהן',
    avatar_url: null,
    level: 'pro',
    ratings_count: 47,
    is_chef_verified: false,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'mock-user-3',
    display_name: 'שף יוסי בן דוד',
    avatar_url: null,
    level: 'master',
    ratings_count: 120,
    is_chef_verified: true,
    created_at: '2025-01-01T00:00:00Z',
  },
]

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-pasta',
    name: 'פסטה בסטה',
    address: 'דיזנגוף 150, תל אביב',
    lat: 32.083, lng: 34.774,
    cuisine_tags: ['איטלקי', 'פסטה'],
    is_kosher: false,
    is_vegan_friendly: true,
    cover_image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80',
    avg_dish_rating: 4.6,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'rest-burger',
    name: 'בורגר באנג',
    address: 'אבן גבירול 30, תל אביב',
    lat: 32.077, lng: 34.781,
    cuisine_tags: ['המבורגר', 'אמריקאי'],
    is_kosher: false,
    is_vegan_friendly: false,
    cover_image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    avg_dish_rating: 4.3,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'rest-sushi',
    name: 'סושי קודאי',
    address: 'הרצל 88, רמת גן',
    lat: 32.084, lng: 34.812,
    cuisine_tags: ['יפני', 'סושי'],
    is_kosher: false,
    is_vegan_friendly: true,
    cover_image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
    avg_dish_rating: 4.7,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'rest-humus',
    name: 'הומוס אבו עומר',
    address: 'עמק רפאים 22, ירושלים',
    lat: 31.762, lng: 35.218,
    cuisine_tags: ['ישראלי', 'חומוס'],
    is_kosher: true,
    is_vegan_friendly: true,
    cover_image_url: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=800&q=80',
    avg_dish_rating: 4.8,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'rest-ramen',
    name: 'ראמן יוקו',
    address: 'לילינבלום 12, תל אביב',
    lat: 32.06, lng: 34.769,
    cuisine_tags: ['יפני', 'ראמן', 'אסייתי'],
    is_kosher: false,
    is_vegan_friendly: true,
    cover_image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
    avg_dish_rating: 4.5,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'rest-falafel',
    name: 'פלאפל הכוכב',
    address: 'אלנבי 60, תל אביב',
    lat: 32.07, lng: 34.772,
    cuisine_tags: ['ישראלי', 'פלאפל'],
    is_kosher: true,
    is_vegan_friendly: true,
    cover_image_url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80',
    avg_dish_rating: 4.2,
    created_at: '2025-01-01T00:00:00Z',
  },
]

interface MockDish {
  id: string
  restaurant_id: string
  name: string
  description: string
  category: DishCategory
  price: number
  avg_rating: number
  ratings_count: number
  image_url?: string
}

const dishData: MockDish[] = [
  // Pasta Basta
  { id: 'd1', restaurant_id: 'rest-pasta', name: 'פסטה ארביאטה', description: 'רוטב עגבניות חריף, פלפל חריף, שום', category: 'mains', price: 58, avg_rating: 4.4, ratings_count: 23, image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80' },
  { id: 'd2', restaurant_id: 'rest-pasta', name: 'פסטה עם פטריות יער', description: 'שמנת, פטריות מקומיות, טימין', category: 'mains', price: 72, avg_rating: 4.9, ratings_count: 41, image_url: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&q=80' },
  { id: 'd3', restaurant_id: 'rest-pasta', name: 'לזניה בולונז', description: 'לזניה ביתית, רוטב בולונז עשיר', category: 'mains', price: 68, avg_rating: 4.6, ratings_count: 18 },
  { id: 'd4', restaurant_id: 'rest-pasta', name: 'ברוסקטה עגבניות', description: 'לחם קלוי, עגבניות שרי, בזיליקום', category: 'starters', price: 36, avg_rating: 4.2, ratings_count: 12 },
  { id: 'd5', restaurant_id: 'rest-pasta', name: 'טירמיסו ביתי', description: 'קפה אמיתי, מסקרפונה, ביסקוויטים', category: 'desserts', price: 42, avg_rating: 4.8, ratings_count: 27 },

  // Burger Bang
  { id: 'd6', restaurant_id: 'rest-burger', name: 'באנג קלאסי 200גר', description: 'בייקון, צ\'דר מותך, רוטב הבית', category: 'mains', price: 64, avg_rating: 4.5, ratings_count: 56, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
  { id: 'd7', restaurant_id: 'rest-burger', name: 'באנג טבעוני', description: 'קציצת בורגר טבעוני, אבוקדו, פלפל אש', category: 'mains', price: 58, avg_rating: 4.0, ratings_count: 19 },
  { id: 'd8', restaurant_id: 'rest-burger', name: 'באנג בלו צ\'יז', description: 'גבינה כחולה, בצל מקורמל', category: 'mains', price: 72, avg_rating: 4.7, ratings_count: 31 },
  { id: 'd9', restaurant_id: 'rest-burger', name: 'צ\'יפס בטטה', description: 'בטטה מטוגנת, מלח ים, רוזמרין', category: 'sides', price: 24, avg_rating: 4.3, ratings_count: 44 },
  { id: 'd10', restaurant_id: 'rest-burger', name: 'מילקשייק שוקולד', description: 'גלידת שוקולד בלגי, קצפת', category: 'drinks', price: 28, avg_rating: 4.6, ratings_count: 22 },

  // Sushi Kodai
  { id: 'd11', restaurant_id: 'rest-sushi', name: 'נגירי סלמון', description: '2 יחידות, סלמון נורווגי טרי', category: 'mains', price: 32, avg_rating: 4.8, ratings_count: 38, image_url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=80' },
  { id: 'd12', restaurant_id: 'rest-sushi', name: 'רול קליפורניה', description: '8 חלקים, אבוקדו, מלפפון, מיונז', category: 'mains', price: 48, avg_rating: 4.5, ratings_count: 51 },
  { id: 'd13', restaurant_id: 'rest-sushi', name: 'רול ספייסי טונה', description: '8 חלקים, טונה חריפה, ירקות', category: 'mains', price: 56, avg_rating: 4.9, ratings_count: 67, image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&q=80' },
  { id: 'd14', restaurant_id: 'rest-sushi', name: 'אדמאמה', description: 'פולי סויה מאודים עם מלח גס', category: 'starters', price: 22, avg_rating: 4.4, ratings_count: 29 },
  { id: 'd15', restaurant_id: 'rest-sushi', name: 'מיסו שוסו', description: 'מרק מיסו מסורתי, טופו, אצות', category: 'starters', price: 18, avg_rating: 4.6, ratings_count: 33 },

  // Humus Abu Omer
  { id: 'd16', restaurant_id: 'rest-humus', name: 'חומוס מסבחה', description: 'חומוס גרגיר, גרגירים שלמים, שמן זית', category: 'mains', price: 38, avg_rating: 4.9, ratings_count: 89, image_url: 'https://images.unsplash.com/photo-1571197119282-7c4f0d51fae1?w=400&q=80' },
  { id: 'd17', restaurant_id: 'rest-humus', name: 'חומוס פול', description: 'חומוס עם פולים, ביצה קשה', category: 'mains', price: 42, avg_rating: 4.7, ratings_count: 64 },
  { id: 'd18', restaurant_id: 'rest-humus', name: 'סלט ירוק', description: 'עגבניות, מלפפון, פטרוזיליה', category: 'sides', price: 18, avg_rating: 4.1, ratings_count: 17 },
  { id: 'd19', restaurant_id: 'rest-humus', name: 'פיתה טרייה', description: 'פיתה לבנה אפויה במקום', category: 'sides', price: 8, avg_rating: 4.8, ratings_count: 42 },

  // Ramen Yuko
  { id: 'd20', restaurant_id: 'rest-ramen', name: 'ראמן טונקוצו', description: 'מרק עצמות חזיר 12 שעות, צ\'אשו, ביצה', category: 'mains', price: 68, avg_rating: 4.8, ratings_count: 73, image_url: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&q=80' },
  { id: 'd21', restaurant_id: 'rest-ramen', name: 'ראמן צמחוני', description: 'בוילון פטריות, טופו, אצות', category: 'mains', price: 56, avg_rating: 4.3, ratings_count: 24 },
  { id: 'd22', restaurant_id: 'rest-ramen', name: 'גיוזה', description: '6 כיסונים מוקפצים עם רוטב סויה', category: 'starters', price: 32, avg_rating: 4.5, ratings_count: 35 },
  { id: 'd23', restaurant_id: 'rest-ramen', name: 'תה ירוק יפני', description: 'מאצ\'ה חם או קר', category: 'drinks', price: 16, avg_rating: 4.0, ratings_count: 11 },

  // Falafel HaKochav
  { id: 'd24', restaurant_id: 'rest-falafel', name: 'מנת פלאפל בפיתה', description: '5 כדורים, סלטים, חריף', category: 'mains', price: 28, avg_rating: 4.3, ratings_count: 102 },
  { id: 'd25', restaurant_id: 'rest-falafel', name: 'צלחת פלאפל', description: 'פלאפל, חומוס, טחינה, סלטים', category: 'mains', price: 36, avg_rating: 4.5, ratings_count: 67 },
  { id: 'd26', restaurant_id: 'rest-falafel', name: 'מנת טחינה', description: 'טחינה גולמית עם פטרוזיליה ופיתה', category: 'starters', price: 14, avg_rating: 4.6, ratings_count: 28 },
]

export const mockDishes: Dish[] = dishData.map((d) => ({
  id: d.id,
  restaurant_id: d.restaurant_id,
  name: d.name,
  description: d.description,
  category: d.category,
  price: d.price,
  image_url: d.image_url ?? null,
  avg_rating: d.avg_rating,
  ratings_count: d.ratings_count,
  created_at: '2025-01-01T00:00:00Z',
}))

const baseRatings: Omit<Rating, 'id'>[] = [
  { dish_id: 'd2', user_id: MOCK_USER_ID, stars: 5, photo_url: null, comment: 'הפסטה הכי טובה בעיר! פטריות אמיתיות, שמנת נדיבה.', created_at: '2025-05-15T18:00:00Z' },
  { dish_id: 'd2', user_id: 'mock-user-2', stars: 5, photo_url: null, comment: 'חזרתי 3 פעמים החודש בשביל המנה הזו', created_at: '2025-05-10T19:30:00Z' },
  { dish_id: 'd2', user_id: 'mock-user-3', stars: 4, photo_url: null, comment: 'מצוין, יכלו לתבל עוד טיפה', created_at: '2025-05-05T20:00:00Z' },
  { dish_id: 'd16', user_id: MOCK_USER_ID, stars: 5, photo_url: null, comment: 'חומוס ברמה אחרת, הגרגירים מתפרקים בפה', created_at: '2025-05-12T13:00:00Z' },
  { dish_id: 'd13', user_id: MOCK_USER_ID, stars: 5, photo_url: null, comment: 'הספייסי טונה הכי מאוזן שאכלתי', created_at: '2025-05-08T20:30:00Z' },
  { dish_id: 'd6', user_id: MOCK_USER_ID, stars: 4, photo_url: null, comment: 'בורגר טוב, רוטב הבית שלהם מנצח', created_at: '2025-05-03T21:00:00Z' },
  { dish_id: 'd20', user_id: MOCK_USER_ID, stars: 5, photo_url: null, comment: 'הראמן הזה שווה את הציפייה של חצי שעה', created_at: '2025-05-01T19:00:00Z' },
]

export const mockRatings: Rating[] = baseRatings.map((r, i) => ({ ...r, id: `r-${i}` }))

export function isDemo(): boolean {
  return !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY
}

// ---------- mock query implementations ----------

export async function mock_listRestaurants(): Promise<Restaurant[]> {
  return [...mockRestaurants].sort((a, b) => b.avg_dish_rating - a.avg_dish_rating)
}

export async function mock_getRestaurant(id: string): Promise<Restaurant | null> {
  return mockRestaurants.find((r) => r.id === id) ?? null
}

export async function mock_listDishesByRestaurant(rid: string): Promise<Dish[]> {
  return mockDishes
    .filter((d) => d.restaurant_id === rid)
    .sort((a, b) => b.avg_rating - a.avg_rating)
}

export async function mock_getDish(id: string): Promise<DishWithRestaurant | null> {
  const dish = mockDishes.find((d) => d.id === id)
  if (!dish) return null
  const rest = mockRestaurants.find((r) => r.id === dish.restaurant_id)!
  return {
    ...dish,
    restaurant: { id: rest.id, name: rest.name, address: rest.address },
  }
}

export async function mock_searchDishes(q: string): Promise<DishWithRestaurant[]> {
  if (!q.trim()) return []
  const lower = q.toLowerCase()
  return mockDishes
    .filter((d) => d.name.toLowerCase().includes(lower))
    .map((d) => {
      const rest = mockRestaurants.find((r) => r.id === d.restaurant_id)!
      return { ...d, restaurant: { id: rest.id, name: rest.name, address: rest.address } }
    })
    .sort((a, b) => b.avg_rating - a.avg_rating)
}

export async function mock_listRatingsByDish(dishId: string): Promise<RatingWithProfile[]> {
  return mockRatings
    .filter((r) => r.dish_id === dishId)
    .map((r) => {
      const p = mockProfiles.find((pp) => pp.id === r.user_id)!
      return {
        ...r,
        profile: { id: p.id, display_name: p.display_name, avatar_url: p.avatar_url, level: p.level },
      }
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function mock_getMyRatingForDish(dishId: string, userId: string): Promise<Rating | null> {
  return mockRatings.find((r) => r.dish_id === dishId && r.user_id === userId) ?? null
}

export async function mock_upsertRating(args: {
  dishId: string
  userId: string
  stars: number
  comment?: string | null
  photoUrl?: string | null
}): Promise<Rating> {
  const existing = mockRatings.findIndex(
    (r) => r.dish_id === args.dishId && r.user_id === args.userId,
  )
  const record: Rating = {
    id: existing >= 0 ? mockRatings[existing].id : `r-${Date.now()}`,
    dish_id: args.dishId,
    user_id: args.userId,
    stars: args.stars,
    comment: args.comment ?? null,
    photo_url: args.photoUrl ?? null,
    created_at: new Date().toISOString(),
  }
  if (existing >= 0) mockRatings[existing] = record
  else mockRatings.unshift(record)

  // Recompute dish avg
  const dish = mockDishes.find((d) => d.id === args.dishId)
  if (dish) {
    const rs = mockRatings.filter((r) => r.dish_id === args.dishId)
    dish.avg_rating = +(rs.reduce((s, r) => s + r.stars, 0) / rs.length).toFixed(2)
    dish.ratings_count = rs.length
  }
  return record
}

export async function mock_getProfile(userId: string): Promise<Profile | null> {
  return mockProfiles.find((p) => p.id === userId) ?? null
}

export async function mock_listMyRatings(userId: string) {
  return mockRatings
    .filter((r) => r.user_id === userId)
    .map((r) => {
      const d = mockDishes.find((dd) => dd.id === r.dish_id)!
      return {
        ...r,
        dish: { id: d.id, name: d.name, category: d.category, restaurant_id: d.restaurant_id },
      }
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}
