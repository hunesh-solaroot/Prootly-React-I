import { useEffect, useRef, useState, useCallback } from 'react';

// Declare global Google Maps types
declare global {
  interface Window {
    google: any;
    googleMapsLoaded?: boolean;
    initGoogleMaps?: () => void;
  }
}

interface GoogleMapProps {
  address?: string;
  coordinates?: string;
  onLocationSelect?: (locationData: { lat: number; lng: number; address: string; city: string; state: string; coordinates: string }) => void;
  height?: string;
}

export function GoogleMap({ address, coordinates, onLocationSelect, height = '400px' }: GoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Force re-render key

  // Safe cleanup function
  const safeCleanup = useCallback(() => {
    try {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    } catch (error) {
      // Silently ignore marker cleanup errors
    }
    
    try {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    } catch (error) {
      // Silently ignore map cleanup errors
    }
  }, []);

  // Initialize Google Maps
  const initializeMap = useCallback(() => {
    if (!window.google || !mapContainerRef.current) {
      return;
    }

    try {
      // Clear any existing map first
      safeCleanup();
      
      const defaultLocation = { lat: 39.8283, lng: -98.5795 }; // Center of US
      
      mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
        zoom: 10,
        center: defaultLocation,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        disableDefaultUI: false,
      });

      // Add click listener with proper error handling
      const clickListener = mapInstanceRef.current.addListener('click', (e: any) => {
        try {
          if (e.latLng && onLocationSelect) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            const coordinatesStr = `${lat.toFixed(6)},${lng.toFixed(6)}`;
            
            // Safely remove existing marker
            if (markerRef.current) {
              try {
                markerRef.current.setMap(null);
              } catch (markerError) {
                // Ignore marker removal errors
              }
            }
            
            // Create new marker
            markerRef.current = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstanceRef.current,
              title: 'Selected Location'
            });

            // Reverse geocode
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
              try {
                if (status === 'OK' && results && results[0] && onLocationSelect) {
                  const result = results[0];
                  const components = result.address_components || [];
                  
                  let city = '';
                  let state = '';
                  
                  for (const component of components) {
                    const types = component.types || [];
                    if (types.includes('locality')) {
                      city = component.long_name;
                    } else if (types.includes('administrative_area_level_1')) {
                      state = component.short_name;
                    }
                  }

                  onLocationSelect({
                    lat,
                    lng,
                    address: result.formatted_address || '',
                    city,
                    state,
                    coordinates: coordinatesStr
                  });
                }
              } catch (geocodeError) {
                console.warn('Geocoding error:', geocodeError);
              }
            });
          }
        } catch (clickError) {
          console.warn('Map click error:', clickError);
        }
      });

      setIsLoaded(true);
      setLoadError(false);
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      setLoadError(true);
    }
  }, [onLocationSelect, safeCleanup]);

  // Load Google Maps API
  useEffect(() => {
    if (window.google) {
      initializeMap();
      return;
    }

    if (window.googleMapsLoaded) {
      return; // Already loading
    }

    window.googleMapsLoaded = true;
    
    // Create global initialization function
    window.initGoogleMaps = () => {
      initializeMap();
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAXnPCQ3OMrjqOZ2pHJJjETw-AtRZT6SLM&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setLoadError(true);
      window.googleMapsLoaded = false;
    };
    
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup as other components might use it
    };
  }, [initializeMap]);

  // Update map when address changes
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !address || address.length <= 10) {
      return;
    }

    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results: any, status: any) => {
        try {
          if (status === 'OK' && results && results[0] && mapInstanceRef.current) {
            const location = results[0].geometry.location;
            mapInstanceRef.current.setCenter(location);
            mapInstanceRef.current.setZoom(15);
            
            // Safely update marker
            if (markerRef.current) {
              try {
                markerRef.current.setMap(null);
              } catch (markerError) {
                // Ignore marker cleanup errors
              }
            }
            
            markerRef.current = new window.google.maps.Marker({
              position: location,
              map: mapInstanceRef.current,
              title: address
            });
          }
        } catch (geocodeError) {
          console.warn('Address geocoding error:', geocodeError);
        }
      });
    } catch (error) {
      console.warn('Error geocoding address:', error);
    }
  }, [address, isLoaded]);

  // Update map when coordinates change
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !coordinates) {
      return;
    }

    try {
      const [lat, lng] = coordinates.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        const position = { lat, lng };
        mapInstanceRef.current.setCenter(position);
        mapInstanceRef.current.setZoom(15);
        
        // Safely update marker
        if (markerRef.current) {
          try {
            markerRef.current.setMap(null);
          } catch (markerError) {
            // Ignore marker cleanup errors
          }
        }
        
        markerRef.current = new window.google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          title: 'Selected Location'
        });
      }
    } catch (error) {
      console.warn('Error updating coordinates:', error);
    }
  }, [coordinates, isLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      safeCleanup();
    };
  }, [safeCleanup]);

  // Force re-render if there are issues
  const handleRetry = () => {
    setMapKey(prev => prev + 1);
    setIsLoaded(false);
    setLoadError(false);
    setTimeout(() => {
      initializeMap();
    }, 100);
  };

  if (loadError) {
    return (
      <div 
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
      >
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Map temporarily unavailable</p>
          <button 
            onClick={handleRetry}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height, width: '100%' }}>
      <div 
        key={mapKey}
        ref={mapContainerRef} 
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg border border-gray-300 dark:border-gray-600"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading Google Maps...</p>
          </div>
        </div>
      )}
    </div>
  );
}