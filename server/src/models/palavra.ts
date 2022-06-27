export type Palavra = {
    id: number;
    palavra: string;
    contagem: number;
}

export type Pagina = {
    id: number;
    palavras: Palavra[];
    nome: string;
    url: string;
}