import React from "react";
import Icon from "/src/assets/nestle.png";
import minimizerIcon from "/src/assets/minimize.svg";
import maximizerIcon from "/src/assets/maximize.svg";
import closeIcon from "/src/assets/close.svg";
import styled from "styled-components";
import { showNestyChatAtom } from "../../states";
import { useRecoilState, useSetRecoilState } from "recoil";

const NestyChatHeaderStyle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacings[6]};
  align-items: center;
  border-bottom: 1px solid #e5e5ea;
  padding: ${({ theme }) => theme.spacings[8]};
`;

const IconContainer = styled.div`
  right: ${({ theme }) => theme.spacings[5]};
  position: absolute;
  display: flex;
`;

const NestyChatHeaderIcon = styled.img`
  height: ${({ theme }) => theme.spacings[8]};
  width: ${({ theme }) => theme.spacings[8]};
  padding: ${({ theme }) => theme.spacings[3]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.all};
  &:hover {
    opacity: 0.5;
  }
`;

function NestyChatHeader() {
  const [showNestyChat, setShowNestyChat] = useRecoilState(showNestyChatAtom);

  return (
    <NestyChatHeaderStyle>
      <img style={{ height: "32px" }} src={Icon} />
      {showNestyChat === "min" ? (
        <div>
          <h4>Nesty - Smart Website Assistant</h4>
          <h5 style={{ fontWeight: "400" }}>Available 24/7</h5>
        </div>
      ) : (
        <div>
          <h3>Nesty - Smart Website Assistant</h3>
          <h5 style={{ fontWeight: "400" }}>Available 24/7</h5>
        </div>
      )}
      <IconContainer>
        <span style={{ display: window.innerWidth <= 768 ? 'none' : 'block' }}>
          {showNestyChat === "min" ? (
            <NestyChatHeaderIcon onClick={(e) => setShowNestyChat("max")} src={maximizerIcon} />
          ) : (
            <NestyChatHeaderIcon onClick={(e) => setShowNestyChat("min")} src={minimizerIcon} />
          )}
        </span>
        <NestyChatHeaderIcon onClick={(e) => setShowNestyChat("close")} src={closeIcon} />
      </IconContainer>
    </NestyChatHeaderStyle>
  );
}

export default NestyChatHeader;
