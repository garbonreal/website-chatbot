import { useFetchWrapper } from "../util";

function useNestyChatActions() {
  const baseUrlP = ""; // protected
  const fetchWrapper = useFetchWrapper();

  return {
    sendMessage,
  };

  // protected routes
  async function sendMessage(message) {
    try {
      const overallRoute = `${baseUrlP}/ask`;
      const serializedQuestion = { messages:[{ content:message }] };
      const { data: response } = await fetchWrapper.post(overallRoute, serializedQuestion);
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export { useNestyChatActions };
