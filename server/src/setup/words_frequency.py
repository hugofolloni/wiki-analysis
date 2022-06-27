from scrapper import scrapping
from generic import generic_words

def get_words_frequency(file_name):
    file = open(f"server/src/setup/categories/pages/{file_name}.txt", 'r', encoding='utf-8')
    newFile = open(f"server/src/setup/categories/words/{file_name}.txt", "w", encoding="utf-8")
    list_of_words = []
    total_words = 0
    for line in file:
        previous_size = len(list_of_words)
        try:
            title, infos, length = scrapping(f"https://pt.wikipedia.org/wiki/{line.strip()}")
            for info in infos:
                if (info.name not in generic_words) and len(info.name) > 1:
                    already_in_list = False
                    for item in list_of_words:
                        if item.name == info.name:
                            item.count += info.count
                            already_in_list = True
                            break
                    if not already_in_list:
                        list_of_words.append(info)
                        total_words += 1
            print(f"{title} adicionou {len(list_of_words) - previous_size} palavras!")
        except:
            print(f"---> Erro ao ler {line.strip()}")
            
    list_of_words.sort(key=lambda x: x.count, reverse=True)

    print(f"Total de palavras: {total_words}")
    
    data_size = 400
    if total_words < data_size:
        data_size = total_words
    
    for i in range(0, data_size):
        newFile.write(f"{list_of_words[i].name} {list_of_words[i].count}\n")
        