import express from 'express';
import { Page } from './models/page';
import  PageController from './controllers';

const router = express.Router();

router.get("/", async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.send(await PageController.readAll())
})

router.get('/:id', async (req, res) => {
    res.send(await PageController.read(parseInt(req.params.id)));
});

router.get('/search/:filter', async (req, res) => {
    res.send(await PageController.readFiltered(req.params.filter));
});

router.get('/name/:name', async (req, res) => {
    res.send(await PageController.readByName(req.params.name));
}
);

router.post('/', async (req, res) => {
    console.log('here')
    res.json(await PageController.create(req.body))
});

router.delete('/:id', async (req, res) => {
    res.send(await PageController.delete(parseInt(req.params.id)));
});

export default router;
