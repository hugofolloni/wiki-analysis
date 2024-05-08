import express from 'express';
import { Page } from './models/page';
import  PageController from './controllers';

const router = express.Router();

router.get("/", async (req, res) => {
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
    res.json(await PageController.create(req.body as Page))
});

router.delete('/:id', async (req, res) => {
    res.send(await PageController.delete(parseInt(req.params.id)));
});

export default router;