import { useFetchWrapper } from "../util";

function useNestyChatActions() {
  const baseUrlP = ""; // protected
  const fetchWrapper = useFetchWrapper();

  return {
    sendMessage,
  };

  // protected routes
  async function sendMessage(requestData) {
    try {
      const overallRoute = `${baseUrlP}/ask`;
      const serializedQuestion = {
        messages: requestData.messages,
        location: requestData.userLocation,
        context: {
          overrides: {
            prompt_template:
              "You are an intelligent assistant designed to help users explore the content of the Made with Nestlé website. \
              Use 'you' to refer to the individual asking the question, even if they use 'I'. \
              Answer the question based on the sources provided below. If the answer cannot be found in the sources, respond based on your understanding of the website and clearly state that the information is based on your interpretation, not the sources. \
              Always include the source name for any fact used from the sources. \
              If no reliable information can be found or inferred, say 'I don't know.'",
            top: 3,
            max_subqueries: 10,
            results_merge_strategy: "interleaved",
            temperature: 0.3,
            minimum_reranker_score: 0,
            minimum_search_score: 0,
            retrieval_mode: "hybrid",
            semantic_ranker: false,
            semantic_captions: false,
            query_rewriting: false,
            reasoning_effort: "",
            suggest_followup_questions: false,
            use_oid_security_filter: false,
            use_groups_security_filter: false,
            vector_fields: "textAndImageEmbeddings",
            use_gpt4v: false,
            gpt4v_input: "textAndImages",
            language: "en",
          },
        },
        session_state: null,
      };
      const { data: response } = await fetchWrapper.post(
        overallRoute,
        serializedQuestion
      );
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export { useNestyChatActions };
