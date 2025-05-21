import React, { useState } from "react";
import NestyChatWindow from "./NestyChatWindow";
import NestyChatBubble from "./NestyChatBubble";

function NestyChat() {
  return (
    <div style={{ position: "relative", zIndex: "90" }}>
      <NestyChatWindow />
      <NestyChatBubble />
    </div>
  );
}

export default NestyChat;
