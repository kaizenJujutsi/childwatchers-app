import React from 'react';
import * as Location from 'expo-location';
import { CITIES, City, CITY_NAMES } from '../data/cities';

export interface DeviceLocation {
  zone: string;
  city: string;
  coords: { latitude: number; longitude: number };
}

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getDeviceLocation(): Promise<DeviceLocation | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const geocodeResults = await Location.reverseGeocodeAsync(position.coords);
    const geocode = geocodeResults[0];

    const rawCity = geocode?.city ?? geocode?.region ?? '';
    const matchedCity = (CITY_NAMES.find(c =>
      rawCity.toLowerCase().includes(c.toLowerCase()) ||
      c.toLowerCase().includes(rawCity.toLowerCase())
    ) ?? 'Nairobi') as City;

    const rawDistrict = geocode?.district ?? geocode?.subregion ?? geocode?.name ?? '';
    const cityZones = CITIES[matchedCity] as readonly string[];
    const matchedZone = (cityZones.find(z =>
      rawDistrict.toLowerCase().includes(z.toLowerCase()) ||
      z.toLowerCase().includes(rawDistrict.toLowerCase())
    ) ?? rawDistrict) || matchedCity;

    return {
      zone: matchedZone,
      city: matchedCity,
      coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
    };
  } catch {
    return null;
  }
}

export function useLocationZone(): { deviceLocation: DeviceLocation | null; locationLoading: boolean } {
  const [deviceLocation, setDeviceLocation] = React.useState<DeviceLocation | null>(null);
  const [locationLoading, setLocationLoading] = React.useState(true);

  React.useEffect(() => {
    getDeviceLocation().then(loc => {
      setDeviceLocation(loc);
      setLocationLoading(false);
    });
  }, []);

  return { deviceLocation, locationLoading };
}
