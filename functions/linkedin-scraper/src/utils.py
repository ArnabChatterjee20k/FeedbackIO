import requests
from lxml import etree
from bs4 import BeautifulSoup

def get_soup(url):
    res = requests.get(url)
    if not res.ok:
        return None
    return BeautifulSoup(res.text)


def scrape(url:str):
    soup = get_soup(url)
    # Find the main layout using the data-test-id attribute
    main_layout = soup.find(attrs={'data-test-id': 'main-feed-activity-card__entity-lockup'})
    if not main_layout:
        return None

    image_url = main_layout.find('img')['data-delayed-url']
    
    name = main_layout.find(attrs={'data-tracking-control-name': 'public_post_feed-actor-name'}).get_text().strip()
    
    profile_info = main_layout.find(attrs={'data-tracking-control-name': 'public_post_feed-actor-name'}).parent.find_next_sibling().get_text().strip()
    
    content = soup.find(attrs={"data-test-id":"main-feed-activity-card__commentary"}).get_text().strip()
    
    items = {
        "profile_info":profile_info,
        "name":name,
        "profile_picture":image_url,
        "content":content
    }
    
    return items