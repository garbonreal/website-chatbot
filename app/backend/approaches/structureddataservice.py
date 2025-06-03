import re
from typing import List, Dict, Any, Union
from dataclasses import dataclass, asdict
from enum import Enum

class QueryType(Enum):
    COUNT = "count"
    RECOMMENDATION = "recommendation" 
    SEARCH = "search"

@dataclass
class Product:
    id: int
    brand: str
    category: Union[str, List[str]]
    
    def to_dict(self):
        return asdict(self)
    
    def get_categories(self) -> List[str]:
        if isinstance(self.category, list):
            return self.category
        else:
            return [self.category]

class StructuredDataService:
    def __init__(self):
        self.product_database = self._initialize_product_database()
        self.structured_index = self._build_structured_index()
        
    def _initialize_product_database(self) -> List[Product]:
        products_data = [
            {"id": 1, "brand": "Aero", "category": "chocolate"},
            {"id": 2, "brand": "COFFEE CRISP", "category": "chocolate"},
            {"id": 3, "brand": "Drumstick bites", "category": "chocolate"},
            {"id": 4, "brand": "Kit Kat", "category": "chocolate"},
            {"id": 5, "brand": "Smarties", "category": "chocolate"},
            {"id": 6, "brand": "Turtles", "category": "chocolate"},
            {"id": 7, "brand": "After Eight", "category": "chocolate"},
            {"id": 8, "brand": "Big Turk", "category": "chocolate"},
            {"id": 9, "brand": "Crunch", "category": "chocolate"},
            {"id": 10, "brand": "Easter chocolates and treats", "category": "chocolate"},
            {"id": 11, "brand": "Mackintosh Toffee", "category": "chocolate"},
            {"id": 12, "brand": "Mirage", "category": "chocolate"},
            {"id": 13, "brand": "Quality Street", "category": "chocolate"},
            {"id": 14, "brand": "Rolo", "category": "chocolate"},
            {"id": 15, "brand": "Coffee Mate", "category": "coffee"},
            {"id": 16, "brand": "NESCAFÉ", "category": "coffee"},
            {"id": 17, "brand": "Confectionery Frozen Desserts", "category": "ice cream"},
            {"id": 18, "brand": "Häagen-Dazs", "category": "ice cream"},
            {"id": 19, "brand": "Drumstick", "category": "ice cream"},
            {"id": 20, "brand": "IÖGO", "category": "ice cream"},
            {"id": 21, "brand": "Del Monte", "category": "ice cream"},
            {"id": 22, "brand": "Parlour", "category": "ice cream"},
            {"id": 23, "brand": "Real Dairy", "category": "ice cream"},
            {"id": 24, "brand": "Nido", "category": "infant nutrition"},
            {"id": 25, "brand": "Nestlé Materna", "category": "infant nutrition"},
            {"id": 26, "brand": "MAGGI", "category": "condiments"},
            {"id": 27, "brand": "BOOST Kids", "category": "nutrition"},
            {"id": 28, "brand": "Boost", "category": "nutrition"},
            {"id": 29, "brand": "Purina", "category": "pet foods"},
            {"id": 30, "brand": "Essentia", "category": ["spring water", "sparkling water"]},
            {"id": 31, "brand": "Maison Perrier", "category": ["spring water", "sparkling water"]},
            {"id": 32, "brand": "Perrier", "category": ["spring water", "sparkling water"]},
            {"id": 33, "brand": "San Pellegrino", "category": ["spring water", "sparkling water"]},
            {"id": 34, "brand": "GoodHost", "category": "quick-mix drinks"},
            {"id": 35, "brand": "Milo", "category": "quick-mix drinks"},
            {"id": 36, "brand": "NESTEA", "category": "quick-mix drinks"},
            {"id": 37, "brand": "Nesfruta", "category": "quick-mix drinks"},
            {"id": 38, "brand": "Carnation Hot Chocolate", "category": "quick-mix drinks"},
            {"id": 39, "brand": "Nesquik", "category": "quick-mix drinks"}
        ]
        
        return [Product(**data) for data in products_data]
    
    def _build_structured_index(self) -> Dict[str, Dict[str, Any]]:
        index = {
            "categories": {},
        }
        
        for product in self.product_database:
            categories = product.get_categories()
            for category in categories:
                if category not in index["categories"]:
                    index["categories"][category] = {"count": 0, "product_ids": []}
                index["categories"][category]["count"] += 1
                index["categories"][category]["product_ids"].append(product.id)
        
        return index
    
    def _get_products_by_ids(self, product_ids: List[int]) -> List[Product]:
        return [product for product in self.product_database if product.id in product_ids]
    
    def _match_from_patterns(self, query: str, patterns: list[str], key: str) -> bool:
        for pattern in patterns:
            regex = pattern.format(key=re.escape(key))
            if re.search(regex, query, re.IGNORECASE):
                return True
        return False
    
    def process_query(self, user_query: str) -> Dict[str, Any]:
        query = user_query.lower()

        PATTERNS = [
            r'how many\s+{key}.*products?',
            r'how many.*products?.*{key}',
            r'{key}.*product.*count',
            r'{key}\s+products?\s+count'
        ]

        TOTAL_PATTERNS = [
            r'how many.*Nestlé.*products?',
            r'how many.*total.*products?',
            r'how many.*products?\s+in\s+total',
            r'total\s+products?\s+count',
            r'total\s+product\s+count',
            r'count\s+of\s+all\s+products?',
            r'total\s+number\s+of\s+products?'
        ]

        categories = set()

        for product in self.product_database:
            for category in product.get_categories():
                categories.add(category.lower())

        for category in categories:
            if self._match_from_patterns(query, PATTERNS, category):
                return self._handle_count_query('category-count', category)
        
        for pattern in TOTAL_PATTERNS:
            if re.search(pattern, query, re.IGNORECASE):
                return self._handle_count_query('total-count', 'all')
        
        result = {"message": ""}

        return result
    
    def _handle_count_query(self, query_type: str, value: str) -> Dict[str, Any]:
        result = {"type": QueryType.COUNT.value, "query": value}
                
        if query_type == 'category-count':
            category_data = self.structured_index["categories"].get(value)
            if category_data:
                result["count"] = category_data["count"]
                brand_names = [product.brand for product in self._get_products_by_ids(category_data["product_ids"])]
                brands_text = ", ".join(brand_names)
                result["message"] = f"There are {category_data['count']} products under the {value} category. They are: {brands_text}."
            else:
                result["count"] = 0
                result["message"] = f"No products found in the {value} category."
                result["products"] = []
                
        elif query_type == 'total-count':
            result["count"] = len(self.product_database)
            result["products"] = [p.to_dict() for p in self.product_database]
            result["message"] = f"There are {len(self.product_database)} total products in our website."
        else:
            result["message"] = "I couldn't understand your count query."
            result["count"] = 0
            result["products"] = []
            
        return result

    def get_sample_queries(self) -> List[str]:
        return [
            "How many Nestlé products are listed on the site?",
            "How many coffee products are there?",
            "How many products are there under the chocolate category?",
            "How many spring water products do we have?",
            "How many ice cream products are available?"
        ]

    def get_database_stats(self) -> Dict[str, Any]:
        return {
            "total_products": len(self.product_database),
            "categories_count": len(self.structured_index["categories"]),
        }


if __name__ == "__main__":
    rag_system = StructuredDataService()
    
    print("=== Enhanced RAG System - Python Version ===")
    print(f"Database loaded with {len(rag_system.product_database)} products")
    
    stats = rag_system.get_database_stats()
    print("\nDatabase Stats:")
    for key, value in stats.items():
        print(f"  {key.replace('_', ' ').title()}: {value}")
    
    print("\nSample Queries:")
    for i, query in enumerate(rag_system.get_sample_queries(), 1):
        print(f"  {i}. {query}")
    
    print("\n" + "="*60)
    print("Testing Sample Queries:")
    print("="*60)
    
    for query in rag_system.get_sample_queries():
        result = rag_system.process_query(query)
        print(f"\nQuery: {query}")
        print(f"AI: {result['message']}")
        if 'count' in result:
            print(f"Count: {result['count']}")