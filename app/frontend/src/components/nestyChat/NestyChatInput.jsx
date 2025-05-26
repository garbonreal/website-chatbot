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

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update the state with the new input value
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
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

      const response = await NestyChatActions.sendMessage(messagesToSend);

      const sourceFiles = response.context?.data_points?.text?.map((text) => {
        return text.split(":", 1)[0].trim();
      }) ?? [];

      const uniqueSources = [...new Set(sourceFiles)];

      const citationMap = uniqueSources.reduce((acc, src, idx) => {
        acc[src] = idx + 1;
        return acc;
      }, {});

      const renderedMessage = response.message.content.replace(/\[([^\]]+?)\]/g, (match, file) => {
        const number = citationMap[file];
        return number ? `[${number}]` : match;
      });
      
      setIsNestyChatThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: renderedMessage,
          source: uniqueSources,
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
    if (showNestyChat) {
      inputRef.current?.focus();
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
