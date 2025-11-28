from flask import Flask, request, jsonify
from flask_cors import CORS
from agents.orchestrator_agent import OrchestratorAgent
from config import Config
import logging
from functools import wraps
import time

# Initialize Flask app
app = Flask(_name_)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)

# Validate configuration
Config.validate()

# Initialize orchestrator
orchestrator = OrchestratorAgent()

# Rate limiting decorator
def rate_limit(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Simple in-memory rate limiting (use Redis in production)
        user_id = request.json.get('user_id') if request.json else None
        if user_id:
            # Check rate limit in MongoDB
            pass
        return f(*args, **kwargs)
    return decorated

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "VeriPulse API",
        "version": "1.0.0"
    })

@app.route('/api/verify', methods=['POST'])
@rate_limit
def verify_claim():
    """Verify a single claim (main endpoint)"""
    try:
        data = request.json
        
        # Validate input
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' field"}), 400
        
        text = data['text']
        user_id = data.get('user_id')
        
        if len(text) < 10:
            return jsonify({"error": "Claim text too short"}), 400
        
        if len(text) > 1000:
            return jsonify({"error": "Claim text too long (max 1000 chars)"}), 400
        
        # Verify claim
        logger.info(f"Verifying claim: {text[:100]}")
        result = orchestrator.verify_single_claim(text, user_id, platform="web")
        
        if "error" in result:
            return jsonify(result), 429
        
        return jsonify({
            "success": True,
            "data": result
        })
    
    except Exception as e:
        logger.error(f"Error verifying claim: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/verify-url', methods=['POST'])
@rate_limit
def verify_url():
    """Verify a claim from a URL"""
    try:
        data = request.json
        
        if not data or 'url' not in data:
            return jsonify({"error": "Missing 'url' field"}), 400
        
        url = data['url']
        
        # Fetch article content
        from services.source_crawler import SourceCrawler
        crawler = SourceCrawler()
        article = crawler.fetch_article_content(url)
        
        if not article:
            return jsonify({"error": "Could not fetch article"}), 400
        
        # Extract main claim from article
        text = f"{article['title']} {article['text'][:500]}"
        
        # Verify
        result = orchestrator.verify_single_claim(text, platform="web")
        
        result['source_url'] = url
        result['source_title'] = article['title']
        
        return jsonify({
            "success": True,
            "data": result
        })
    
    except Exception as e:
        logger.error(f"Error verifying URL: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/trending', methods=['GET'])
def get_trending():
    """Get trending verified claims"""
    try:
        keywords = request.args.get('keywords', 'tsunami,earthquake,flood,pandemic').split(',')
        
        trending = orchestrator.monitor_trending_claims(keywords)
        
        return jsonify({
            "success": True,
            "data": trending,
            "count": len(trending)
        })
    
    except Exception as e:
        logger.error(f"Error getting trending: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/bot/mentions', methods=['POST'])
def process_mentions():
    """Process bot mentions (called by bot monitor service)"""
    try:
        # Authenticate bot service (add auth token in production)
        results = orchestrator.process_bot_mentions_batch()
        
        return jsonify({
            "success": True,
            "processed": len(results),
            "results": results
        })
    
    except Exception as e:
        logger.error(f"Error processing mentions: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/crawl', methods=['POST'])
def trigger_crawl():
    """Trigger source crawling (admin endpoint)"""
    try:
        # Add authentication in production
        count = orchestrator.crawl_and_index_sources()
        
        return jsonify({
            "success": True,
            "message": f"Indexed {count} articles"
        })
    
    except Exception as e:
        logger.error(f"Error crawling: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get system statistics"""
    try:
        stats = orchestrator.get_statistics()
        return jsonify({
            "success": True,
            "data": stats
        })
    
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get verification history"""
    try:
        limit = int(request.args.get('limit', 20))
        
        # Get recent verifications from MongoDB
        from services.mongodb_service import MongoDBService
        mongo = MongoDBService()
        
        verifications = list(mongo.db.verifications.find().sort("timestamp", -1).limit(limit))
        
        # Convert ObjectId to string
        for v in verifications:
            v['_id'] = str(v['_id'])
            v['claim_id'] = str(v.get('claim_id', ''))
        
        return jsonify({
            "success": True,
            "data": verifications,
            "count": len(verifications)
        })
    
    except Exception as e:
        logger.error(f"Error getting history: {e}")
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500

if _name_ == '_main_':
    # Initial crawl on startup
    logger.info("Starting initial source crawl...")
    try:
        count = orchestrator.crawl_and_index_sources()
        logger.info(f"Indexed {count} articles from trusted sources")
    except Exception as e:
        logger.error(f"Initial crawl failed: {e}")
    
    # Start Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=Config.FLASK_ENV == 'development'
    )