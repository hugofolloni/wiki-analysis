import { Page } from './models/page'; 
const database = require('./database');
import analyze from "./analyzer"

const PageController = {
    create: async (page:any) => {
        const analysis = await analyze(page.url)
        console.log(analysis)

        

        const sql = `INSERT INTO page (nome, url, vetor, categoria) VALUES (${analysis.title}, ${analysis.url}, ${analysis.vector}, ${page.category})`;

        console.log(sql)

        // return true;
        const result = await database.query(sql)
        return result;
    },

    readAll: async () => {
        const sql = 'SELECT * FROM page';

        const result = await database.query(sql)
        return result;
    },

    read: async (id: number) => {
        const sql = `SELECT * FROM page WHERE id = ${id}`;

        const result = await database.query(sql)
        return result;
    },

    readFiltered: async (filter: string ) => {
        const sql = `SELECT * FROM page WHERE category LIKE '%${filter}%'`;

        const result = await database.query(sql)
        return result;
    },

    readByName: async (nome: string) => {
        const sql = `SELECT * FROM page WHERE name = '${nome}';`;

        const result = await database.query(sql)
        return result;
    },

    delete: async (id: number) => {
        const sql = `DELETE FROM page WHERE id = ${id}`;

        await database.query(sql);
        return true; 
    }
}

export default PageController;