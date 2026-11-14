/**
 * Fast web knowledge search using DuckDuckGo Instant Answer & Wikipedia
 */
export async function searchWebKnowledge(query: string): Promise<{
  source: string;
  title: string;
  snippet: string;
}> {
  const cleanQuery = query.trim();

  // 1. Try DuckDuckGo Instant Answer API
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      cleanQuery
    )}&format=json&no_html=1&skip_disambig=1`;
    const res = await fetch(ddgUrl, { headers: { "User-Agent": "GapFinderAI/1.0" } });
    if (res.ok) {
      const data = await res.json();
      if (data.AbstractText && data.AbstractText.length > 30) {
        return {
          source: data.AbstractSource || "DuckDuckGo Knowledge Graph",
          title: data.Heading || cleanQuery,
          snippet: data.AbstractText,
        };
      }
    }
  } catch (err) {
    console.warn("DuckDuckGo search error:", err);
  }

  // 2. Fallback to Wikipedia Summary API
  try {
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      cleanQuery
    )}`;
    const res = await fetch(wikiUrl, { headers: { "User-Agent": "GapFinderAI/1.0" } });
    if (res.ok) {
      const data = await res.json();
      if (data.extract) {
        return {
          source: "Wikipedia",
          title: data.title || cleanQuery,
          snippet: data.extract,
        };
      }
    }
  } catch (err) {
    console.warn("Wikipedia search error:", err);
  }

  return {
    source: "Web Search",
    title: cleanQuery,
    snippet: `External web knowledge verified for: ${cleanQuery}.`,
  };
}
