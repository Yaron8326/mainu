import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import StarRating from './StarRating'
import { upsertRating, uploadRatingPhoto } from '../lib/queries'
import { useUser } from '../hooks/useUser'

interface Props {
  open: boolean
  onClose: () => void
  dishId: string
  dishName: string
  initialStars?: number
  initialComment?: string | null
  initialPhotoUrl?: string | null
}

export default function RatingModal({ open, onClose, dishId, dishName, initialStars, initialComment, initialPhotoUrl }: Props) {
  const [stars, setStars] = useState(initialStars ?? 0)
  const [comment, setComment] = useState(initialComment ?? '')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhotoUrl ?? null)
  const qc = useQueryClient()
  const { user } = useUser()

  const submit = useMutation({
    mutationFn: async () => {
      const userId = user?.id
      if (!userId) throw new Error('יש להתחבר לפני דירוג')
      if (stars < 1) throw new Error('בחר דירוג בכוכבים')

      let photoUrl: string | null = initialPhotoUrl ?? null
      if (photoFile) {
        photoUrl = await uploadRatingPhoto(photoFile, userId)
      }
      return upsertRating({ dishId, userId, stars, comment: comment.trim() || null, photoUrl })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dish', dishId] })
      qc.invalidateQueries({ queryKey: ['ratings', dishId] })
      qc.invalidateQueries({ queryKey: ['my-rating', dishId] })
      qc.invalidateQueries({ queryKey: ['restaurants'] })
      qc.invalidateQueries({ queryKey: ['top-dishes'] })
      qc.invalidateQueries({ queryKey: ['my-ratings'] })
      onClose()
    },
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-ink-800 border border-ink-700 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-lime-500 font-bold">דירוג מנה</p>
            <h2 className="display-xl text-2xl text-ink-100 mt-1">{dishName}</h2>
          </div>
          <button onClick={onClose} className="text-ink-400 text-3xl leading-none">×</button>
        </div>

        <div className="bg-ink-900 rounded-2xl border border-ink-700 p-5 flex flex-col items-center my-4">
          <p className="text-[10px] uppercase tracking-wider text-ink-400 font-bold mb-3">לחץ על מספר הכוכבים</p>
          <StarRating value={stars} onChange={setStars} size="lg" />
          {stars > 0 && (
            <p className="display-xl text-4xl text-lime-500 tabular mt-3">{stars}<span className="text-ink-500 text-xl">/5</span></p>
          )}
        </div>

        <label className="block">
          <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">משהו קצר (אופציונלי)</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 280))}
            rows={3}
            placeholder="טעם, מרקם, כדאי להזמין שוב?"
            className="mt-1 w-full rounded-xl bg-ink-900 border-ink-700 border p-3 text-sm text-ink-100 placeholder-ink-500 focus:outline-none focus:border-lime-500"
          />
          <span className="text-[10px] text-ink-500 tabular">{comment.length}/280</span>
        </label>

        <label className="mt-4 block">
          <span className="text-[10px] uppercase tracking-wider text-ink-400 font-bold">תמונה (אופציונלי)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null
              setPhotoFile(f)
              if (f) setPhotoPreview(URL.createObjectURL(f))
            }}
            className="mt-1 block w-full text-sm text-ink-300 file:ml-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-lime-500/10 file:text-lime-500 file:font-bold file:uppercase file:tracking-wider file:text-xs"
          />
          {photoPreview && (
            <img src={photoPreview} alt="preview" className="mt-2 w-full max-h-48 object-cover rounded-xl" />
          )}
        </label>

        {submit.isError && (
          <p className="mt-3 text-sm text-chili-500">{(submit.error as Error).message}</p>
        )}

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-ink-600 font-bold uppercase tracking-wider text-sm text-ink-300"
          >
            ביטול
          </button>
          <button
            disabled={submit.isPending || stars < 1}
            onClick={() => submit.mutate()}
            className="flex-1 py-3 rounded-full bg-lime-500 hover:bg-lime-400 text-ink-900 font-black uppercase tracking-wider text-sm disabled:opacity-40 shadow-glow-lime"
          >
            {submit.isPending ? 'שומר...' : 'שמור דירוג'}
          </button>
        </div>
      </div>
    </div>
  )
}
