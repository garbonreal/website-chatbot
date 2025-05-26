from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os
import time

visited = set()
output_root = "../data/Html_examples"
driver = None  # Selenium driver


def init_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/120.0.0.0 Safari/537.36")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": """
            Object.defineProperty(navigator, 'webdriver', {
              get: () => undefined
            });
        """
    })
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)


def extract_links(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    links = set()
    for tag in soup.find_all("a", href=True):
        href = tag['href']
        full_url = urljoin(base_url, href)
        if full_url.startswith("http"):
            links.add(full_url)
    return links


url_map_file = "../app/frontend/public/url_map.txt"

# 初始化 url_map 文件
if not os.path.exists(url_map_file):
    with open(url_map_file, "w") as f:
        f.write("")

# 加载已用的 HTML 文件名，防止重复
used_filenames = set()
with open(url_map_file, "r", encoding="utf-8") as f:
    for line in f:
        key = line.split(" ", 1)[0].strip()
        used_filenames.add(key)

def get_unique_filename(base_name):
    if base_name not in used_filenames:
        return base_name
    i = 1
    while True:
        candidate = f"{os.path.splitext(base_name)[0]}_{i}.html"
        if candidate not in used_filenames:
            return candidate
        i += 1

def build_output_path(url):
    parsed = urlparse(url)
    path = parsed.path.strip("/")

    if not path:
        raw_filename = "index.html"
        folder = os.path.join(output_root, start_path)
    else:
        parts = path.split("/")
        base_name = parts[-1] or "index"
        raw_filename = base_name + ".html"
        folder = os.path.join(output_root, start_path, *parts[:-1])

    # 保证唯一性
    filename = get_unique_filename(raw_filename)
    used_filenames.add(filename)

    if os.path.isfile(folder):
        new_name = folder + "_file.html"
        print(f"⚠️ Conflict: '{folder}' is a file. Renaming it to '{new_name}'")
        os.rename(folder, new_name)

    os.makedirs(folder, exist_ok=True)
    file_path = os.path.join(folder, filename)

    # 写入映射
    with open(url_map_file, "a", encoding="utf-8") as f:
        f.write(f"{filename} {url}\n")

    return file_path


def save_html(url, html):
    filepath = build_output_path(url)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)


def click_more_buttons():
    try:
        while True:
            buttons = driver.find_elements("xpath", "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'more')]")
            if not buttons:
                break
            clicked = False
            for btn in buttons:
                if btn.is_displayed():
                    try:
                        btn.click()
                        clicked = True
                        time.sleep(1)
                    except Exception as e:
                        continue
            if not clicked:
                break
    except Exception as e:
        print(f"⚠️ Error clicking 'More' buttons: {e}")


def crawl(url, depth=0, max_depth=4):
    if url in visited:
        return
    if not url.startswith(domain): 
        return
    visited.add(url)
    try:
        driver.get(url)
        time.sleep(2)

        click_more_buttons()

        html = driver.page_source
        save_html(url, html)
        print(f"✅ Saved: {url}")

        if depth < max_depth:
            links = extract_links(html, url)
            for link in links:
                crawl(link, depth + 1, max_depth)
    except Exception as e:
        print(f"⚠️ Failed to fetch {url}: {e}")


if __name__ == "__main__":
    # start_url = "https://www.haagen-dazs.ca/en/hd-en"
    # domain = "https://www.haagen-dazs.ca/en/"
    # start_path = "haagen-dazs"

    # start_url = "https://www.madewithnestle.ca/aero"
    # domain = "https://www.madewithnestle.ca/aero"
    # start_path = "aero"

    # start_url = "https://www.nestlebaby.ca/materna-maternal-supplements"
    # domain = "https://www.nestlebaby.ca"
    # start_path = "nestlebaby"

    # start_url = "https://www.nestlebaby.ca/nestle-nido-1"
    # domain = "https://www.nestlebaby.ca"
    # start_path = "nestlebaby"

    # start_url = "https://naturesbounty.ca/"
    # domain = "https://naturesbounty.ca/"
    # start_path = "naturesbounty"

    # start_url = "https://www.purina.ca/"
    # domain = "https://www.purina.ca/"
    # start_path = "purina"

    # start_url = "https://www.maisonperrier.fr/ca/en-ca"
    # domain = "https://www.maisonperrier.fr/ca/en-ca"
    # start_path = "maisonperrier"

    # start_url = "https://www.sanpellegrino.com/ca/en-ca"
    # domain = "https://www.sanpellegrino.com/ca/en-ca"
    # start_path = "sanpellegrino"

    start_url = "https://www.madewithnestle.ca/"
    domain = "https://www.madewithnestle.ca/"
    start_path = "madewithnestle"

    driver = init_driver()
    try:
        crawl(start_url)
    finally:
        driver.quit()
        print("🎉 Done crawling.")
