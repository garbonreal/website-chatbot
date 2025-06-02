import re
import requests
import urllib.parse

# ====== 配置 ======
GOOGLE_API_KEY = "AIzaSyC9kBOGXQsUrjvMGivbK_KcEPR6YXJtZpc"  # 替换成你自己的 Google Places API key
SEARCH_RADIUS_METERS = 2000


# 获取当前 IP 的地理位置（基于 IP）
def get_current_location():
    try:
        res = requests.get("https://ipinfo.io/json")
        data = res.json()
        lat, lon = map(float, data["loc"].split(","))
        return {"lat": lat, "lon": lon}
    except Exception as e:
        print("Location error:", e)
        return None


# 从输入中抽取商品名
def extract_product_name(query: str):
    patterns = [
        r"buy ([a-zA-Z0-9\s\-]+)",
        r"find ([a-zA-Z0-9\s\-]+)",
        r"where.+?([a-zA-Z0-9\s\-]+)\?"
    ]
    for pattern in patterns:
        match = re.search(pattern, query.lower())
        if match:
            return match.group(1).strip().lower()
    return None


# 调用 Google Places API 查询附近商店
def search_nearby_stores(lat, lon, keyword):
    endpoint = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lon}",
        "radius": SEARCH_RADIUS_METERS,
        "keyword": keyword,
        "type": "store",
        "key": GOOGLE_API_KEY
    }
    try:
        res = requests.get(endpoint, params=params)
        print(res.text)
        data = res.json()
        stores = []
        for item in data.get("results", [])[:5]:  # 只返回前5个
            stores.append({
                "name": item["name"],
                "address": item.get("vicinity", "N/A"),
                "rating": item.get("rating", "N/A")
            })
        return stores
    except Exception as e:
        print("Google Places API error:", e)
        return []


# 构造 Amazon 搜索链接
def get_amazon_link(product: str, region: str = "ca") -> str:
    query = urllib.parse.quote_plus(f"{product} site:amazon.{region}")
    return f"https://www.google.com/search?q={query}"


# 汇总回复
def generate_reply(product, stores, amazon_link):
    reply = f"Here’s what I found for **{product.title()}**:\n"
    if stores:
        reply += "\nNearby stores:\n"
        for s in stores:
            reply += f"- {s['name']} (Rating: {s['rating']}) - {s['address']}\n"
    else:
        reply += "\n⚠️ No nearby stores found for this item.\n"

    reply += f"\nYou can also [buy it on Amazon]({amazon_link})"
    return reply


# ============ 主程序 ============
if __name__ == "__main__":
    print("🛒 Product Finder Bot (Real Location + API)")
    # print("Type a question like 'Where can I buy Kit Kat?'\n")

    # user_input = input("You: ")
    # if user_input.lower() in {"exit", "quit"}:
    #     break

    product = "kit kat"# extract_product_name(user_input)
    if not product:
        print("❌ Sorry, I couldn't understand which product you're asking about.\n")

    location = get_current_location()
    if not location:
        print("❌ Failed to get current location.\n")

    stores = search_nearby_stores(location["lat"], location["lon"], product)
    amazon_link = get_amazon_link(product)
    print("\nBot:\n" + generate_reply(product, stores, amazon_link) + "\n")
