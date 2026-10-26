import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'
import favoritesReducer from '../reducers/favoritesReducer'
import PhotoCard from './PhotoCard'

const STORAGE_KEY = 'celebrare-favorite-photo-ids'

function getInitialFavorites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos()

  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    undefined,
    getInitialFavorites
  )
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  const handleToggleFavorite = useCallback((photoId) => {
    dispatch({
      type: 'TOGGLE_FAVORITE',
      photoId,
    })
  }, [])

  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    )
  }, [photos, searchTerm])

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50">
        <div
          role="status"
          aria-label="Loading photos"
          className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-emerald-800"
        />
        <p className="text-stone-600">Loading photos...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6">
        <p role="alert" className="text-center text-rose-600">
          {error}
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-stone-200 pb-7">
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
            Photo Gallery
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            Explore photos from photographers around the world.
          </p>

          <input
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by author name..."
            aria-label="Search photos by author"
            className="mt-6 w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 shadow-sm transition placeholder:text-stone-400 focus:border-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:max-w-lg sm:text-base"
          />
        </header>

        <section
          aria-label="Photo gallery"
          className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavorite={favorites.includes(photo.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </section>

        {filteredPhotos.length === 0 && (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-white py-12 text-center text-stone-500">
            No photos match your search.
          </p>
        )}
      </div>
    </main>
  )
}
