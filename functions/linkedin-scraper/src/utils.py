import requests
from lxml import etree
from bs4 import BeautifulSoup

text_selectors = {
    "content": "//article/div[3]/p",
    "name": "//article/div[1]/div/div/a",
    "profile_info": "//article/div[1]/div/p"
}

img_selectors = {
    "profile_picture": "//article/div[1]/a/img",
}

def get_dom(url:str):
    res = requests.get(url)
    if not res.ok:
        return None
    html = res.text
    soup = BeautifulSoup(html,"lxml")
    body = soup.find("body")
    dom = etree.HTML(str(body))
    return dom


def get_soup(element:etree.Element):
    """
        It will take the HTML element and wrap it with the html and body and give you a separate html.
        To find an element inside it, make sure to find the tag or query it
    """
    return BeautifulSoup(etree.tostring(element),"lxml")

def scrape(url:str):
    dom = get_dom(url)
    items = {}
    for key,xpath in text_selectors.items():
        element:etree.Element = dom.xpath(xpath)
        items[key] = get_soup(element[0]).getText().strip()
    
    for key,xpath in img_selectors.items():
        element:etree.Element = dom.xpath(xpath)
        items[key] = get_soup(element[0]).find("img").get("data-delayed-url")
    
    return items