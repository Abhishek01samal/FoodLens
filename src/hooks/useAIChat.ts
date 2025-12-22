import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AIChatParams {
  mode: string;
  message: string;
  productA?: string;
  productB?: string;
  images?: string[];
}

interface AIChatResponse {
  type?: string;
  suggestions?: string[];
  comparison?: any;
  productName?: string;
  dishName?: string;
  [key: string]: any;
}

// Cache for autocomplete results
const autocompleteCache = new Map<string, string[]>();

export const useAIChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AIChatParams): Promise<AIChatResponse> => {
      // Check cache for autocomplete
      if (params.mode === 'autocomplete') {
        const cached = autocompleteCache.get(params.message.toLowerCase());
        if (cached) return { suggestions: cached };
      }

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: params
      });

      if (error) throw error;

      // Cache autocomplete results
      if (params.mode === 'autocomplete' && data?.suggestions) {
        autocompleteCache.set(params.message.toLowerCase(), data.suggestions);
        // Limit cache size
        if (autocompleteCache.size > 100) {
          const firstKey = autocompleteCache.keys().next().value;
          if (firstKey) autocompleteCache.delete(firstKey);
        }
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // Cache successful responses
      const cacheKey = `ai-chat-${variables.mode}-${variables.message}`;
      queryClient.setQueryData([cacheKey], data);
    },
  });
};

export const useAutocomplete = () => {
  return useMutation({
    mutationFn: async (query: string): Promise<string[]> => {
      if (query.length < 2) return [];
      
      // Check cache first
      const cached = autocompleteCache.get(query.toLowerCase());
      if (cached) return cached;

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { mode: 'autocomplete', message: query }
      });

      if (error) throw error;
      
      const suggestions = data?.suggestions || [];
      autocompleteCache.set(query.toLowerCase(), suggestions);
      
      return suggestions;
    },
  });
};
