# MainU - Phase 1 (Internal Beta)

הספוטיפיי של האוכל - דירוג ברמת המנה, לא המסעדה.

## הפעלה מהירה

```bash
cd mainu
npm install
cp .env.example .env   # מלא את שני המפתחות מ-Supabase
npm run dev
```

האפליקציה תרוץ ב-`http://localhost:5173`.

## הגדרת Supabase

1. צור פרויקט חדש ב-https://supabase.com
2. ב-SQL Editor הרץ את `supabase/migrations/0001_init.sql`
3. הרץ את `supabase/seed.sql` כדי לאכלס מסעדות ומנות לדמו
4. הפעל Google OAuth: Authentication → Providers → Google
   - הוסף את `http://localhost:5173` ואת ה-domain בפרודקשן ל-`Redirect URLs`
5. העתק `Project URL` ו-`anon public key` ל-`.env`

## פריסה (Netlify)

1. דחוף את התיקיה ל-GitHub
2. ב-Netlify → New site from Git → בחר את הריפו
3. Build command: `npm run build`, Publish: `dist` (כבר מוגדר ב-`netlify.toml`)
4. הגדר את משתני הסביבה: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
5. הוסף את ה-URL של הפרודקשן ל-Supabase Redirect URLs

## מבנה

- `src/pages/` - 7 דפים (Auth, Home, Search, Restaurant, Dish, Profile)
- `src/components/` - רכיבים לשימוש חוזר
- `src/lib/queries.ts` - כל הגישה ל-Supabase
- `src/lib/gamification.ts` - לוגיקת דרגות (מתחיל → מאסטר)
- `supabase/migrations/0001_init.sql` - סכמה, טריגרים, RLS, bucket

## פיצ'רי Phase 1

- התחברות עם Google
- רשימת מסעדות עם דירוג ממוצע
- דף מסעדה עם תפריט מסווג לקטגוריות
- דף מנה עם היסטוגרמה ודירוגים
- דירוג מנה (1-5 כוכבים + תמונה אופציונלית), משתמש אחד = דירוג אחד
- חיפוש מנה גלובלי
- פרופיל ציבורי עם דרגה והתמחות

## לא נכנס ב-Phase 1 (backlog)

- העלאת תמונת תפריט עם פיענוח GPT-4 Vision
- פיד חברתי + עוקבים
- רשימות TOP 10
- B2B Dashboard למסעדנים
