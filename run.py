"""
BhoomiDrishti - Server Entry Point
Runs FastAPI backend + static GovTech frontend on port 8000
"""

import uvicorn
import os
import sys

# Ensure backend directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print("=" * 70)
    print("  BHOOMIDRISHTI - NATIONAL DIGITAL LAND GOVERNANCE PLATFORM")
    print("  Smart India Hackathon 2026 Prototype")
    print("=" * 70)
    print(f"  Server starting at: http://127.0.0.1:{port}")
    print("  Open this URL in your browser to start the interactive demo.")
    print("  Press Ctrl+C to terminate.")
    print("=" * 70)
    
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=False)
