export type Page = {
    id: number;
    vector: string;
    name: string;
    url: string;
    category: string;
}
  
export type Result = {
    title: string,
    description: string,
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