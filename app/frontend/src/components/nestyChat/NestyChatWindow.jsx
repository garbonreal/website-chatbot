import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import NestyChatHeader from "./NestyChatHeader";
import NestyChatMessage from "./NestyChatMessage";
import NestyChatInput from "./NestyChatInput";
import {
  showNestyChatAtom,
  nestyChatMessageHistoryAtom,
  isNestyChatThinkingAtom,
  nestyChatErrorAtom,
} from "../../states";
import { useRecoilValue } from "recoil";

const NestyChatWindowInnerBody = styled.div`
  padding: ${({ theme }) => theme.spacings[8]} ${({ theme }) => theme.spacings[7]};
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: ${({ theme }) => theme.spacings[7]};
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  & > p {
    margin-left: ${({ theme }) => theme.spacings[4]};
  }
`;

const NestyChatWindowContainer = styled.div`
  width: calc(100vw - ${({ theme }) => theme.spacings[12]});
  max-width: 400px;
  height: calc(100vh - ${({ theme }) => theme.spacings[11]});
  max-height: 480px;
  position: fixed;
  right: ${({ theme }) => theme.spacings[7]};
  bottom: ${({ theme }) => theme.spacings[7]};
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.grey};
  z-index: 99999;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.boxShadows.large};

  @media (max-width: 768px) {
    max-height: 95%;
  }

  ${({ $showStatus }) =>
    $showStatus === "max" &&
    `
    max-width: 656px;
    max-height: 960px;
  `}

  ${({ $showStatus }) =>
    $showStatus === "close" &&
    `
    transform: translateY(120%)
    `}
`;

function NestyChatWindow() {
  const messages = useRecoilValue(nestyChatMessageHistoryAtom);
  const showNestyChat = useRecoilValue(showNestyChatAtom);
  const chatWindowRef = useRef(null);
  const isNestyChatThinking = useRecoilValue(isNestyChatThinkingAtom);
  const nestyChatError = useRecoilValue(nestyChatErrorAtom);

  useEffect(() => {
    // Scroll to the bottom whenever messages update
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <NestyChatWindowContainer $showStatus={showNestyChat}>
      <NestyChatHeader />
      <NestyChatWindowInnerBody ref={chatWindowRef}>
        {messages.map((message, index) => (
          <NestyChatMessage
            key={index}
            sender={message.role}
            message={message.content}
            source={message.source}
            storeLocations={message.storeLocations || []}
            amazonLinks={message.amazonLinks || []}
            time={message.time}
          />
        ))}
        {isNestyChatThinking ? <p>Nesty is thinking...</p> : null}
        {nestyChatError ? (
          <p style={{ color: "red" }}>Nesty is down. We've been notified and will be back soon.</p>
        ) : null}
      </NestyChatWindowInnerBody>
      <NestyChatInput />
    </NestyChatWindowContainer>
  );
}
export default NestyChatWindow;
