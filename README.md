# wiki-analysis

Projeto final de Álgebra Linear Algorítmica na turma de 2022.1 da UFRJ, tem como intuito responder a categoria de um artigo com base na sua url e outros artigos semelhantes, por meio de comparações usando álgebra linear. Será composto de um scrapper, para ler a página, algoritmos de comparação, algoritmos geradores do vetor final (utilizando a importância de uma palavra para uma categoria) e uma biblioteca de algebra linear.

# Estrutura 
- scrapper: faz o scrappy da pagina que queremos analisar
- comparision: faz a comparação da página que queremos analisar com as outras do bd
- vector: determina quais palavras valem a pena serem usadas no vector
- words_frequency: faz a contagem da ocorrência de cada palavra buscando criar o vetor ideal
- library: possui todas as funções de algebra-linear criadas em aula
- categories: possui as categorias analisadas na criação do vetor
    - /pages: possui as páginas que foram utilizadas para criar o vetor
    - /words: possui a lista de palavras encontradas nas páginas utilizadas, ordenadas por frequência
    - vector: possui o vetor final encontrado para ser utilizado pelo algoritmo

# O que falta

- Criar estilização
- Limitar resutlado caso busca já exista no BD (excluir ele da lista de semelhantes)
- Salvar novas buscar no bacno de dados (nao esta funcionando)
- reescrever readme depois de atualizado para typescript

# Ideia por trás do app
- criar um arquivo txt para cada categoria, passando 100 artigos pra cada categoria (o usuário que resolver recriar pode passar outros txt pra “ensinar”)
- pra cada artigo, fazer scrappy e anotar frequência das palavras somadas nos 100 arquivos
- pegar as 100 mais comuns de cada categoria
- ver as palavras que aparecem apenas na categoria específica
- essas serão as 50 palavras constituintes da categoria no vetor
- rodar novamente os 100 artigos de cada categoria e guardar no banco de dados seu título, seu vetor e sua categoria
- rodar mais 500 páginas guardando também no banc de dados seu título, vetor e categoria
- quando o usuário passar a pagina, vai ser gerado o vetor e comparado com cada vetor do banco de dados, - vendo a menor distância (ou cosseno), então será retornada a categoria e o vetor
- a categoria será determinada pela frequência média de aparições por palavra de certa categoria do vetor (se a parte de história do vetor tem 100 palavras e apareceram essas palavras 200 vezes, a área história tem 2 de frequência. a área com mais frequência será a categoria escolhida), e o vetor de recomendação pela menor distancia (ou cosseno)
- telas de loading bonitas e aviso que será um processo demorado
- reescrever readme depois de atualizado para typescript

# Artigos interessantes
- https://github.com/leomattes/NLP_Portugues/blob/master/Frase2VecPortuguese.ipynb
- http://nilc.icmc.usp.br/nilc/index.php/repositorio-de-word-embeddings-do-nilc
- https://www.kaggle.com/datasets/mozzie/apache-spark-word2ve
- https://www.linkedin.com/pulse/word2vec-em-português-para-classificação-decimal-de-dewey-mattes/?originalSubdomain=pt

# Funcionamento

## Preparação
- O administrador define artigos para cada uma das categorias dentro da pasta /categorias/pages  
    - O preferencial é que haja ao mínimo 50 artigos de cada categoria
- Após isso, o scrapper faz o scrappy dos artigos e o get_words_frequency as palavras mais comuns em /categorias/pages/words
    - Ignorando as palavras definidas em generic
- O algoritmo de comparação entre categorias então é rodado, definindo para cada categoria, quais palavras são comuns apenas nela
    - Então são escolhidas as 50 palavras únicas de categoria mais comuns, após fazer uma limpeza de palavras (às vezes a palavra não indica muita coisa)
- É rodado o population, buscando popular o banco de dados com as páginas já escolhidas, definindo a categoria delas como a categoria anteriormente definida

## Execução
- O usuário solicita categorização de um arquivo da wikipedia, passando uma página
- O scrapper faz o scrappy e joga a lista de palavras para o comparision
- Em page_vector, o vetor da página é feito, e depois enviado ao comparisiom que irá compará-lo com os vetores do banco de dados
- O sistema define como a categoria a média de categoria dos vetores mais próximos, retornando também os 3 vetores mais próximos como recomendação.

# Erro inicial
Tivemos uma porcentagem de erro de 8.8% no algoritmo para um banco recém-criado, de 575 páginas.