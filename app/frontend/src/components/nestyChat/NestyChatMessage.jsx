import React from "react";
import { useRecoilValue } from "recoil";
import styled, { keyframes } from "styled-components";
import Icon from "/src/assets/nestle.png";
import TopVectorTipBlue from "../../assets/top-vector-tip-blue.svg";
import TopVectorTipGrey from "../../assets/top-vector-tip-grey.svg";
import { urlMapAtom } from "../../states";
import { useLoadUrlMap } from "./UrlMap";
import GoogleMapsStoreDisplay from "./GoogleMap";

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

const NestyMessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  max-width: calc(100% - ${({ theme }) => theme.spacings[12]});
`;

const UserMessageContainer = styled.div`
  max-width: calc(100% - ${({ theme }) => theme.spacings[11]});
  display: flex;
  align-items: flex-start;
  margin-left: auto;
`;

const MessageBubble = styled.div`
  background-color: ${({ theme, $sender }) =>
    $sender === "assistant" ? theme.colors.lightGrey : theme.colors.smokeGrey};
  border-radius: ${({ $sender }) => ($sender === "assistant" ? "0 8px 8px 8px" : "8px 0 8px 8px")};
  padding: ${({ theme }) => `${theme.spacings[3]} ${theme.spacings[4]}`};
  display: flex;
  gap: ${({ theme }) => theme.spacings[1]};
  flex-direction: column;
  max-width: 90%;
  color: ${({ theme, $sender }) => ($sender === "assistant" ? theme.colors.black : theme.colors.white)};
  & > h5 {
    text-align: right;
    font-weight: ${({ theme }) => theme.fontWeights.normal};
    color: ${({ theme, $sender }) => ($sender === "assistant" ? theme.colors.darkGrey : theme.colors.black)};
  }
  & > p {
    overflow-wrap: break-word;
    margin-right: ${({ theme }) => theme.spacings[8]};
    color: ${({ theme, $sender }) => ($sender === "assistant" ? theme.colors.darkGrey : theme.colors.black)};
`;

const MessageBubbleNestyHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacings[3]};
  align-items: center;
  margin-right: ${({ theme }) => theme.spacings[8]};
  width: fit-content;
  & > h6 {
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    white-space: nowrap;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
  }
`;

const AnimatedMessage = styled.div`
  animation: ${fadeIn} 0.15s ease-out;
`;

const Reference = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  white-space: nowrap;
  font-size: 0.95rem;

  a {
    margin-left: 4px;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.darkGrey};
    &:hover  {
      text-decoration: underline;
      color: ${({ theme }) => theme.colors.smokeGrey};
    }
  }

  span.reference-label {
    margin-right: 4px;
    font-weight: bold;
  }
`;

const StoreLocationsContainer = styled.div`
  margin-top: 12px;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
`;

const StoreLocationTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.darkGrey};
  font-size: 1rem;
`;

const StoreLocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StoreLocationItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StoreLink = styled.a`
  color: ${({ theme }) => theme.colors.black};
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.smokeGrey};
  }
  
  &:visited {
    color: ${({ theme }) => theme.colors.smokeGrey};
  }
`;

const StoreAddress = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.darkGrey};
  opacity: 0.8;
`;

const AmazonLinksContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
`;

const AmazonLink = styled.a`
  color:${({ theme }) => theme.colors.darkGrey};
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    text-decoration: underline;
    color:${({ theme }) => theme.colors.smokeGrey};
  }
  
  &:visited {
    color:${({ theme }) => theme.colors.darkGrey};
  }
  
  &: before {
    content: "🛒"; /* Shopping cart emoji */
    margin-right: 4px;
  }
`;

const NestyChatMessage = ({ sender, message, time, source = [], storeLocations = [], amazonLinks = [] }) => {
  useLoadUrlMap();
  const urlMap = useRecoilValue(urlMapAtom);

  return (
    <AnimatedMessage>
      <MessageContainer>
        {sender === "assistant" ? (
          <NestyMessageContainer>
            <img style={{ height: "32px" }} src={Icon} alt="Icon" />
            <img style={{ transform: "translateX(1px)" }} src={TopVectorTipGrey} />
            <MessageBubble $sender={sender}>
              <MessageBubbleNestyHeader>
                <h5>Nesty</h5>
                <h6>Smart Website Assistant</h6>
              </MessageBubbleNestyHeader>
              <p>
                {message.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
              
              {source.length > 0 && (
                <div>
                  <Reference>
                    <span className="reference-label">References:</span>
                    {source.map((item, index) => (
                      <a
                        key={index}
                        href={urlMap[item]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        [{index + 1}]
                      </a>
                    ))}
                  </Reference>
                </div>
              )}

              {/* Store Locations Section */}
              {storeLocations.length > 0 && (
                <StoreLocationsContainer>
                  <StoreLocationTitle>Shops Nearby:</StoreLocationTitle>
                  <StoreLocationList>
                    {storeLocations.map((store, index) => (
                      <StoreLocationItem key={index}>
                        <StoreLink 
                          href={store.maps_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {store.name}
                        </StoreLink>
                        {store.address && (
                          <StoreAddress>{store.address}</StoreAddress>
                        )}
                      </StoreLocationItem>
                    ))}
                  </StoreLocationList>
                </StoreLocationsContainer>
              )}
            
              {/* Amazon Purchase Links Section */}
              {amazonLinks.length > 0 && (
                <AmazonLinksContainer>
                  <StoreLocationTitle>Buy Online:</StoreLocationTitle>
                  <StoreLocationList>
                    {amazonLinks.map((item, index) => (
                      <StoreLocationItem key={index}>
                        <AmazonLink 
                          href={item.amazon_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Buy {item.product_name} on Amazon
                        </AmazonLink>
                      </StoreLocationItem>
                    ))}
                  </StoreLocationList>
                </AmazonLinksContainer>
              )}

              <h5>{time}</h5>
            </MessageBubble>
          </NestyMessageContainer>
        ) : (
          <UserMessageContainer>
            <MessageBubble $sender={sender}>
              <p>
                {message.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
              <h5>{time}</h5>
            </MessageBubble>
            <img style={{ transform: "translateX(-1px)" }} src={TopVectorTipBlue} />
          </UserMessageContainer>
        )}
      </MessageContainer>
    </AnimatedMessage>
  );
};

export default NestyChatMessage;
