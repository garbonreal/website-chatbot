import React from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { locationErrorAtom, locationLoadingAtom } from '../../states/nestyChatStates';
import { useUserLocation } from './useUserLocation';

const PromptContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  z-index: 10000;
`;

const PromptButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 8px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const LocationPermissionPrompt = () => {
  const locationError = useRecoilValue(locationErrorAtom);
  const locationLoading = useRecoilValue(locationLoadingAtom);
  const { getCurrentLocation } = useUserLocation();

  if (locationLoading) {
    return (
      <PromptContainer>
        <p>We are obtaining your location information to provide better services...</p>
      </PromptContainer>
    );
  }

  if (locationError && locationError.includes('denied')) {
    return (
      <PromptContainer>
        <p>Allowing access to location information can help us provide you with more accurate localized services.</p>
        <PromptButton onClick={getCurrentLocation}>
          Reacquire location
        </PromptButton>
      </PromptContainer>
    );
  }

  return null;
};

export default LocationPermissionPrompt;