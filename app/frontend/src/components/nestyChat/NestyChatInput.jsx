import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import { useNestyChatActions } from "../../actions/nestyChatActions";
import {
  isNestyChatThinkingAtom,
  nestyChatMessageHistoryAtom,
  nestyChatErrorAtom,
  showNestyChatAtom,
} from "../../states";
import { getFormattedTime, getDateProto, parseDateProto } from "../../util";
import { userLocationAtom } from "../../states/nestyChatStates";
import paperAirplane from "../../assets/paper-airplane.png";

const NestyChatInputContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.grey};
  padding: ${({ theme }) => theme.spacings[6]} ${({ theme }) => theme.spacings[9]};
  display: flex;
  justify-content: space-between;

  & > input {
    border: none;
    outline: none;
    width: 100%;
    margin-right: ${({ theme }) => theme.spacings[8]};
    font-size: 16px;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
    
    & > input {
      margin-right: 12px;
      font-size: 16px;
    }
  }
`;

const NestyChatInputPaperAirplane = styled.img`
  align-self: center;
  cursor: pointer;
  height: ${({ theme }) => theme.spacings[10]};
  padding: ${({ theme }) => theme.spacings[3]};
  transition: ${({ theme }) => theme.transitions.all};
  &:hover {
    opacity: 0.5;
  }
`;

function NestyChatInput() {
  const [inputValue, setInputValue] = useState(""); // State to hold the input value
  const NestyChatActions = useNestyChatActions();
  const showNestyChat = useRecoilValue(showNestyChatAtom);
  const setMessages = useSetRecoilState(nestyChatMessageHistoryAtom);
  const messageHistory = useRecoilValue(nestyChatMessageHistoryAtom);
  const [isNestyChatThinking, setIsNestyChatThinking] = useRecoilState(isNestyChatThinkingAtom);
  const setNestyChatError = useSetRecoilState(nestyChatErrorAtom);

  const userLocation = useRecoilValue(userLocationAtom);

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update the state with the new input value
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const parseStoreLocations = (responseData) => {
    // Handle both direct response and nested response structures
    const locations = responseData?.locations || responseData?.results || responseData?.places || [];
    
    return locations.map(location => ({
      name: location.name || location.store_name || 'Unknown Store',
      address: location.vicinity || location.address || '',
      place_id: location.place_id || '',
      maps_url: location.geometry?.location 
        ? `https://www.google.com/maps/search/?api=1&query=${location.geometry.location.lat},${location.geometry.location.lng}&query_place_id=${location.place_id || ''}`
        : location.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ' ' + location.address)}`
    }));
  };

  const parseAmazonLinks = (responseData) => {
    const amazonData = responseData?.amazon_links || responseData?.purchase_links || responseData?.amazon || [];
    
    return amazonData.map(item => ({
      product_name: item.product_name || item.name || 'Product',
      search_query: item.search_query || item.query || '',
      amazon_url: item.amazon_url || item.url || 
        `https://www.google.com/search?q=${encodeURIComponent(item.search_query || item.query || item.product_name || 'product')}+site%3Aamazon.ca`
    }));
  };

  const handleSend = async () => {
    if (isNestyChatThinking || inputValue.trim() === "") return;
    const today = new Date();
    try {
      setNestyChatError("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: inputValue,
          time: getFormattedTime(today),
        },
      ]);
      setInputValue(""); // Clear the input field after sending
      setIsNestyChatThinking(true);

      const messagesToSend = [
        ...messageHistory.map(({ role, content }) => ({ role, content })),
        { role: "user", content: inputValue }
      ]

      const requestData = {
        messages: messagesToSend,
        userLocation: userLocation ? {
          coordinates: userLocation.coordinates,
          address: userLocation.address,
          method: userLocation.method,
          accuracy: userLocation.accuracy
        } : null
      };

      const response = await NestyChatActions.sendMessage(requestData);

      const messageContent = response.message?.content ?? "";
      const citationRegex = /\[([^\]]+)\]/g;
      const citations = [];
      let match;
      
      while ((match = citationRegex.exec(messageContent)) !== null) {
          citations.push(match[1]);
      }
      
      const uniqueSources = [...new Set(citations)];
      
      const citationMap = uniqueSources.reduce((acc, src, idx) => {
          acc[src] = idx + 1;
          return acc;
      }, {});
      
      const updatedContent = messageContent.replace(/\[([^\]]+)\]/g, (match, filename) => {
          const citationNumber = citationMap[filename];
          return citationNumber ? `[${citationNumber}]` : match;
      });

      const storeLocations = parseStoreLocations(response);
      const amazonLinks = parseAmazonLinks(response);
      
      setIsNestyChatThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: updatedContent,
          source: uniqueSources,
          storeLocations: storeLocations,
          amazonLinks: amazonLinks,
          time: getFormattedTime(today),
        },
      ]);
    } catch (err) {
      setIsNestyChatThinking(false);
      setNestyChatError(err.message);
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                    || window.innerWidth <= 768;
    
    if (showNestyChat && !isMobile) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [showNestyChat]);

  return (
    <NestyChatInputContainer>
      <input
        ref={inputRef} // Attach the ref to the input
        onKeyDown={handleKeyDown}
        placeholder="Got a question? Just ask Nesty here!"
        value={inputValue}
        onChange={handleInputChange}
      />
      <NestyChatInputPaperAirplane onClick={handleSend} src={paperAirplane} />
    </NestyChatInputContainer>
  );
}

export default NestyChatInput;
