import { Page } from './models/page'; 
const database = require('./database');
import analyze from "./analyzer"

const PageController = {
    create: async (body:any) => {
        const analysis = await analyze(body.url)
        console.log(analysis)

        
        const sql = `INSERT INTO page (name, url, vector, category) VALUES ('${analysis.title}', '${analysis.url}', '${analysis.vector}', '${analysis.categories.main}')`;

        const exists = await database.query(`SELECT COUNT(*) FROM page WHERE name = '${analysis.title}'`)
        
        if(parseInt(exists[0].count) === 0){
            await database.query(sql)
        }
        
        return analysis;
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