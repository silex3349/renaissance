
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

// This should be replaced with your actual Google Client ID from the Google Cloud Console
// For development, this should include http://localhost:5173 in the authorized JavaScript origins
const GOOGLE_CLIENT_ID = "739899284753-r4fj2u6ji21t21d52r08sdecbs6g4q02.apps.googleusercontent.com";

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
