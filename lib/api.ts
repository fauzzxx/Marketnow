const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const API_TIMEOUT_MS = 90_000; // 90s for slow SerpAPI/keyword loops

async function request<T>(
  endpoint: string,
  options: RequestInit & { body?: object } = {}
): Promise<T> {
  const { body, ...rest } = options;
  const url = `${API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    clearTimeout(timeoutId);
    const text = await res.text();
    const data = text ? (JSON.parse(text) as T & { error?: string }) : ({} as T & { error?: string });
    if (!res.ok) {
      throw new Error((data as { error?: string }).error || res.statusText || `Request failed (${res.status})`);
    }
    return data as T;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new Error("Request timed out. The API may be slow (e.g. many keyword lookups). Try again.");
      }
      if (err.message === "Failed to fetch" || err.message.includes("Load failed")) {
        throw new Error(
          "Cannot reach the API. Ensure the Flask server is running (python server.py on port 5001) and CORS is allowed."
        );
      }
      throw err;
    }
    throw err;
  }
}

async function requestFormData<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    body: formData,
    // Do not set Content-Type; browser sets multipart/form-data with boundary
  });
  const text = await res.text();
  const data = (text ? JSON.parse(text) : {}) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || res.statusText || `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  aiVisibility: {
    analyze: (brand_name: string, keyword: string) =>
      request<{
        brand_positions: number[];
        google_score: number;
        ai_response_preview: string;
        ai_score: number;
        final_visibility_score: number;
      }>("/api/ai-visibility/analyze", { method: "POST", body: { brand_name, keyword } }),
  },
  ppc: {
    getAds: (keyword: string) =>
      request<{ ads: { ad_type: string; title: string; price: string; source: string; product_link: string }[] }>(
        "/api/ppc/ads",
        { method: "POST", body: { keyword } }
      ),
    calculator: (params: {
      cpc: number;
      daily_budget: number;
      conversion_rate: number;
      avg_order_value: number;
    }) =>
      request<{
        estimated_clicks_per_day: number;
        estimated_conversions_per_day: number;
        estimated_revenue_per_day: number;
        estimated_profit_loss: number;
      }>("/api/ppc/calculator", { method: "POST", body: params }),
  },
  keywordResearch: {
    analyze: (keyword: string) =>
      request<{
        keywords: { keyword: string; estimated_search_volume_proxy: number; difficulty: string }[];
      }>("/api/keyword-research/analyze", { method: "POST", body: { keyword } }),
  },
  competitor: {
    compare: (domain1: string, domain2: string, query: string) =>
      request<{
        keywords_used: string[];
        keyword_comparison: { keyword: string; company1_position: number | null; company2_position: number | null }[];
        graph_data: { labels: string[]; company1: number[]; company2: number[] };
        summary: {
          domain1: { domain: string; indexed_pages: number; top_pages: { title: string; url: string }[] };
          domain2: { domain: string; indexed_pages: number; top_pages: { title: string; url: string }[] };
        };
      }>("/api/competitor/compare", { method: "POST", body: { domain1, domain2, query } }),
  },
  content: {
    topicResearch: (keyword: string) =>
      request<{ related_searches: string[]; people_also_ask: string[] }>(
        "/api/content/topic-research",
        { method: "POST", body: { keyword } }
      ),
    seoAnalysis: (keyword: string, text: string) =>
      request<{
        word_count: number;
        keyword_count: number;
        keyword_density_percent: number;
        readability_score: number;
      }>("/api/content/seo-analysis", { method: "POST", body: { keyword, text } }),
    aiSuggestions: (keyword: string) =>
      request<{ suggestions: string }>("/api/content/ai-suggestions", { method: "POST", body: { keyword } }),
  },
  localSeo: {
    business: (business_name: string, location: string) =>
      request<{ found: boolean; business: Record<string, unknown> | null }>(
        "/api/local-seo/business",
        { method: "POST", body: { business_name, location } }
      ),
  },
  advanced: {
    siteAudit: (url: string) =>
      request<{ title: string; meta_description: string }>("/api/advanced/site-audit", {
        method: "POST",
        body: { url },
      }),
    onpage: (url: string, keyword: string) =>
      request<{ keyword_count: number }>("/api/advanced/onpage", { method: "POST", body: { url, keyword } }),
    position: (domain: string, keyword: string) =>
      request<{ position: number | null; found: boolean }>("/api/advanced/position", {
        method: "POST",
        body: { domain, keyword },
      }),
    backlinks: (domain: string) =>
      request<{ estimated_mentions: number }>("/api/advanced/backlinks", { method: "POST", body: { domain } }),
  },
  health: () => request<{ status: string }>("/api/health", { method: "GET" }),

  youtube: {
    script: (idea: string) =>
      request<{ idea: string; script: string }>("/api/youtube/script", {
        method: "POST",
        body: { idea: idea.trim() },
      }),
  },

  linkedin: {
    generate: (prompt: string) =>
      request<{ post: string }>("/api/linkedin/generate", {
        method: "POST",
        body: { prompt: prompt.trim() },
      }),
    improve: (prompt: string, feedback: string) =>
      request<{ post: string }>("/api/linkedin/improve", {
        method: "POST",
        body: { prompt: prompt.trim(), feedback: feedback.trim() },
      }),
    publish: (params: { email: string; password: string; post: string }) =>
      request<{ status: string }>("/api/linkedin/publish", {
        method: "POST",
        body: {
          email: params.email.trim(),
          password: params.password,
          post: params.post.trim(),
        },
      }),
  },

  email: {
    sendBulk: (params: {
      email: string;
      password: string;
      subject: string;
      body: string;
      column: number;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("email", params.email.trim());
      formData.append("password", params.password);
      formData.append("subject", params.subject.trim());
      formData.append("body", params.body.trim());
      formData.append("column", String(params.column));
      formData.append("file", params.file);
      return requestFormData<{
        total_emails: number;
        results: { email: string; status: string; error?: string }[];
      }>("/api/email/send-bulk", formData);
    },
  },

  chatbot: {
    send: (message: string) =>
      request<{ reply: string }>("/api/chatbot", {
        method: "POST",
        body: { message: message.trim() },
      }),
  },
};
