import os
import asyncio
import aiofiles
import logging
import re
from urllib.parse import urlparse, urljoin
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Configure logging for detailed output
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("website_parser")

# Set the root URL and output directories for saving HTML and cleaned text
BASE_URL = "https://www.madewithnestle.ca/aero"
OUTPUT_HTML_DIR = "../data/Html_examples/website_html"
OUTPUT_TEXT_DIR = "../data/Html_examples/website_text"

os.makedirs(OUTPUT_HTML_DIR, exist_ok=True)
os.makedirs(OUTPUT_TEXT_DIR, exist_ok=True)

def get_selenium_driver():
    """
    Initialize and configure the Selenium Chrome driver.
    Returns:
        WebDriver: Configured Chrome WebDriver object.
    """
    options = Options()
    options.add_argument("--headless")  # Run in headless mode
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/110.0.0.0")
    options.add_argument("--disable-blink-features=AutomationControlled")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def cleanup_data(data: str) -> str:
    """
    Cleans up the given HTML content using regex patterns.
    Args:
        data (str): The raw HTML text.
    Returns:
        str: The cleaned text.
    """
    output = re.sub(r"\n{2,}", "\n", data)
    output = re.sub(r"[^\S\n]{2,}", " ", output)
    output = re.sub(r"-{2,}", "--", output)
    return output.strip()

async def save_html_file(url: str, html: str):
    """
    Save the raw HTML content to a file based on the URL structure.
    Args:
        url (str): The page URL.
        html (str): The raw HTML content.
    """
    parsed_url = urlparse(url)
    path = parsed_url.path.strip("/").replace("/", "_").replace("?", "_")
    filename = f"{path if path else 'index'}.html"
    file_path = os.path.join(OUTPUT_HTML_DIR, filename)
    
    async with aiofiles.open(file_path, "w", encoding="utf-8") as f:
        await f.write(html)
    
    logger.info(f"Saved HTML file: {file_path}")
    return file_path

async def save_cleaned_text(url: str, text: str):
    """
    Save the cleaned text content extracted from HTML.
    Args:
        url (str): The page URL.
        text (str): The cleaned text content.
    """
    parsed_url = urlparse(url)
    path = parsed_url.path.strip("/").replace("/", "_").replace("?", "_")
    filename = f"{path if path else 'index'}.txt"
    file_path = os.path.join(OUTPUT_TEXT_DIR, filename)
    
    async with aiofiles.open(file_path, "w", encoding="utf-8") as f:
        await f.write(text)
    
    logger.info(f"Saved cleaned text file: {file_path}")
    return file_path

def fetch_all_internal_urls(driver, base_url: str) -> set:
    """
    Extract all internal URLs from the base page.
    """
    logger.info(f"Fetching root page with Selenium: {base_url}")
    driver.get(base_url)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    
    urls = set()
    urls.add(base_url)

    for link in soup.find_all("a", href=True):
        href = link.get("href")
        if href.startswith("/"):
            full_url = urljoin(base_url, href)
            urls.add(full_url)
        elif href.startswith(base_url):
            urls.add(href)
    
    logger.info(f"Discovered {len(urls)} internal URLs (including BASE_URL).")
    return urls

async def fetch_and_save_static_html(driver, url: str):
    """
    Fetch the static HTML content of a page using Selenium and save it.
    """
    try:
        logger.info(f"Fetching static HTML with Selenium: {url}")
        driver.get(url)
        await asyncio.sleep(2)  # Allow initial static content to load

        # 获取静态 HTML（不触发动态加载）
        html = driver.execute_script("return document.documentElement.outerHTML")

        # Save raw HTML file (static only)
        await save_html_file(url, html)

        # Clean up and save the extracted text
        soup = BeautifulSoup(html, "html.parser")
        raw_text = soup.get_text(separator="\n")
        cleaned_text = cleanup_data(raw_text)
        await save_cleaned_text(url, cleaned_text)

    except Exception as e:
        logger.error(f"Error fetching {url}: {str(e)}")

async def main():
    """
    Main function to initialize the driver, crawl URLs, and save pages.
    """
    driver = get_selenium_driver()
    
    # Get all internal URLs including the BASE_URL
    urls = fetch_all_internal_urls(driver, BASE_URL)
    if not urls:
        logger.error("No URLs discovered. Exiting.")
        driver.quit()
        return
    
    # Create asynchronous tasks to fetch and save each page
    tasks = [fetch_and_save_static_html(driver, url) for url in urls]
    await asyncio.gather(*tasks)
    
    driver.quit()  # Close the browser

if __name__ == "__main__":
    asyncio.run(main())
