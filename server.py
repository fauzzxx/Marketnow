"""
Unified Flask Master Backend (Market Now + LinkedIn Automation).
Run: python server.py
Listens on http://localhost:5001
"""
import os
import re
import time
import random
import traceback
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Selenium Imports
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.service import Service as EdgeService
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager

load_dotenv()

app = Flask(__name__)
# Robust CORS for dev
CORS(app, origins=["*"], allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "OPTIONS"])

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# ================= Diagnostic Logic (0-12 Scale) =================

@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "version": "1.3.0-unified-master"})

@app.post("/api/ai-visibility/analyze")
def ai_visibility_analyze():
    data = request.get_json() or {}
    brand = data.get("brand_name", "Brand")
    kw = data.get("keyword", "Keyword")
    positions = sorted(random.sample(range(1, 13), random.randint(1, 3)))
    v_scores = [max(0, 13 - p) for p in positions]
    google_score = max(v_scores)
    ai_score = random.choice([0, 12])
    final_score = round((google_score * 0.6) + (ai_score * 0.4), 1)
    return jsonify({
        "brand_positions": positions,
        "google_score": google_score,
        "ai_score": ai_score,
        "final_visibility_score": final_score,
        "ai_response_preview": f"Neural Analysis for {brand}: High semantic relevance detected for {kw} within the 2026 data vector."
    })

@app.post("/api/competitor/compare")
def competitor_compare():
    data = request.get_json() or {}
    d1 = data.get("domain1", "apple.com")
    d2 = data.get("domain2", "samsung.com")
    labels = ["Organic Density", "Neural Ranking", "Backlink Vector", "Content Velocity", "Domain Authority", "Technical SEO", "UX Sentiment"]
    graph1 = [random.randint(4, 12) for _ in labels]
    graph2 = [random.randint(3, 11) for _ in labels]
    return jsonify({
        "keywords_used": labels,
        "graph_data": {"labels": labels, "company1": graph1, "company2": graph2},
        "keyword_comparison": [{"keyword": k, "company1_position": random.randint(1, 10), "company2_position": random.randint(1, 10)} for k in labels],
        "summary": {
            "domain1": {"domain": d1, "indexed_pages": random.randint(1000, 5000), "top_pages": []},
            "domain2": {"domain": d2, "indexed_pages": random.randint(800, 4000), "top_pages": []}
        }
    })

@app.post("/api/keyword-research/analyze")
def keyword_research_analyze():
    data = request.get_json() or {}
    keyword = data.get("keyword", "Market")
    modifiers = ["best", "top", "guide", "free", "tutorial", "2026", "software", "agency"]
    results = []
    for m in modifiers:
        results.append({
            "keyword": f"{m} {keyword}",
            "estimated_search_volume_proxy": random.randint(10000, 90000),
            "difficulty": random.choice(["Low", "Medium", "High"])
        })
    return jsonify({"keywords": results})

@app.post("/api/ppc/ads")
def ppc_ads():
    return jsonify({"ads": [
        {"ad_type": "Search Ad", "title": "Premium Solution", "price": "$199", "source": "Google Ads"},
        {"ad_type": "Social Ad", "title": "Market Dominator", "price": "$299", "source": "Meta Ads"}
    ]})

@app.post("/api/ppc/calculator")
def ppc_calculator():
    data = request.get_json() or {}
    cpc = float(data.get("cpc", 1)); budget = float(data.get("daily_budget", 100))
    conv = float(data.get("conversion_rate", 2)) / 100.0; val = float(data.get("avg_order_value", 50))
    clicks = budget / cpc if cpc else 0; conversions = clicks * conv
    rev = conversions * val; profit = rev - budget
    return jsonify({
        "estimated_clicks_per_day": round(clicks, 1),
        "estimated_conversions_per_day": round(conversions, 1),
        "estimated_revenue_per_day": round(rev, 1),
        "estimated_profit_loss": round(profit, 1)
    })

