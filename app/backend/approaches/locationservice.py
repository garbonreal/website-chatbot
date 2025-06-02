import re
import requests
import urllib.parse
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)


class LocationService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.search_radius_meters = 2000
        self.found_product = None  # 存储找到的产品名

        self.products = [
            "Aero",
            "COFFEE CRISP",
            "Drumstick bites",
            "Kit Kat",
            "Smarties",
            "Turtles",
            "After Eight",
            "Big Turk",
            "Crunch",
            "Easter chocolates and treats",
            "Mackintosh Toffee",
            "Mirage",
            "Quality Street",
            "Rolo",
            "Coffee Mate",
            "NESCAFÉ", "NESCAFE",
            "Confectionery Frozen Desserts",
            "Häagen-Dazs", "Haagen-Dazs", "Haagen Dazs",
            "Drumstick",
            "IÖGO", "IOGO",
            "Del Monte",
            "Parlour",
            "Real Dairy",
            "Nido",
            "Nestlé Materna", "Nestle Materna",
            "Purina",
            "BOOST Kids",
            "Boost",
            "MAGGI",
            "Essentia",
            "Maison Perrier",
            "Perrier",
            "San Pellegrino",
            "GoodHost",
            "Milo",
            "NESTEA",
            "Nesfruta",
            "Carnation Hot Chocolate",
            "Nesquik"
        ]
    
    def is_asking_where_to_buy(self, message: str) -> bool:
        if not message:
            return False
            
        message_lower = message.lower()
        found_products = []
        
        for product in self.products:
            pattern = r'\b' + re.escape(product.lower()) + r'\b'
            if re.search(pattern, message_lower):
                found_products.append(product)
        
        if found_products:
            self.found_product = found_products[0]
            return True
        
        self.found_product = None
        return False
    
    def get_found_product(self) -> Optional[str]:
        return self.found_product
    
    def get_latest_user_message(self, messages: List[Dict]) -> Optional[str]:
        for message in reversed(messages):
            if message.get("role") == "user":
                return message.get("content", "")
        return None
    
    def get_amazon_link(self, region: str = "ca") -> str:
        product = self.get_found_product()
        query = urllib.parse.quote_plus(f"{product} site:amazon.{region}")
        return [{
            "product_name": product,
            "search_query": product,
            "amazon_url": f"https://www.google.com/search?q={query}",
        }]

    
    async def find_nearby_stores(self, location: Dict[str, Any]) -> List[Dict[str, Any]]:
        if not self.api_key:
            logger.warning("Google Places API key not configured")
            return []
            
        try:
            lat, lng = self._extract_coordinates(location)
            
            if not lat or not lng:
                logger.warning("Could not extract valid coordinates from location")
                return []
            
            stores = await self._search_nearby_stores_api(lat, lng, self.get_found_product())
            return stores
            
        except Exception as e:
            logger.error(f"Error finding nearby stores: {str(e)}")
            return []
    
    async def _search_nearby_stores_api(self, lat: float, lng: float, keyword: str = "") -> List[Dict[str, Any]]:
        endpoint = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        
        params = {
            "location": f"{lat},{lng}",
            "radius": self.search_radius_meters,
            "type": "grocery_or_supermarket",
            "key": self.api_key,
        }
        
        if keyword:
            params["keyword"] = keyword
        
        try:
            response = requests.get(endpoint, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") != "OK":
                logger.warning(f"Google Places API returned status: {data.get('status')}")
                return []
            
            stores = data.get("results", [])[:5]
            
            return stores
            
        except requests.RequestException as e:
            logger.error(f"HTTP request error: {str(e)}")
            return []
        except Exception as e:
            logger.error(f"Error calling Google Places API: {str(e)}")
            return []
    
    def _extract_coordinates(self, location: Dict[str, Any]) -> tuple:
        coordinates = location.get('coordinates')
        if coordinates and isinstance(coordinates, dict):
            lat = coordinates.get('latitude')
            lng = coordinates.get('longitude')
            if lat is not None and lng is not None:
                try:
                    return float(lat), float(lng)
                except (ValueError, TypeError):
                    logger.warning(f"Invalid coordinate values: lat={lat}, lng={lng}")
        
        return None, None