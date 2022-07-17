# wiki-analysis
Projeto final de Álgebra Linear Algorítmica na turma de 2022.1 da UFRJ, tem como intuito responder a categoria de um artigo com base na sua url e outros artigos semelhantes, por meio de comparações usando álgebra linear. 

- [💡 Ideia do projeto](#ideia-do-projeto)
- [🧮 Algoritmo](#algoritmo)
- [🔴 Live](#live)
- [🏗️ Estrutura](#estrutura)
- [🪛 Funcionamento](#funcionamento)
- [🖥️ Tecnologias](#tecnologias)
- [📓 Como rodar](#como-rodar)
- [⛔ Erro inicial](#erro-inicial)


## 💡 Ideia do Projeto
O projeto se baseou na tentativa de categorizar um artigo da Wikipédia com base em outros artigos, encontrando vetores para cada um deles. Utilizando-se de Álgebra Linear, calcula a similaridade entre as páginas, utilizando o cosseno entre o vetor da página e cada um dos vetores do banco de dados. Além disso, o algoritmo é capaz de aprender com as requisições, se tornando mais eficiente.

## 🧮 Algoritmo 

O algoritmo construirá, para cada artigo da Wikipédia, um vetor, levando em conta as palavras formadoras de cada dimensão. Então, ele fará a comparação da página com base nos cossenos entre ela e os outros vetores.

##### Fórmula do Cosseno 
$cos(x, y) = {x^t y \over \||x|| ||y||}$


O cosseno varia entre [-1, 1] e, quanto maior, mais semelhantes dois vetores são. Essa foi a estratégia escolhida para comparar nossas páginas, e determinar sua categoria com base nas mais semelhantes.

A cada requisição, o algoritmo salva o novo vetor no banco de dados, e, com isso, aprende e aumenta o número de comparações que ele pode fazer, o que aumenta a eficiência.

## 🔴 Live 
O projeto está funcionando sob o [link](https://wiki-analysis.netlify.app/) e possui também uma [API](https://wiki-analysis-ala.herokuapp.com/api/).

Um PDF com o relatório que contém explicações mais detalhadas do projeto está em: [PDF](https://github.com/hugofolloni/wiki-analysis/blob/master/public/relatório.pdf)


## 🏗️ Estrutura 
### Front-end 
Feito em Typescript + React, possui dois componentes principais:
- Analysis: responsável pela maioria das funções, recebe uma página do usuário, faz o scrappy, gera o vetor e compara com os vetores do banco de dados. Após isso, faz a requisição para o back-end, salvando a nova página.
- Admin: responsável por apagar itens do banco de dados em caso de erros.
### Back-end
Feito em Typescript-Node + Express + Python, possui duas partes principais:
#### Setup (Python)
Gera os dados necessários para o funcionamento da aplicação, antes de qualquer requisição do usuário.
- categories: possui as categorias analisadas na criação do vetor.
    - /pages: possui as páginas que foram utilizadas para criar o vetor.
    - /words: possui a lista de palavras encontradas nas páginas utilizadas, ordenadas por frequência.
    - vector: possui o vetor final encontrado para ser utilizado pelo algoritmo.
- scrapper: faz o scrappy das páginas-base.
- comparision: faz a comparação da página que queremos analisar com as outras do banco de dados.
- words_frequency: faz a contagem da ocorrência de cada palavra buscando criar o vetor ideal.
- vector: determina quais palavras valem a pena serem usadas no vector.
- population: popula o banco de dados com as páginas definidas em categories.
- reliability: indica a porcentagem de confiabilidade do algoritmo com base nas páginas-base.
#### API (Typescript)
Responsável por enviar os dados para o front-end, e receber as requisições também.
API gerada com Express e Typescript, cria o banco de dados, fornece os endpoints para a API e faz as requisições para o banco (tanto post, quanto get, delete e put).

## 🪛 Funcionamento
### Preparação
Todos os processos aqui são realizados em Python, dentro da pasta /server/src/setup.
- O administrador define artigos para cada uma das categorias dentro da pasta /categorias/pages  .
    - O preferencial é que haja ao mínimo 50 artigos de cada categoria.
- Após isso, o scrapper.py faz o scrappy dos artigos e o words_frequency.py encontra as palavras mais comuns de cada categoria, e as escreve em /categorias/pages/words.
    - Ignorando as palavras definidas em generic.py.
- O algoritmo de comparação em vector.py então é rodado, definindo para cada categoria, quais palavras são comuns apenas nela.
    - Então são escolhidas as 50 palavras únicas de categoria mais comuns, após fazer uma limpeza nas palavras pouco relevantes.
- O usuário roda o server (arquivo /server/src/index.ts), gerando o banco de dados.
- É rodado o population, buscando popular o banco de dados com as páginas já escolhidas, definindo a categoria delas com base nas palavras escolhidas para o vetor.
- Ao fim da preparação, é rodado o reliability, que calcula a porcentagem de confiabilidade do algoritmo. Caso seja abaixo de 90%, é preferível refazer a escolha de palavras para o vetor.

### Execução
- O usuário liga o servidor, rodando o index.ts dentro de /server/src, ganhando acesso ao banco de dados por meio da API.
- O usuário liga o front-end, rodando yarn start na pasta root, subindo o servidor React no localhost.
- O usuário acessa a página inicial e indica qual página deseja ser analisada.
- O algoritmo presente em /src/pages/Analysis.tsx irá:
    - Fazer um scrappy do artigo indicado, contando a ocorrência de cada uma das palavras definidas em /server/src/setup/categories/vector.txt e montando então o vetor da palavra.
    - O algoritmo irá requisitar da API os vetores para todas as páginas do banco de dados, ganhando também seus nomes e suas categorias.
    - O algoritmo irá calcular tanto a distância quanto o cosseno entre o vetor da página indicada e todos os do banco de dados, ordenando então por maior cosseno (mais similar) e menor distância (também mais similar).
    - Como foi escolhido o método do cosseno, o algoritmo irá receber os 5 maiores cossenos e criar uma lista com todas as categorias de cada uma das páginas. Caso toda a lista seja igual, então é definida apenas uma categoria. Se houver mais de uma categoria, então são definidas categoria prinicipal e secundária.
    - Será salvo então no banco de dados o nome, vetor, categoria e url da página solicitada, para melhoria da aplicação.
    - Após isso, o algoritmo irá enviar os dados para o front-end, que irá montar a página de resultado, mostrando a(s) categoria(s) e recomendar 5 artigos com maior cosseno (mais próximos) quando comparados ao artigo solicitado.
- Por meio do algoritmo presente em /src/pages/Admin.tsx, o usuário pode apagar dados incorretos do banco de dados, passando o ID no banco de dados.

## 💻 Tecnologias
- React
- TypeScript
- Python
- NodeJS
- SQLite
- Express
- FS
- Numpy
- Vectorius
- BeautifulSoup
- Axios


## 📓 Como rodar:
```bash
# Clone o repositório 
$ git clone https://github.com/hugofolloni/wiki-analysis

# Acesse a pasta
$ cd wiki-analysis

# Instale os pacotes necessários
$ yarn
$ cd server 
$ yarn 
$ cd ..

# Rode o servidor, para criar o banco de dados
$ yarn server

# Crie a pasta /pages dentro de /server/src/setup/categories e defina as páginas que o algoritmo utilizará para aprender

# Acesse a pasta de setup e rode o arquivo vector.py
## Este arquivo roda todas as funções necessárias para definição do vetor
$ cd server/src/setup
$ python vector.py

# Volte ao root e rode o front-end
$ cd ../../../
$ yarn start

```
## ⛔ Erro inicial
Inicialmente, para o banco de dados recém-criado, houve uma taxa de acerto de categorias de 91.2%, para 575 páginas. 
