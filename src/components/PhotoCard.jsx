import { memo } from 'react'

function PhotoCard({ photo, isFavorite, onToggleFavorite }) {
    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <img
                src={photo.download_url}
                alt={`Photo by ${photo.author}`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />

            <div className="flex min-h-[76px] items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:px-5">
                <p className="font-medium text-gray-800">
                    {photo.author}
                </p>

                <button
                    type="button"
                    onClick={() => onToggleFavorite(photo.id)}
                    aria-label={
                        isFavorite ? 'Remove from favourites' : 'Add to favourites'
                    }
                    aria-pressed={isFavorite}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl 
                        transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 
                        focus-visible:ring-offset-2 cursor-pointer
                        ${isFavorite
                            ? 'text-rose-500 hover:bg-rose-50'
                            : 'text-slate-400 hover:bg-rose-50 hover:text-rose-500'
                        }`}
                >
                    {isFavorite ? '♥' : '♡'}
                </button>
            </div>
        </article>
    )
}

export default memo(PhotoCard)