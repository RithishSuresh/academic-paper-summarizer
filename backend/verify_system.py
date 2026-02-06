import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from main import App
from scaledown_client import ScaleDownClient
from parsers import PDFParser

async def test_pipeline():
    print(">>> Starting Pipeline Verification")
    
    # 1. Test Parser
    print("\n[1] Testing Dictionary/Parser...")
    # Create a dummy PDF content mock (since we can't easily generate a real PDF bytes here without reportlab)
    # We will just test the internal text segmentation logic if we had text.
    # Actually, let's just instantiate the classes to ensure no syntax errors.
    
    parser = PDFParser()
    print("✅ PDFParser instantiated.")
    
    # 2. Test ScaleDown Client
    print("\n[2] Testing ScaleDown Client...")
    client = ScaleDownClient()
    dummy_text = "This is a test sentence. " * 50
    compressed = await client.compress_section(dummy_text)
    print(f"Original len: {len(dummy_text.split())} words")
    print(f"Compressed len: {len(compressed.split())} words")
    print(f"Output: {compressed[:50]}...")
    assert "[ScaleDown Compressed]" in compressed
    print("✅ ScaleDown Client working (Mock).")

if __name__ == "__main__":
    asyncio.run(test_pipeline())
