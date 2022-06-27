from scrapper import scrapping
import sqlite3

class Pagina (object):
    def __init__(self, nome, url, vetor, categoria):
        self.nome = nome
        self.url = url
        self.vetor = vetor
        self.categoria = categoria

files = ['ciencia', 'cinema', 'esportes', 'geografia', 'historia', 'musica', 'sociedade', 'tecnologia']

def get_array_from_file(category):
    category_words = []
    file = open(f'server/src/setup/categories/vector/{category}.txt', 'r', encoding='utf-8')
    for line in file:
        category_words.append(line.split(' ')[0].replace('\n', ''))
    return category_words

science_words = get_array_from_file("ciencia")
cine_words = get_array_from_file("cinema")
sport_words = get_array_from_file("esportes")
geo_words = get_array_from_file("geografia")
history_words = get_array_from_file("historia")
music_words = get_array_from_file("musica")
society_words = get_array_from_file("sociedade")
tech_words = get_array_from_file("tecnologia")

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
    sql_query = "INSERT INTO pagina (nome, url, vetor, categoria) VALUES (?, ?, ?, ?)"
    conn = sqlite3.connect('server/db.sqlite')
    c = conn.cursor()
    for category in files:
        pages = open(f'server/src/setup/categories/pages/{category}.txt', 'r', encoding='utf-8')
        for line in pages:
            try:
                title, infos, length = scrapping(f'https://pt.wikipedia.org/wiki/{line.strip()}')
                vector =  []
                vector.extend(count_words_per_category(infos, science_words))
                vector.extend(count_words_per_category(infos, cine_words))
                vector.extend(count_words_per_category(infos, sport_words))
                vector.extend(count_words_per_category(infos, geo_words))
                vector.extend(count_words_per_category(infos, history_words))
                vector.extend(count_words_per_category(infos, music_words))
                vector.extend(count_words_per_category(infos, society_words))
                vector.extend(count_words_per_category(infos, tech_words))
                newPage = Pagina(nome=title, url=f'https://pt.wikipedia.org/wiki/{line.strip()}', vetor=str(vector), categoria=category)
                c.execute(sql_query, (newPage.nome, newPage.url, newPage.vetor, newPage.categoria))
                print(f'{newPage.nome} inserted successfully')
            except:
                print(f'{line.strip()} error')
    conn.commit()
    
populate()