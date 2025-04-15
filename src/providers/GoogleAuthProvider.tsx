
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Replace with your actual client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "your-google-client-id.apps.googleusercontent.com";

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}

export const GoogleAuthProviderWrapper = ({ children }: GoogleAuthProviderProps) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};
