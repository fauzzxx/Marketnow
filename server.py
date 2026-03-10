"""
Flask API for the SEO/AI Visibility toolkit.
Run: python server.py
Listens on http://localhost:5001 (CORS enabled for Next.js frontend).
"""
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Allow all origins in dev so it works with localhost, 127.0.0.1, or LAN IP
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/api/ai-visibility/analyze")
def ai_visibility_analyze():
    data = request.get_json() or {}
    brand_name = data.get("brand_name", "")
    keyword = data.get("keyword", "")
    return jsonify({
        "brand_positions": [],
        "google_score": 0,
        "ai_response_preview": f"Stub: analysis for '{brand_name}' and '{keyword}'. Implement SerpAPI + Gemini in server.py.",
        "ai_score": 0,
        "final_visibility_score": 0,
    })


@app.post("/api/ppc/ads")
def ppc_ads():
    data = request.get_json() or {}
    return jsonify({"ads": []})


@app.post("/api/ppc/calculator")
def ppc_calculator():
    data = request.get_json() or {}
    cpc = float(data.get("cpc", 0))
    daily_budget = float(data.get("daily_budget", 0))
    conversion_rate = float(data.get("conversion_rate", 0)) / 100.0
    avg_order_value = float(data.get("avg_order_value", 0))
    clicks = daily_budget / cpc if cpc else 0
    conversions = clicks * conversion_rate if conversion_rate else 0
    revenue = conversions * avg_order_value if avg_order_value else 0
    profit_loss = revenue - daily_budget
    return jsonify({
        "estimated_clicks_per_day": round(clicks, 2),
        "estimated_conversions_per_day": round(conversions, 2),
        "estimated_revenue_per_day": round(revenue, 2),
        "estimated_profit_loss": round(profit_loss, 2),
    })


@app.post("/api/keyword-research/analyze")
def keyword_research_analyze():
    return jsonify({"keywords": []})


@app.post("/api/competitor/analyze")
def competitor_analyze():
    return jsonify({
        "ranking_keywords": [],
        "estimated_indexed_pages": 0,
        "top_ranking_content": [],
    })


@app.post("/api/content/topic-research")
def content_topic_research():
    return jsonify({"related_searches": [], "people_also_ask": []})


@app.post("/api/content/seo-analysis")
def content_seo_analysis():
    return jsonify({
        "word_count": 0,
        "keyword_count": 0,
        "keyword_density_percent": 0,
        "readability_score": 0,
    })


@app.post("/api/content/ai-suggestions")
def content_ai_suggestions():
    return jsonify({"suggestions": ""})


@app.post("/api/local-seo/business")
def local_seo_business():
    return jsonify({"found": False, "business": None})


@app.post("/api/advanced/site-audit")
def advanced_site_audit():
    return jsonify({"title": "", "meta_description": ""})


@app.post("/api/advanced/onpage")
def advanced_onpage():
    return jsonify({"keyword_count": 0})


@app.post("/api/advanced/position")
def advanced_position():
    return jsonify({"position": None, "found": False})


@app.post("/api/advanced/backlinks")
def advanced_backlinks():
    return jsonify({"estimated_mentions": 0})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
