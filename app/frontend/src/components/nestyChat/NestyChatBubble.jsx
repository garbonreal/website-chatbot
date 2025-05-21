import React from "react";
import NestyChatLogo from "../../assets/nesty.svg";
import styled from "styled-components";
import { showNestyChatAtom } from "../../states";
import { useRecoilState } from "recoil";

const NestyChatButton = styled.div`
  position: fixed;
  display: flex;
  direction: row;
  right: 20px;
  bottom: 20px;
  cursor: pointer;
  background-color: white;
  padding: 15px 20px 15px 20px;
  box-shadow: 0px 0px 10px #00000015;
  border-radius: 200px 240px 0px 200px;
  align-items: center;
  transition: 0.2s;
  > p {
    color: ${({ theme }) => theme.colors.primaryBlue};
    margin-right: 15px;
    font-size: 16px;
    font-weight: 500;
  },
  &:hover {
    background-color: #f2f2f2
  },
  ${({ $showNestyChat }) =>
    $showNestyChat &&
    `
      transform: translateY(100%)
    `}
`;

function NestyChatBubble() {
  const [showNestyChat, setShowNestyChat] = useRecoilState(showNestyChatAtom);

  return (
    <NestyChatButton $showNestytChat={showNestyChat} size="large" onClick={(e) => setShowNestyChat("min")}>
      <p>Ask Nesty</p>
      <img src={NestyChatLogo} height={30} width={30} />
    </NestyChatButton>
  );
}

export default NestyChatBubble;
