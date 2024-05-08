from words_frequency import get_words_frequency
from population import populate
from reliability import get_reliability

files = ['science', 'movie', 'sports', 'geography', 'history', 'music', 'society', 'technology']

def get_category_words(file_name):
    file = open(f'server/src/setup/categories/words/{file_name}.txt', 'r', encoding='utf-8')
    category_words = []
    others_words = []
    for line in file:
        category_words.append(line.split(' ')[0])
    for file in files:
        if file is not file_name:
            file = open(f'server/src/setup/categories/words/{file}.txt', 'r', encoding='utf-8')
            for line in file:
                others_words.append(line.split(' ')[0])
    to_vector = []
    for word in category_words:
        if word in others_words:
            continue
        else:
            to_vector.append(word)
    return to_vector

def write_vector_txt():
    for file in files:
        vector_file = open(f'server/src/setup/categories/vector/{file}.txt', 'w', encoding='utf-8')
        print("Creating vector to " + file)
        vector = get_category_words(file)
        iteration = 100
        if(len(vector) < 100):
            iteration = len(vector)
        for i in range(iteration):
            if(vector[i] == ''):
                continue
            vector_file.write(vector[i] + '\n')

def run_from_scratch():
    for file in files:
        get_words_frequency(file)
    write_vector_txt()
    populate()
    porcentagem, erros = get_reliability()
    print("Precision: {:.2f}%".format(100 - porcentagem * 100))

def run_after_vector_defined():
    populate()
    porcentagem, erros = get_reliability()
    print("Precision: {:.2f}%".format(100 - porcentagem * 100))

run_from_scratch()
# run_after_vector_defined()