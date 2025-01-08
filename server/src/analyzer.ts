import axios from 'axios';
var vector = require('./vector.json');
const cheerio = require('cheerio');
import  PageController from './controllers';
import { Page, Result, Comparision, Categories } from "./models/models"
import { cosine } from "./library"

const scrapper = async (url: string): Promise<[string, string, string[]]> => {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    var textList:string[] = []
    var title;

    $('.firstHeading').each(function (i:number, elem:string) {
        title = $(this).text()
    }
    );

    $('.mw-parser-output > p').each((i:number, elem:string) => {
        const bodyPart = $(elem).text()
        textList.push(bodyPart)
    });

    var description = ""; 

    for(let i = 0; i < 3; i++){
      if(textList[i].length > 20){
        const splitted = textList[i].split('.')
        description = splitted[0] 
        if(description.length < 10){
          description += '.' + splitted[1] 
        }
        description += "."
        break;
      }
    }
    
    return [title, description, textList.join('\n').split(' ')];
  } catch (error) {
    console.error('Error scraping data:', error);
    return [, , []];
  }
}

const getVector = (page: string[]) => {
    var totalEntries: number = 0
    var pageVector:number[] = []
    for(var i = 0; i < vector.words.length; i++){
        var count = 0;
        for(var j = 0; j < page.length; j++){
            if(vector.words[i] === page[j].replace('.', ' ').replace(",", ' ')){
                count++;
              }
            }
        pageVector.push(count)
        totalEntries += count;
    }
    return {
      vector: pageVector,
      entries: totalEntries
    }
}

const compare = (vector: number[], pages: Page[]) => {
  var comparisions: Comparision[] = []
  for(let i = 0; i < pages.length; i++){
    var databaseVector = pages[i].vector.replace('[', '').replace(']', '').split(',').map(str => parseInt(str))
    comparisions.push({page: pages[i].name, cosine: cosine(vector, databaseVector), category: pages[i].category, url: pages[i].url})
  }
  comparisions.sort((database, current) => current.cosine - database.cosine)
  return comparisions;
}

const categorize = (proximity: Comparision[]) => {
  console.log(proximity)
  const category: Categories = { main: null, secondary: null };
  const countMap: Record<string, number> = {};

  for (const item of proximity) {
    countMap[item.category] = (countMap[item.category] || 0) + 1;
  }

  const sortedCategories = Object.entries(countMap).sort((a, b) => b[1] - a[1] || proximity.findIndex(p => p.category === a[0]) - proximity.findIndex(p => p.category === b[0])); 
  console.log(sortedCategories)

  category.main = sortedCategories[0][0];

  if (sortedCategories.length > 1 && sortedCategories[1][1] === 2) {
    category.secondary = sortedCategories[1][0];
  }

  return category;
}


const analyze = async (url: string) => {

    const page = await scrapper(url)
    
    if (!page || !page[0] || !page[1]) {
      throw new Error("Error fetching content: Missing title or description!");
  }

    const title = page[0].replace("'", "''")
    const description = page[1].replace("'", "''")
    const tokens = page[2]

    const vector = await getVector(tokens);
    if(vector.entries === 0){
      throw new Error("Page is empty");
    }

    const pages = await PageController.readAll();
    const comparisions = await compare(vector.vector, pages);
    var slicer = [0, 5]
    if(comparisions[0].page === title){
      slicer = [1, 6]
    }
    const proximity = comparisions.slice(slicer[0], slicer[1])
    const categories = await categorize(proximity)
    const response: Result = {title: title, description: description, url: url.replace("'", "''"), categories: categories, siblings: proximity, vector: `[${vector.vector}]`}
    return response

}

export { analyze };
