import chromadb
from chromadb.utils import embedding_functions
from typing import List, Dict, Any
import uuid

class RAGEngine:
    def __init__(self, persist_path: str = "./db"):
        self.client = chromadb.PersistentClient(path=persist_path)
        # Using a default embedding function for simplicity in scaffolding
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self.collection = self.client.get_or_create_collection(
            name="academic_papers",
            embedding_function=self.embedding_fn
        )

    def add_paper_sections(self, paper_id: str, sections: Dict[str, str]):
        """
        Embeds and indexes sections of a paper.
        """
        ids = []
        documents = []
        metadatas = []

        for section_name, content in sections.items():
            doc_id = f"{paper_id}_{section_name}"
            ids.append(doc_id)
            documents.append(content)
            metadatas.append({
                "paper_id": paper_id,
                "section": section_name
            })
        
        if documents:
            self.collection.add(
                ids=ids,
                documents=documents,
                metadatas=metadatas
            )

    def query_context(self, query: str, n_results: int = 3) -> List[str]:
        """
        Retrieves relevant sections for a given query.
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return results["documents"][0] if results["documents"] else []

    def get_related_work_suggestions(self, abstract: str) -> List[Dict[str, Any]]:
        """
        Finds papers with similar abstracts.
        """
        results = self.collection.query(
            query_texts=[abstract],
            n_results=5,
            where={"section": "ABSTRACT"}
        )
        
        suggestions = []
        if results["metadatas"]:
            for meta in results["metadatas"][0]:
                suggestions.append(meta)
                
        return suggestions
