import { Page } from './models/page'; 
const database = require('./database');
import { analyze } from "./analyzer"

const PageController = {
    create: async (body:any) => {
        const analysis = await analyze(body.url)
                
        const exists = await database.query(`SELECT COUNT(*) FROM page WHERE name = '${analysis.title}'`)
        
        if(parseInt(exists[0].count) === 0){
            await database.query(`INSERT INTO page (name, url, vector, category) VALUES ('${analysis.title}', '${analysis.url}', '${analysis.vector}', '${analysis.categories.main}')`)
            analysis.siblings = analysis.siblings.slice(0, -1)
        }
        else {
            await database.query(`UPDATA page SET category = '${analysis.categories.main}' WHERE name = '${analysis.title}'`)
            analysis.siblings = analysis.siblings.slice(1)
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

    readByName: async (name: string) => {
        const sql = `SELECT * FROM page WHERE name = '${name}';`;

        const result = await database.query(sql)
        return result;
    },

    delete: async (name: string) => {
        const sql = `DELETE FROM page WHERE LOWER(name) = '${name.toLowerCase().replace("_", " ")}';`;

        const result = await database.query(sql)
        return result;
    }
}

export default PageController;