# linkedin-scraper

JS dom query
```js
const mainLayout = document.querySelector(`[data-test-id="main-feed-activity-card__entity-lockup"]`)
const image = mainLayout.querySelector("img").dataset["delayedUrl"]
const name = mainLayout.querySelector('[data-tracking-control-name="public_post_feed-actor-name"]').innerText
const tag_line = mainLayout.querySelector('[data-tracking-control-name="public_post_feed-actor-name"]').parentElement.nextElementSibling.textContent
const content = document.querySelector(`[data-test-id="main-feed-activity-card__commentary"]`).textContent```

### using bs4, etree for xpaths
```py
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

scrape("https://www.linkedin.com/feed/update/urn:li:activity:7251440830375206912/")
```

## 🧰 Usage

### GET /ping

- Returns a "Pong" message.

**Response**

Sample `200` Response:

```text
Pong
```

### GET, POST, PUT, PATCH, DELETE /

- Returns a "Learn More" JSON response.

**Response**

Sample `200` Response:

```json
{
  "motto": "Build like a team of hundreds_",
  "learn": "https://appwrite.io/docs",
  "connect": "https://appwrite.io/discord",
  "getInspired": "https://builtwith.appwrite.io"
}
```

## ⚙️ Configuration

| Setting           | Value                             |
| ----------------- | --------------------------------- |
| Runtime           | Python (3.9)                      |
| Entrypoint        | `src/main.py`                     |
| Build Commands    | `pip install -r requirements.txt` |
| Permissions       | `any`                             |
| Timeout (Seconds) | 15                                |

## 🔒 Environment Variables

No environment variables required.
