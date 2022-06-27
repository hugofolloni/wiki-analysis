from bs4 import BeautifulSoup
import requests

class word:
    def __init__(self, name, count):
        self.name = name
        self.count = count

def scrapping(url):
    html = requests.get(url).content
    soup = BeautifulSoup(html, 'html.parser')
    body_content = soup.find(id='mw-content-text').get_text()
    body_splitted = body_content.lower().replace('[', ' ').replace(']', ' ').replace(':', '').replace(',', '').replace('.', ' ').replace('(', ' ').replace(')', ' ').replace('{', '').replace('}', '').replace('\\', '').split(' ')
    body_words = list(dict.fromkeys(body_splitted))
    body_info = []
    for singleWord in body_words:
        body_info.append(word(singleWord, body_splitted.count(singleWord)))
    title = soup.find(id='firstHeading').get_text()
    return title, body_info, len(body_splitted)

