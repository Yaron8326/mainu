-- MainU seed - 7 restaurants + ~35 dishes for internal beta
-- Run after 0001_init.sql

-- Clean (optional during dev)
-- delete from public.ratings;
-- delete from public.dishes;
-- delete from public.restaurants;

with r as (
  insert into public.restaurants (name, address, cuisine_tags, is_kosher, is_vegan_friendly)
  values
    ('פסטה בסטה',     'דיזנגוף 150, תל אביב', array['איטלקי','פסטה'],       false, true),
    ('בורגר באנג',    'אבן גבירול 30, תל אביב', array['המבורגר','אמריקאי'],  false, false),
    ('סושי קודאי',    'הרצל 88, רמת גן',     array['יפני','סושי'],          false, true),
    ('הומוס אבו עומר','עמק רפאים 22, ירושלים', array['ישראלי','חומוס'],     true,  true),
    ('פלאפל הכוכב',   'אלנבי 60, תל אביב',   array['ישראלי','פלאפל'],       true,  true),
    ('ראמן יוקו',     'לילינבלום 12, תל אביב', array['יפני','ראמן','אסייתי'], false, true),
    ('שווארמה ביכורי','המלך ג''ורג'' 40, תל אביב', array['ישראלי','שווארמה'], true, false)
  returning id, name
)
select 1;

-- For predictable referencing, fetch IDs by name in subsequent inserts.
do $$
declare
  v_pasta uuid; v_burger uuid; v_sushi uuid; v_humus uuid;
  v_falafel uuid; v_ramen uuid; v_shawarma uuid;
begin
  select id into v_pasta    from public.restaurants where name = 'פסטה בסטה' limit 1;
  select id into v_burger   from public.restaurants where name = 'בורגר באנג' limit 1;
  select id into v_sushi    from public.restaurants where name = 'סושי קודאי' limit 1;
  select id into v_humus    from public.restaurants where name = 'הומוס אבו עומר' limit 1;
  select id into v_falafel  from public.restaurants where name = 'פלאפל הכוכב' limit 1;
  select id into v_ramen    from public.restaurants where name = 'ראמן יוקו' limit 1;
  select id into v_shawarma from public.restaurants where name = 'שווארמה ביכורי' limit 1;

  insert into public.dishes (restaurant_id, name, description, category, price) values
    (v_pasta, 'פסטה ארביאטה',        'רוטב עגבניות חריף, פלפל חריף, שום', 'mains', 58),
    (v_pasta, 'פסטה עם פטריות יער',  'שמנת, פטריות מקומיות, טימין',        'mains', 72),
    (v_pasta, 'לזניה בולונז',        'לזניה ביתית, רוטב בולונז עשיר',      'mains', 68),
    (v_pasta, 'ברוסקטה עגבניות',     'לחם קלוי, עגבניות שרי, בזיליקום',   'starters', 36),
    (v_pasta, 'טירמיסו ביתי',         'קפה אמיתי, מסקרפונה, ביסקוויטים',    'desserts', 42),

    (v_burger, 'באנג קלאסי 200גר','בייקון, צ''דר מותך, רוטב הבית',         'mains', 64),
    (v_burger, 'באנג טבעוני',     'קציצת בורגר טבעוני, אבוקדו, פלפל אש',  'mains', 58),
    (v_burger, 'באנג בלו צ''יז',  'גבינה כחולה, בצל מקורמל',              'mains', 72),
    (v_burger, 'צ''יפס בטטה',     'בטטה מטוגנת, מלח ים, רוזמרין',        'sides', 24),
    (v_burger, 'מילקשייק שוקולד', 'גלידת שוקולד בלגי, קצפת',              'drinks', 28),

    (v_sushi, 'נגירי סלמון',     '2 יחידות, סלמון נורווגי טרי',          'mains', 32),
    (v_sushi, 'רול קליפורניה',   '8 חלקים, אבוקדו, מלפפון, מיונז',      'mains', 48),
    (v_sushi, 'רול ספייסי טונה', '8 חלקים, טונה חריפה, ירקות',          'mains', 56),
    (v_sushi, 'אדמאמה',           'פולי סויה מאודים עם מלח גס',           'starters', 22),
    (v_sushi, 'מיסו שוסו',        'מרק מיסו מסורתי, טופו, אצות',         'starters', 18),

    (v_humus, 'חומוס מסבחה',     'חומוס גרגיר, גרגירים שלמים, שמן זית', 'mains', 38),
    (v_humus, 'חומוס פול',        'חומוס עם פולים, ביצה קשה',            'mains', 42),
    (v_humus, 'סלט ירוק',          'עגבניות, מלפפון, פטרוזיליה',           'sides', 18),
    (v_humus, 'פיתה טרייה',         'פיתה לבנה אפויה במקום',              'sides', 8),

    (v_falafel, 'מנת פלאפל בפיתה', '5 כדורים, סלטים, חריף',                'mains', 28),
    (v_falafel, 'צלחת פלאפל',       'פלאפל, חומוס, טחינה, סלטים',          'mains', 36),
    (v_falafel, 'מנת טחינה',         'טחינה גולמית עם פטרוזיליה ופיתה',   'starters', 14),

    (v_ramen, 'ראמן טונקוצו',     'מרק עצמות חזיר 12 שעות, צ''אשו, ביצה', 'mains', 68),
    (v_ramen, 'ראמן צמחוני',      'בוילון פטריות, טופו, אצות',            'mains', 56),
    (v_ramen, 'גיוזה',              '6 כיסונים מוקפצים עם רוטב סויה',     'starters', 32),
    (v_ramen, 'תה ירוק יפני',      'מאצ''ה חם או קר',                    'drinks', 16),

    (v_shawarma, 'שווארמה בלאפה', 'הודו וכבש, סלטים, צ''יפס',           'mains', 48),
    (v_shawarma, 'שווארמה צלחת',   'שווארמה, אורז, סלטים, חומוס',         'mains', 58),
    (v_shawarma, 'צ''יפס',          'צ''יפס מטוגן טרי',                    'sides', 18),
    (v_shawarma, 'לימונענע',        'לימון, נענע, מי סודה',                'drinks', 14);

end$$;
