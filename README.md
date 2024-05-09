# wiki-analysis
The project was based on attempting to categorize a Wikipedia article based on other articles, finding vectors for each of them. Using Linear Algebra, it calculates the similarity between pages, using the cosine between the page vector and each of the vectors in the database. Additionally, the algorithm is capable of learning from requests, becoming more efficient over time.

- [🧮 Algorithm](#-algorithm)
- [🔴 Live](#-live)
- [🏗️ Structure](#️-structure)
- [🪛 Functioning](#-functioning)
- [🖥️ Technologies](#-technologies)
- [📓 How to Run](#-how-to-run)
- [⛔ Initial Error](#-initial-error)


## 🧮 Algorithm 

The algorithm will construct, for each Wikipedia article, a vector, taking into account the words forming each dimension. Then, it will compare the page based on the cosines between it and the other vectors.

##### Cosine Formula 
$cos(x, y) = {x^t y \over \||x|| ||y||}$


The cosine varies between [-1, 1], and the higher it is, the more similar two vectors are. This was the chosen strategy to compare our pages and determine their category based on the most similar ones.

With each request, the algorithm saves the new vector in the database, thus learning and increasing the number of comparisons it can make, which increases efficiency.

## 🔴 Live 
The project is live at the [link](https://wiki-analysis.netlify.app/) and also has an [API](https://wiki-analysis.vercel.app/api).

A PDF with the report (in Portuguese) containing more detailed explanations of the project is available at: [PDF](https://github.com/hugofolloni/wiki-analysis/blob/master/website/public/relatório.pdf)


## 🏗️ Structure 
### Front-end 
Built with TypeScript + React, it has two main components:
- Analysis: responsible for most functions, receives a user page, scrapes it, generates the vector, and compares it with the vectors in the database. After that, it makes the request to the back-end, saving the new page.
- Admin: responsible for deleting items from the database in case of errors.
### Back-end
Built with TypeScript-Node + Express + Python, it has two main parts:
#### Setup (Python)
Generates the data necessary for the application to function, before any user requests.
- categories: contains the categories analyzed in creating the vector.
    - /pages: contains the pages that were used to create the vector.
    - /words: contains the list of words found on the pages used, sorted by frequency.
    - vector: contains the final vector found to be used by the algorithm.
- scrapper: scrapes the base pages.
- comparison: compares the page we want to analyze with the others in the database.
- words_frequency: counts the occurrence of each word to create the ideal vector.
- vector: determines which words are worth using in the vector.
- population: populates the database with the pages defined in categories.
- reliability: indicates the percentage of reliability of the algorithm based on the base pages.
#### API (Typescript)
Responsible for sending data to the front-end and receiving requests as well.
API generated with Express and Typescript, creates the database, provides the endpoints for the API, and makes requests to the database (both post, get, delete, and put).

## 🪛 Functioning
### Preparation
All processes here are performed in Python, within the /server/src/setup folder.
- The administrator defines articles for each of the categories within the /categories/pages folder.
    - It is preferred that there be at least 50 articles in each category.
- After that, scrapper.py scrapes the articles and words_frequency.py finds the most common words in each category and writes them in /categories/pages/words.
    - Ignoring the words defined in generic.py.
- The comparison algorithm in vector.py is then run, defining for each category, which words are common only in it.
    - Then the 50 most common unique category words are chosen, after cleaning up less relevant words.
- The user runs the server (file /server/src/index.ts), generating the database.
- The population is then run, seeking to populate the database with the already chosen pages, defining their category based on the words chosen for the vector.
- At the end of the preparation, reliability is run, which calculates the percentage of reliability of the algorithm. If it is below 90%, it is preferable to redefine the choice of words for the vector.

### Execution
- The user starts the server, running index.ts within /server/src, gaining access to the database via the API.
- The user starts the front-end, running yarn start in the root folder, starting the React server on localhost.
- The user accesses the home page and indicates which page they want to analyze.
- The algorithm present in /src/pages/Analysis.tsx will:
    - Scrape the indicated article, counting the occurrence of each of the words defined in /server/src/setup/categories/vector.txt and then assembling the word vector.
    - The algorithm will request from the API the vectors for all pages in the database, also gaining their names and categories.
    - The algorithm will calculate both the distance and the cosine between the vector of the indicated page and all those in the database, then ordering by highest cosine (most similar) and lowest distance (also more similar).
    - As the cosine method was chosen, the algorithm will receive the 5 highest cosines and create a list with all the categories of each of the pages. If the entire list is the same, then only one category is defined. If there is more than one category, then a main and secondary category are defined.
    - The name, vector, category, and URL of the requested page are then saved in the database, for application improvement.
    - After that, the algorithm will send the data to the front-end, which will build the result page, showing the category(s) and recommending 5 articles with the highest cosine (closest) when compared to the requested article.
- Through the algorithm present in /src/pages/Admin.tsx, the user can delete incorrect data from the database, passing the ID in the database.

## 💻 Technologies
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


## 📓 How to Run:
```bash
# Clone the repository 
$ git clone https://github.com/hugofolloni/wiki-analysis

# Access the folder
$ cd wiki-analysis

# Install necessary packages
$ yarn
$ cd server 
$ yarn 
$ cd ..

# Run the server, to create the database
$ yarn server

# Create the /pages folder inside /server/src/setup/categories and define the pages that the algorithm will use to learn

# Access the setup folder and run the vector.py file
## This file runs all the necessary functions to define the vector
$ cd server/src/setup
$ python vector.py

# Go back to the root and run the front-end
$ cd ../../../
$ yarn start
```

## ⛔ Initial error
Initially, for the newly created database, there was a category accuracy rate of 88.25%, for 400 pages.

