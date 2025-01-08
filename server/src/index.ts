import express from 'express';
import router from './routers';
import cors from 'cors';

const PORT = process.env.port || 4000;

const HOSTNAME = process.env.HOSTNAME || 'http://localhost'

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World');
    }
);

app.use(cors({
    origin: ['http://localhost:3000', 'https://wiki-analysis.netlify.app'], // Lista de origens permitidas
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', router);

app.use((req, res) => {
    res.status(404)
})

app.listen(PORT, () => {
    console.log(`Server is running on ${HOSTNAME}:${PORT}`);
})


// https://wiki-analysis.vercel.app
// https://wiki-analysis.vercel.app