# CRIAREI O ALGORITMO DE COMPARACAO DE VETORES
## ele rodará o algoritmo de comparação, depois de receber o vetor da pagina vinda do scrapper

def compare_after_before_cut(before_cut, after_cut):
    old = open(before_cut, 'r')
    new = open(after_cut, 'r')
    diff = open('diff.txt', 'w')
    old_lines = old.readlines()
    new_lines = new.readlines()
    for line in old_lines:
        if line not in new_lines:
            diff.write(line)

compare_after_before_cut('categories/words/old-tech.txt', 'categories/words/tecnologia.txt')