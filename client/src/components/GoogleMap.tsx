import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

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

// Geocoding cache to avoid repeated API calls
const geocodeCache = new Map<string, any>();

export function GoogleMap({ address, coordinates, onLocationSelect, height = '400px' }: GoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const clickListenerRef = useRef<any>(null);
  const geocodingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Memoize stable values
  const defaultLocation = useMemo(() => ({ lat: 39.8283, lng: -98.5795 }), []);
  
  // Optimized map configuration
  const mapConfig = useMemo(() => ({
    zoom: 8,
    center: defaultLocation,
    mapTypeId: 'satellite',
    mapTypeControl: true,
    streetViewControl: false, // Disable for better performance
    fullscreenControl: false, // Disable for better performance
    disableDefaultUI: false,
    gestureHandling: 'greedy', // Better mobile performance
    clickableIcons: false, // Reduce click event processing
    styles: [], // No custom styles to improve performance
  }), [defaultLocation]);

  // Safe cleanup function with better performance
  const safeCleanup = useCallback(() => {
    try {
      // Clear geocoding timeout
      if (geocodingTimeoutRef.current) {
        clearTimeout(geocodingTimeoutRef.current);
        geocodingTimeoutRef.current = undefined;
      }
      
      // Remove click listener
      if (clickListenerRef.current) {
        try {
          window.google?.maps?.event?.removeListener(clickListenerRef.current);
          clickListenerRef.current = null;
        } catch (error) {
          // Ignore listener cleanup errors
        }
      }
      
      // Clean marker
      if (markerRef.current) {
        try {
          markerRef.current.setMap(null);
          markerRef.current = null;
        } catch (error) {
          // Ignore marker cleanup errors
        }
      }
    } catch (error) {
      // Ignore all cleanup errors
    }
  }, []);

  // Optimized debounced geocoding
  const debouncedGeocode = useCallback((query: string, isAddressSearch: boolean = true) => {
    // Clear previous timeout
    if (geocodingTimeoutRef.current) {
      clearTimeout(geocodingTimeoutRef.current);
    }

    // Don't geocode very short queries
    if (query.length < 5) return;

    // Check cache first
    if (geocodeCache.has(query)) {
      const cachedResult = geocodeCache.get(query);
      if (cachedResult && mapInstanceRef.current) {
        const location = cachedResult.geometry.location;
        mapInstanceRef.current.setCenter(location);
        mapInstanceRef.current.setZoom(isAddressSearch ? 18 : 16); // Reduced zoom for better performance
        
        // Update marker efficiently
        if (markerRef.current) {
          markerRef.current.setPosition(location);
        } else {
          markerRef.current = new window.google.maps.Marker({
            position: location,
            map: mapInstanceRef.current,
            title: isAddressSearch ? query : 'Selected Location'
          });
        }
      }
      return;
    }

    // Debounce geocoding calls
    geocodingTimeoutRef.current = setTimeout(() => {
      if (!window.google || !mapInstanceRef.current || isGeocoding) return;
      
      setIsGeocoding(true);
      const geocoder = new window.google.maps.Geocoder();
      
      const geocodeRequest = isAddressSearch 
        ? { address: query }
        : { location: { lat: parseFloat(query.split(',')[0]), lng: parseFloat(query.split(',')[1]) } };

      geocoder.geocode(geocodeRequest, (results: any, status: any) => {
        setIsGeocoding(false);
        
        try {
          if (status === 'OK' && results && results[0] && mapInstanceRef.current) {
            const result = results[0];
            const location = result.geometry.location;
            
            // Cache the result
            geocodeCache.set(query, result);
            
            // Update map efficiently
            mapInstanceRef.current.setCenter(location);
            mapInstanceRef.current.setZoom(isAddressSearch ? 18 : 16); // Optimized zoom levels
            
            // Update marker efficiently
            if (markerRef.current) {
              markerRef.current.setPosition(location);
              markerRef.current.setTitle(isAddressSearch ? query : 'Selected Location');
            } else {
              markerRef.current = new window.google.maps.Marker({
                position: location,
                map: mapInstanceRef.current,
                title: isAddressSearch ? query : 'Selected Location'
              });
            }
          }
        } catch (error) {
          console.warn('Geocoding error:', error);
        }
      });
    }, 500); // 500ms debounce for better performance
  }, [isGeocoding]);

  // Optimized map initialization
  const initializeMap = useCallback(() => {
    if (!window.google || !mapContainerRef.current || mapInstanceRef.current) {
      return;
    }

    try {
      // Create map with optimized settings
      mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, mapConfig);

      // Add optimized click listener
      clickListenerRef.current = mapInstanceRef.current.addListener('click', (e: any) => {
        try {
          if (e.latLng && onLocationSelect && !isGeocoding) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            const coordinatesStr = `${lat.toFixed(6)},${lng.toFixed(6)}`;
            
            // Update marker position instead of creating new one
            if (markerRef.current) {
              markerRef.current.setPosition({ lat, lng });
            } else {
              markerRef.current = new window.google.maps.Marker({
                position: { lat, lng },
                map: mapInstanceRef.current,
                title: 'Selected Location'
              });
            }

            // Efficient reverse geocoding with debouncing
            debouncedGeocode(coordinatesStr, false);
            
            // Call callback immediately with coordinates
            onLocationSelect({
              lat,
              lng,
              address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              city: '',
              state: '',
              coordinates: coordinatesStr
            });
          }
        } catch (error) {
          console.warn('Map click error:', error);
        }
      });

      setIsLoaded(true);
      setLoadError(false);
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      setLoadError(true);
    }
  }, [mapConfig, onLocationSelect, debouncedGeocode, isGeocoding]);

  // Optimized script loading
  useEffect(() => {
    if (window.google) {
      initializeMap();
      return;
    }

    if (window.googleMapsLoaded) {
      return;
    }

    window.googleMapsLoaded = true;
    window.initGoogleMaps = initializeMap;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAXnPCQ3OMrjqOZ2pHJJjETw-AtRZT6SLM&libraries=places&callback=initGoogleMaps&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setLoadError(true);
      window.googleMapsLoaded = false;
    };
    
    document.head.appendChild(script);
  }, [initializeMap]);

  // Optimized address change handling
  useEffect(() => {
    if (!isLoaded || !address || address.length <= 5) {
      return;
    }
    debouncedGeocode(address, true);
  }, [address, isLoaded, debouncedGeocode]);

  // Optimized coordinates change handling
  useEffect(() => {
    if (!isLoaded || !coordinates) {
      return;
    }
    debouncedGeocode(coordinates, false);
  }, [coordinates, isLoaded, debouncedGeocode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      safeCleanup();
    };
  }, [safeCleanup]);

  // Retry handler
  const handleRetry = useCallback(() => {
    setIsLoaded(false);
    setLoadError(false);
    setTimeout(initializeMap, 100);
  }, [initializeMap]);

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
        ref={mapContainerRef} 
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg border border-gray-300 dark:border-gray-600"
      />
      {(!isLoaded || isGeocoding) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-700/80 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {!isLoaded ? 'Loading Map...' : 'Searching...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}