from scrapper import scrapping
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

class Page (object):
    def __init__(self, name, url, vector, category):
        self.name = name
        self.url = url
        self.vector = vector
        self.category = category

files = ['science', 'movie', 'sports', 'geography', 'history', 'music', 'society', 'technology']

def get_array_from_file(category):
    category_words = []
    file = open(f'categories/vector/{category}.txt', 'r', encoding='utf-8')
    for line in file:
        category_words.append(line.split(' ')[0].replace('\n', ''))
    return category_words

science_words = get_array_from_file("science")
cine_words = get_array_from_file("movie")
sport_words = get_array_from_file("sports")
geo_words = get_array_from_file("geography")
history_words = get_array_from_file("history")
music_words = get_array_from_file("music")
society_words = get_array_from_file("society")
tech_words = get_array_from_file("technology")

def count_words_per_category(infos, category):
    category_vector = []
    for word in category:
        exists = False
        for info in infos:
            if word == info.name:
                category_vector.append(info.count)
                exists = True
        if not exists:
            category_vector.append(0)
    return category_vector
    

def populate():
    sql_query = 'INSERT INTO page ("name", "url", "vector", "category") VALUES (%s, %s, %s, %s)'
    conn = psycopg2.connect(
                        database = os.getenv("DATABASE"), 
                        user = os.getenv("USER"), 
                        host= os.getenv("HOST"),
                        password = os.getenv("PASSWORD"),
                        port = 5432,
                        sslmode='require'
                    )
    c = conn.cursor()
    for category in files:
        pages = open(f'categories/pages/{category}.txt', 'r', encoding='utf-8')
        for line in pages:
            try:
                title, infos, length = scrapping(f'https://en.wikipedia.org/wiki/{line.strip()}')
                vector =  []
                vector.extend(count_words_per_category(infos, science_words))
                vector.extend(count_words_per_category(infos, cine_words))
                vector.extend(count_words_per_category(infos, sport_words))
                vector.extend(count_words_per_category(infos, geo_words))
                vector.extend(count_words_per_category(infos, history_words))
                vector.extend(count_words_per_category(infos, music_words))
                vector.extend(count_words_per_category(infos, society_words))
                vector.extend(count_words_per_category(infos, tech_words))
                newPage = Page(name=title, url=f'https://en.wikipedia.org/wiki/{line.strip()}', vector=str(vector), category=category)
                c.execute(sql_query, (newPage.name, newPage.url, newPage.vector, newPage.category))
                print(f'{newPage.name} inserted successfully')
            except Exception as error:
                print ("Oops! An exception has occured:", error)
    conn.commit()