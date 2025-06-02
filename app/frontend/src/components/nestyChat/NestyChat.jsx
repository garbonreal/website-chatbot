import React, { useState } from "react";
import NestyChatWindow from "./NestyChatWindow";
import NestyChatBubble from "./NestyChatBubble";
import useUserLocation from "./useUserLocation";
import LocationPermissionPrompt from "./LocationPermissionPrompt";

function NestyChat() {
  useUserLocation();
  return (
    <div style={{ position: "relative", zIndex: "90" }}>
      <NestyChatWindow />
      <NestyChatBubble />
      <LocationPermissionPrompt />
    </div>
  );
}

export default NestyChat;
