import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://picsum.photos/v2/list?limit=30'

function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPhotos() {
      try {
        setLoading(true)
        setError('')

        const response = await axios.get(API_URL, {
          signal: controller.signal,
        })
        setPhotos(response.data)
      } catch {
        if (!controller.signal.aborted) {
          setError('Unable to load photos. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadPhotos()

    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}

export default useFetchPhotos