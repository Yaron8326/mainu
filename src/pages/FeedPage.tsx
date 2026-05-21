import Header from '../components/Header'

// Phase 2 placeholder — the social feed will live here once follow/follower tables exist.
export default function FeedPage() {
  return (
    <div className="pb-32">
      <Header />
      <div className="max-w-md mx-auto px-4 pt-6">
        <p className="text-xs uppercase tracking-[0.3em] text-lime-500 font-bold text-center">בקרוב</p>
        <h1 className="display-xl text-4xl text-ink-100 mt-3 text-center">
          הפיד <br /> ה<span className="text-lime-500">חברתי</span> שלך
        </h1>
        <p className="text-ink-400 text-sm mt-4 text-center max-w-xs mx-auto">
          תוכל לעקוב אחרי חברים, שפים ובלוגרים ולגלות מנות חדשות דרך העיניים שלהם.
        </p>

        <div className="mt-10 space-y-3">
          {[
            { icon: '◎', title: 'עקוב אחרי חברים', body: 'מה הם אוכלים, מה הם דירגו 5 כוכבים' },
            { icon: '✓', title: 'שפים מאומתים', body: 'איפה גורדון רמזי אוכל כשהוא לא במסעדה שלו?' },
            { icon: '☰', title: 'רשימות משותפות', body: '"חומוס של הצפון" - אתה וחברים בונים יחד' },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-4 p-4 bg-ink-800 border border-ink-700 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lg text-lime-500 font-black shrink-0">
                {f.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-ink-100 text-sm">{f.title}</h3>
                <p className="text-xs text-ink-400 mt-0.5">{f.body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-ink-500 text-center mt-10">
          הפיצ'ר הזה יגיע ב-Phase 2 - אחרי שיהיו מספיק משתמשים שדורגים.
        </p>
      </div>
    </div>
  )
}
