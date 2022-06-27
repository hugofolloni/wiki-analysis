import express from 'express';
import { Pagina } from '../models/palavra';
import  PageRepository from '../repositories/page-repository';

const PAGES_ROUTER = express.Router();

PAGES_ROUTER.get('/', (req, res) => {
    PageRepository.readAll((paginas) => {
        res.json(paginas);
    }
    );
});

PAGES_ROUTER.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    PageRepository.read(id, (pagina) => {
        res.json(pagina);
    }
    );
}
);

PAGES_ROUTER.get('/search/:filter', (req, res) => {
    const filter = req.params.filter;
    PageRepository.readFiltered(filter, (paginas) => {
        res.json(paginas);
    }
    );
}
);

PAGES_ROUTER.get('/name/:name', (req, res) => {
    const name = req.params.name;
    PageRepository.readByName(name, (pagina) => {
        res.json(pagina);
    }
    );
}
);

PAGES_ROUTER.post('/', (req, res) => {
    const pagina = req.body as Pagina;
    PageRepository.create(pagina, (id) => {
        if(id){
            res.status(201).location(`/pages/${id}`).send();
        }
        else{
            res.status(400).send();
        }
    }
    );
}
);

PAGES_ROUTER.put('/:id', (req, res) => {
    const pagina = req.body as Pagina;
    pagina.id = parseInt(req.params.id);
    PageRepository.update(pagina, (notFound) => {
        if (notFound) {
            res.status(404);
        }
        res.send();
    }
    );
}
);

PAGES_ROUTER.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    PageRepository.delete(id, (notFound) => {
        if (notFound) {
            res.status(404);
        }
        res.send();
    }
    );
}
);

export default PAGES_ROUTER;