import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const MapUpdater = ({ lat, long }: { lat: number; long: number }) => 
{
  const map = useMap()

  useEffect(() => {
    const newCenter: [number, number] = [lat, long]
    map.setView(newCenter)
  }, [lat, long, map])

  return null
}

export default MapUpdater