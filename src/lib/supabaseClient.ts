
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zyzclndpyxtitoobnbxz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5emNsbmRweXh0aXRvb2JuYnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTA2NDAsImV4cCI6MjA2MDM4NjY0MH0.Erj9hckzCkMAL4_VWj2h1REMR_DiE3mLzUNLv8VgOY8';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function for handling Supabase errors
export const handleSupabaseError = (error: any, defaultMessage = 'An error occurred') => {
  console.error('Supabase error:', error);
  return error?.message || defaultMessage;
};

// Geocoding helper using Nominatim (OpenStreetMap)
export const geocodeAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'YourAppName', // Replace with your app name
        },
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        city: data[0].display_name.split(',')[0],
        success: true,
      };
    }
    
    return { success: false, error: 'Location not found' };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { success: false, error: 'Failed to geocode address' };
  }
};

// Reverse geocoding helper
export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'YourAppName', // Replace with your app name
        },
      }
    );
    
    const data = await response.json();
    
    if (data && data.display_name) {
      return {
        address: data.display_name,
        city: data.address.city || data.address.town || data.address.village || '',
        success: true,
      };
    }
    
    return { success: false, error: 'Location not found' };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return { success: false, error: 'Failed to reverse geocode coordinates' };
  }
};
