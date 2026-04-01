const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
const API_TIMEOUT_MS = 300_000; // 5 min default; long for keyword/SerpAPI and browser automation

async function request<T>(
  endpoint: string,
  options: Omit<RequestInit, "body"> & { body?: any; timeoutMs?: number } = {}
): Promise<T> {
  const { body, timeoutMs, ...rest } = options;
  const url = `${API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeout = timeoutMs ?? API_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

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
    let data: T & { error?: string };
    try {
      data = text ? (JSON.parse(text) as T & { error?: string }) : ({} as T & { error?: string });
    } catch {
      throw new Error(`Server returned invalid response. Check that the backend is running at ${API_BASE}`);
    }
    if (!res.ok) {
      throw new Error((data as { error?: string }).error || res.statusText || `Request failed (${res.status})`);
    }
    return data as T;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new Error("Request timed out. The API may be slow (keyword lookups, LinkedIn automation). Try again.");
      }
      if (err.message === "Failed to fetch" || err.message.includes("Load failed") || err.message.includes("NetworkError")) {
        throw new Error(
          `Cannot reach the API at ${url}. Open ${API_BASE}/api/health in your browser — if it fails, start backend: cd marketnow_backend && python server3.py`
        );
      }
      throw err;
    }
    throw err;
  }
}

async function requestFormData<T>(
  endpoint: string,
  formData: FormData,
  timeoutMs: number = 360_000
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
      signal: controller.signal,
      // Do not set Content-Type; browser sets multipart/form-data with boundary
    });
    clearTimeout(timeoutId);
    const text = await res.text();
    let data: T & { error?: string };
    try {
      data = (text ? JSON.parse(text) : {}) as T & { error?: string };
    } catch {
      throw new Error(`Server returned invalid response. Check that the backend is running at ${API_BASE}`);
    }
    if (!res.ok) {
      throw new Error(data.error || res.statusText || `Request failed (${res.status})`);
    }
    return data as T;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new Error("Request timed out. LinkedIn automation can take a while — try again.");
      }
      if (err.message === "Failed to fetch" || err.message.includes("Load failed") || err.message.includes("NetworkError")) {
        throw new Error(`Cannot reach the API at ${url}. Make sure the backend is running.`);
      }
      throw err;
    }
    throw err;
  }
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
    siteAudit: (url: string, js?: boolean) =>
      request<{
        title: string | null; title_length: number;
        meta_description: string | null; meta_description_length: number;
        meta_keywords: string | null;
        open_graph: Record<string, string>;
        canonical_url: string | null;
        h1_count: number; h1_texts: string[];
        h2_count: number; h2_texts: string[];
        total_images: number; images_with_alt: number; alt_coverage_percent: number;
        url_audited: string; status_code: number | null;
        rendered_with: string;
      }>("/api/advanced/site-audit", {
        method: "POST",
        body: { url, ...(js ? { js: true } : {}) },
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
    publish: (params: { email: string; password: string; post: string; image?: File }) => {
      const formData = new FormData();
      formData.append("email", params.email.trim());
      formData.append("password", params.password);
      formData.append("post", params.post.trim());
      if (params.image) formData.append("image", params.image);
      return requestFormData<{ status: string }>("/api/linkedin/publish", formData);
    },
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
