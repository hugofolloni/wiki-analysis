import express from 'express';
import routers from './routers';
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
    origin: ['*'],	
}))

app.use('/api', routers);

app.use((req, res) => {
    res.status(404)
})

app.listen(PORT, () => {
    console.log(`Server is running on ${HOSTNAME}:${PORT}`);
})