# ================= LinkedIn Automation Logic =================

def _create_driver():
    """Prefer Edge, fall back to Chrome (handles offline/DNS issues)"""
    opts = ["--start-maximized", "--disable-blink-features=AutomationControlled", "--disable-gpu", "--no-sandbox"]
    try:
        eo = EdgeOptions(); [eo.add_argument(a) for a in opts]
        return webdriver.Edge(service=EdgeService(EdgeChromiumDriverManager().install()), options=eo)
    except:
        co = ChromeOptions(); [co.add_argument(a) for a in opts]
        return webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=co)

def linkedin_login(driver, email, password):
    driver.get("https://www.linkedin.com/login")
    wait = WebDriverWait(driver, 20)
    try:
        user_field = wait.until(EC.presence_of_element_located((By.ID, "username")))
        user_field.send_keys(email)
        driver.find_element(By.ID, "password").send_keys(password)
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(5)
        if "checkpoint" in driver.current_url:
            raise Exception("Security Checkpoint triggered. Solve manually in browser.")
    except Exception as e:
        raise Exception(f"Login Failure: {str(e)}")

def post_on_linkedin(post_text, email, password):
    driver = _create_driver()
    try:
        wait = WebDriverWait(driver, 40)
        linkedin_login(driver, email, password)
        driver.get("https://www.linkedin.com/feed/")
        time.sleep(6)
        
        # Trigger 'Start a post'
        selectors = ["//span[contains(text(),'Start a post')]", "//button[contains(.,'Start a post')]", "//*[contains(@class, 'share-box-feed-entry__trigger')]"]
        trigger = None
        for s in selectors:
            try: trigger = wait.until(EC.element_to_be_clickable((By.XPATH, s))); break
            except: continue
        if not trigger: raise Exception("Could not find Post button.")
        driver.execute_script("arguments[0].click();", trigger)
        
        # Wait for Shadow DOM editor
        wait.until(lambda d: d.execute_script("return !!(document.querySelector('#interop-outlet') && document.querySelector('#interop-outlet').shadowRoot)"))
        time.sleep(3)
        
        # Enter Text
        html = post_text.replace("\n", "<br>")
        driver.execute_script("""
            var root = document.querySelector("#interop-outlet").shadowRoot;
            var p = root.querySelector(".ql-editor.ql-blank p") || root.querySelector(".ql-editor p") || root.querySelector("p");
            p.focus(); p.innerHTML = arguments[0];
            p.dispatchEvent(new Event("input", { bubbles: true }));
        """, html)
        time.sleep(2)
        
        # Final Post
        driver.execute_script("""
            var root = document.querySelector("#interop-outlet").shadowRoot;
            var btn = root.querySelector("button.share-actions__primary-action") || root.querySelector(".share-actions__primary-action");
            btn.click();
        """)
        time.sleep(10) # wait for upload
    finally:
        driver.quit()

@app.post("/api/linkedin/publish")
def linkedin_publish():
    data = request.get_json() or {}
    email = data.get("email"); pwd = data.get("password"); txt = data.get("post")
    if not email or not pwd or not txt: return jsonify({"error": "Missing fields"}), 400
    try:
        post_on_linkedin(txt, email, pwd)
        return jsonify({"status": "Success"})
    except Exception as e:
        traceback.print_exc()
        msg = str(e)
        if "checkpoint" in msg.lower(): return jsonify({"error": "LinkedIn Security Checkpoint. Sign in manually first."}), 403
        return jsonify({"error": f"Automation Error: {msg}"}), 500

@app.post("/api/linkedin/generate")
def linkedin_generate():
    # Placeholder for LLM generation
    data = request.get_json() or {}
    idea = data.get("idea", "Brand Innovation")
    return jsonify({"post": f"Industry Insight: {idea} is transforming the digital landscape. Innovation is key to staying ahead. #MarketNow #Innovation"})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
