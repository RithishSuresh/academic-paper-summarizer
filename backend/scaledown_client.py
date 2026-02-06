import random

class ScaleDownClient:
    def __init__(self, api_key: str = "mock-key"):
        self.api_key = api_key
        self.reduction_target = 0.75  # 75% reduction

    async def compress_section(self, text: str) -> str:
        """
        Simulates the ScaleDown API compression.
        Returns ~25% of the original text, preserving "scientific meaning" (mocked).
        """
        if not text:
            return ""

        words = text.split()
        original_count = len(words)
        target_count = int(original_count * (1 - self.reduction_target))
        
        # Mock compression: Keep first few words, some middle, and last few words 
        # to simulate structure retention + add a tag.
        
        if original_count <= target_count:
            return text

        # Simple sampling for mock purposes
        # In a real scenario, this would call the API
        
        part_size = target_count // 3
        start = words[:part_size]
        middle = words[original_count//2 : original_count//2 + part_size]
        end = words[-part_size:]
        
        compressed_text = " ".join(start + ["[...]"] + middle + ["[...]"] + end)
        
        return f"[ScaleDown Compressed] {compressed_text}"

    def get_stats(self):
        return {
            "compression_ratio": "75%",
            "latency_improvement": "4x",
            "model": "ScaleDown-Sci-v1"
        }
