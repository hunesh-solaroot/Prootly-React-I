import { useEffect, useRef, useState } from 'react';

// Declare global Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  address?: string;
  coordinates?: string;
  onLocationSelect?: (locationData: { lat: number; lng: number; address: string; city: string; state: string; coordinates: string }) => void;
  height?: string;
}

export function GoogleMap({ address, coordinates, onLocationSelect, height = '400px' }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    const initGoogleMaps = () => {
      if (window.google && mapRef.current) {
        const defaultLocation = { lat: 39.8283, lng: -98.5795 }; // Center of US
        
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          zoom: 10,
          center: defaultLocation,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Add click listener
        mapInstanceRef.current.addListener('click', (e: any) => {
          if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            const coordinatesStr = `${lat.toFixed(6)},${lng.toFixed(6)}`;
            
            // Update marker
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }
            
            markerRef.current = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstanceRef.current,
              title: 'Selected Location'
            });

            // Reverse geocode to get address
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === 'OK' && results && results[0] && onLocationSelect) {
                const result = results[0];
                const components = result.address_components;
                
                let city = '';
                let state = '';
                
                for (const component of components) {
                  const types = component.types;
                  if (types.includes('locality')) {
                    city = component.long_name;
                  } else if (types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                  }
                }

                onLocationSelect({
                  lat,
                  lng,
                  address: result.formatted_address,
                  city,
                  state,
                  coordinates: coordinatesStr
                });
              }
            });
          }
        });

        setIsLoaded(true);
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initGoogleMaps;
      document.head.appendChild(script);
    } else {
      initGoogleMaps();
    }
  }, [onLocationSelect]);

  // Update map when address changes
  useEffect(() => {
    if (isLoaded && mapInstanceRef.current && address && address.length > 10) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0] && mapInstanceRef.current) {
          const location = results[0].geometry.location;
          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(15);
          
          // Update marker
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }
          
          markerRef.current = new window.google.maps.Marker({
            position: location,
            map: mapInstanceRef.current,
            title: address
          });
        }
      });
    }
  }, [address, isLoaded]);

  // Update map when coordinates change
  useEffect(() => {
    if (isLoaded && mapInstanceRef.current && coordinates) {
      const [lat, lng] = coordinates.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        const position = { lat, lng };
        mapInstanceRef.current.setCenter(position);
        mapInstanceRef.current.setZoom(15);
        
        // Update marker
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        
        markerRef.current = new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          title: 'Selected Location'
        });
      }
    }
  }, [coordinates, isLoaded]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }}
      className="rounded-lg border border-gray-300 dark:border-gray-600"
    >
      {!isLoaded && (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading Google Maps...</p>
          </div>
        </div>
      )}
    </div>
  );
}