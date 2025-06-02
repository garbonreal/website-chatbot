import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userLocationAtom, locationLoadingAtom, locationErrorAtom } from '../../states/nestyChatStates';
import { getUserLocationInfo } from '../../util/locationUtils';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useRecoilState(userLocationAtom);
  const [locationLoading, setLocationLoading] = useRecoilState(locationLoadingAtom);
  const setLocationError = useSetRecoilState(locationErrorAtom);

  const getCurrentLocation = async () => {
    const cachedLocation = localStorage.getItem('userLocation');
    const cacheTimestamp = localStorage.getItem('locationTimestamp');
    const now = Date.now();
    
    if (cachedLocation && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 3600000) {
      const parsedLocation = JSON.parse(cachedLocation);
      setUserLocation(parsedLocation);
      return parsedLocation;
    }

    setLocationLoading(true);
    setLocationError(null);
    
    try {
      const locationInfo = await getUserLocationInfo();
      setUserLocation(locationInfo);
      
      localStorage.setItem('userLocation', JSON.stringify(locationInfo));
      localStorage.setItem('locationTimestamp', now.toString());
      
      return locationInfo;
    } catch (err) {
      setLocationError(err.message);
      console.error('Location error:', err);
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    userLocation,
    locationLoading,
    getCurrentLocation
  };
};

export default useUserLocation;