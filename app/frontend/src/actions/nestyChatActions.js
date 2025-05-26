import { useFetchWrapper } from "../util";

function useNestyChatActions() {
  const baseUrlP = ""; // protected
  const fetchWrapper = useFetchWrapper();

  return {
    sendMessage,
  };

  // protected routes
  async function sendMessage(messages) {
    try {
      const overallRoute = `${baseUrlP}/ask`;
      const serializedQuestion = {
        "messages": messages,
        "context": {
          "overrides": {
            "top": 3,
            "max_subqueries": 10,
            "results_merge_strategy": "interleaved",
            "temperature": 0.3,
            "minimum_reranker_score": 0,
            "minimum_search_score": 0,
            "retrieval_mode": "hybrid",
            "semantic_ranker": false,
            "semantic_captions": false,
            "query_rewriting": false,
            "reasoning_effort": "",
            "suggest_followup_questions": false,
            "use_oid_security_filter": false,
            "use_groups_security_filter": false,
            "vector_fields": "textAndImageEmbeddings",
            "use_gpt4v": false,
            "gpt4v_input": "textAndImages",
            "language": "en"
          }
        },
        "session_state": null
      };
      const { data: response } = await fetchWrapper.post(overallRoute, serializedQuestion);
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export { useNestyChatActions };
