import axios from 'axios';
var vector = require('./vector.json');
const cheerio = require('cheerio');
import  PageController from './controllers';
import { Page } from "./models/page"
import { cosine } from "./library"

type Result = {
  title: string,
  url: string,
  categories: Categories,
  siblings: Comparision[],
  vector: string
}

type Comparision = {
  page: string,
  cosine: number,
  category: string,
  url: string
}

type Categories = {
  main: string,
  secondary: string
}

const categories = ['science', 'movie', 'sports', 'geography', 'history', 'music', 'society', 'technology']

const scrapper = async (url: string): Promise<[string, string[]]> => {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    var textList:string[] = []
    var title;

    $('.firstHeading').each(function (i:number, elem:string) {
      title = $(this).text()
        textList.push(title);
    }
    );

    $('.mw-parser-output > p').each((i:number, elem:string) => {
        const bodyPart = $(elem).text().replace('.', ' ').replace(",", ' ')
        textList.push(bodyPart)
    });

    return [title, textList.join('\n').split(' ')];
  } catch (error) {
    console.error('Error scraping data:', error);
    return [, []];
  }
}

const getVector = (page: string[]) => {
    var totalEntries: number = 0
    var pageVector:number[] = []
    for(var i = 0; i < vector.words.length; i++){
        var count = 0;
        for(var j = 0; j < page.length; j++){
            if(vector.words[i] === page[j]){
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
  var category:Categories = {main: null, secondary: null};
  var count = [0, 0, 0, 0, 0, 0, 0, 0];
  for(let i = 0; i < proximity.length; i++){
    const siblingCategory = proximity[i].category;
    for(let j = 0; j < categories.length; j++){
      const thisCategory = categories[j]
      if(siblingCategory === thisCategory){
        count[j]++
      }
    }
  }
  for(let i = 0; i < categories.length; i++){
    if(count[i] >= 3){
      category.main = categories[i]
    }
  }
  for(let i = 0; i < categories.length; i++){
    if(count[i] == 2){
      if(category.main === null){
          category.main = categories[i]
      }
      else {
        category.secondary = categories[i]
      }
    }
  }
  return category
}


const analyze = async (url: string) => {
  try {
    const page = await scrapper(url)
    const title = page[0]
    const tokens = page[1]

    if(!page){
      throw new Error("Error fetching content!")
    }
  
    const vector = await getVector(tokens);
    if(vector.entries === 0){
      throw new Error("Page is empty");
    }
    const pages = await PageController.readAll();
    const comparisions = await compare(vector.vector, pages);
    const proximity = comparisions.slice(0, 5)
    const categories = categorize(proximity)
    const response: Result = {title: title, url: url, categories: categories, siblings: proximity, vector: `[${vector.vector}]`}
    console.log(response)
    return response
  }
  catch (error) {
    console.log(error)
  }
}

export default analyze;
