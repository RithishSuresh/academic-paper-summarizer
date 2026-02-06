import fitz  # PyMuPDF
import re
from typing import Dict, List, Optional

class PDFParser:
    def __init__(self):
        self.SECTION_HEADERS = [
            "ABSTRACT", "INTRODUCTION", "RELATED WORK", "BACKGROUND",
            "METHODOLOGY", "METHODS", "PROPOSED APPROACH",
            "EXPERIMENTS", "RESULTS", "EVALUATION",
            "DISCUSSION", "CONCLUSION", "REFERENCES"
        ]

    def parse_pdf(self, file_bytes: bytes) -> Dict[str, str]:
        """
        Parses a PDF file bytes and returns a dictionary mapping section names to content.
        """
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        
        return self._segment_text(text)

    def _segment_text(self, text: str) -> Dict[str, str]:
        """
        Naive segmentation based on section headers.
        """
        lines = text.split('\n')
        sections = {}
        current_section = "Metadata"
        current_content = []

        for line in lines:
            clean_line = line.strip().upper()
            # Simple heuristic: Exact match or match with numbering like "1. INTRODUCTION"
            is_header = False
            for header in self.SECTION_HEADERS:
                # Regex for "1. INTRODUCTION" or just "INTRODUCTION"
                if re.match(rf"^(\d+\.?\s*)?{header}$", clean_line):
                    # Save previous section
                    if current_content:
                        sections[current_section] = "\n".join(current_content).strip()
                    
                    current_section = header
                    current_content = []
                    is_header = True
                    break
            
            if not is_header:
                current_content.append(line)
        
        # Save last section
        if current_content:
            sections[current_section] = "\n".join(current_content).strip()
            
        return sections

    def extract_metadata(self, file_bytes: bytes) -> Dict[str, str]:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        return doc.metadata
