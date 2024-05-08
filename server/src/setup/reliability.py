import psycopg2
import os
from dotenv import load_dotenv

files = ['science', 'movie', 'sports', 'geography', 'history', 'music', 'society', 'technology']

class PageCompare:
    def __init__(self, name, vector_category, category):
        self.name = name
        self.vector_category = vector_category
        self.category = category

page_list = []

def get_reliability():
    conn = psycopg2.connect(
                        database = os.getenv("DATABASE"), 
                        user = os.getenv("USER"), 
                        host= os.getenv("HOST"),
                        password = os.getenv("PASSWORD"),
                        port = 5432,
                        sslmode='require'
                    )
    c = conn.cursor()
    for file in files:
        print(file)
        pages = open(f'categories/pages/{file}.txt', 'r', encoding='utf-8')
        for line in pages:  
            c.execute("SELECT * FROM page WHERE url = %s", (f'https://en.wikipedia.org/wiki/{line.strip()}',))
            result = c.fetchone()
            if result is not None:
                vector = result[3].replace('[', '').replace(']', '').split(',')
                vector_category = None
                categories = []
                ciencia = 0
                for i in range(0, 50):
                    ciencia += int(vector[i])
                cinema = 0
                for i in range(50, 100):
                    cinema += int(vector[i])
                esportes = 0
                for i in range(100, 150):
                    esportes += int(vector[i])
                geografia = 0
                for i in range(150, 200):
                    geografia += int(vector[i])
                historia = 0
                for i in range(200, 250):
                    historia += int(vector[i])
                musica = 0
                for i in range(250, 300):
                    musica += int(vector[i])
                sociedade = 0
                for i in range(300, 350):
                    sociedade += int(vector[i])
                tecnologia = 0
                for i in range(350, 400):
                    tecnologia += int(vector[i])
                categories.append(ciencia)
                categories.append(cinema)
                categories.append(esportes)
                categories.append(geografia)
                categories.append(historia)
                categories.append(musica)
                categories.append(sociedade)
                categories.append(tecnologia)
                maximo = max(categories)
                index = categories.index(maximo)
                vector_category = files[index]
                page_list.append(PageCompare(line.strip(), file, vector_category))
    table_size = len(page_list)
    error_list = compare_on_list(page_list)
    c.close()
    return len(error_list)/table_size, error_list


def compare_on_list(lista):
    error_list = []
    for page in lista:
        if page.category != page.vector_category:
            error_list.append(page)
    return error_list


                