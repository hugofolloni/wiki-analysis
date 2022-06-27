import { useEffect, useState } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
// import { distance, cosine } from '../library'
// import math from 'mathjs';
import { distance, cosine } from '../library';

const Analysis: React.FC = () => {

    type Similarity = {
        distance: number,
        page: string,
        cosine: number,
        category: string
    }

    type Occurrence = {
        word: string,
        count: number
    }

    const [pageTitle, setPageTitle] = useState('');
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [category, setCategory] = useState<string>('');
    const [firstByCosine, setFirstByCosine] = useState<Similarity>();
    const [secondByCosine, setSecondByCosine] = useState<Similarity>();
    const [thirdByCosine, setThirdByCosine] = useState<Similarity>();
    const [fourthByCosine, setFourthByCosine] = useState<Similarity>();
    const [fifthByCosine, setFifthByCosine] = useState<Similarity>();

    const [page, setPage] = useState<string>('');

    useEffect(() => {
        const location = window.location.href;
        setPage(location.split('?page=')[1]);
    }, []);

    const getDataFromURL = async () => {
        try {
            var vectorWords: string[] = ["física", "mecânica", "energia", "quântica", "química", "massa", "ciências", "ângulo", "matemática", "lógica", "bactérias", "átomos", "biologia", "geometria", "ângulos", "galáxias", "fungos", "partículas", "evolução", "estrutura", "organismos", "estrelas", "medicina", "matéria", "células", "conhecimento", "escola", "galáxia", "campos", "comprimento", "átomo", "reações", "campus", "cursos", "faculdade", "teorias", "definição", "estuda", "compostos", "estudos", "molecular", "método", "equações", "espécie", "fenômenos", "moléculas", "elétrica", "estrela", "genética", "observações", "tv", "anime", "marvel", "filmes", "televisão", "disney", "personagens", "episódio", "mangá", "hollywood", "personagem", "canal", "ator", "livro", "episódios", "emissora", "cinema", "entertainment", "séries", "crunchyroll", "editora", "quadrinhos", "histórias", "comics", "toy", "dc", "netflix", "elenco", "film", "animação", "filme", "studios", "diretor", "reporter", "movie", "season", "cenas", "roteiro", "pictures", "novela", "teatro", "volume", "temporada", "mangás", "ficção", "record", "ign", "atriz", "emissoras", "série", "copa", "campeonato", "seleção", "liga", "nba", "gols", "pontos", "clube", "partida", "globoesporte", "fluminense", "marcou", "gol", "campeões", "torneio", "time", "olímpicos", "campeão", "clubes", "competição", "venceu", "vs", "esporte", "bola", "recorde", "estádio", "equipes", "pontos", "fase", "taça", "olímpico", "títulos", "corrida", "técnico", "vitórias", "assistências", "mvp", "partidas", "placar", "vencer", "rodada", "derrota", "olimpíadas", "jogo", "esportes", "medalha", "atletas", "conquistou", "jogar", "treinador", "porto", "deserto", "municipal", "habitantes", "município", "regiões", "cidade", "parque", "ibge", "água", "geografia", "clima", "ilha", "estadual", "vale", "mar", "metropolitana", "construção", "estação", "oceano", "prefeitura", "municípios", "aeroporto", "bairro", "leste", "distrito", "oeste", "rios", "interior", "°c", "serra", "país", "condado", "temperatura", "continente", "lago", "baía", "urbana", "província", "bairros", "global", "censo", "localizado", "pib", "vila", "montanhas", "atlântico", "locais", "precipitação", "temperaturas", "revolução", "war", "escravos", "batalha", "tropas", "soviética", "militares", "regime", "comérci", "socialismo", "soldados", "escravidão", "aliados", "invasão", "comunista", "tratado", "conflito", "socialista", "influência", "comando", "crise", "navios", "revolta", "napoleão", "armas", "artigos", "guerras", "políticos", "socialistas", "independência", "trabalhadores", "ditadura", "séculos", "comunismo", "liberdade", "terras", "comunistas", "antigo", "obra", "political", "imperador", "capitalismo", "líderes", "movimentos", "povos", "soviéticos", "povo", "franceses", "oposição", "constituição", "banda", "álbum", "rock", "music", "metal", "musical", "samba", "billboard", "canção", "turnê", "canções", "bandas", "músicas", "single", "show", "beatles", "guitarra", "disco", "álbuns", "som", "artistas", "mozart", "musicais", "instrumentos", "mtv", "funk", "pop", "grammy", "artista", "shows", "cantor", "cordas", "live", "gravação", "punk", "gênero", "vocal", "carnaval", "músicos", "album", "guitarrista", "bateria", "baixo", "solo", "rádio", "vocalista", "tocar", "festival", "vocais", "singles", "boeing", "família", "crenças", "passageiros", "normas", "casamento", "crença", "direito", "moeda", "dólar", "ônibus", "regras", "famílias", "trânsito", "justiça", "veículos", "r$", "sociedades", "pessoa", "bens", "línguas", "sobrenome", "eleitoral", "motor", "valores", "indivíduo", "companhias", "jurídica", "filhos", "atividade", "religião", "indivíduos", "norma", "jurídicas", "casos", "atividades", "votos", "carros", "tráfego", "responsável", "pedestres", "organizações", "eleições", "lazer", "circulação", "sobrenomes", "tribunal", "mulheres", "comunidade", "exércitos", "software", "google", "computador", "linguagem", "computadores", "windows", "internet", "linux", "memória", "usuários", "microsoft", "web", "facebook", "ubuntu", "usuário", "informação", "apple", "redes", "informações", "operacional", "segurança", "máquina", "dispositivos", "inteligência", "linguagens", "artificial", "python", "javascript", "interface", "aplicações", "pc", "computação", "java", "processamento", "arquivos", "tecnologias", "máquinas", "online", "servidor", "twitter", "dispositivo", "eletrônicos", "componentes", "processador", "operacionais", "processadores", "eletrônico", "hardware", "computer", "games"]
            const proxy = 'https://the-cors.herokuapp.com/';
            const pageUrl = 'https://pt.wikipedia.org/wiki/' + page;
            const myURL = `${proxy}${pageUrl}`
            const { data } = await axios.get(myURL);
            const $ = cheerio.load(data);

            var textList: string[] = [];

            $('.firstHeading').each(function (i, elem) {
                textList.push($(this).text());
                setPageTitle($(this).text());
            }
            );

            $('.mw-parser-output > p').each((_idx, el) => {
                const bodyPart = $(el).text()
                textList.push(bodyPart)
            });
    
            const words = textList.join('\n').split(' ')
            var pageVector = []
            for(var i = 0; i < vectorWords.length; i++){
                var count = 0;
                for(var j = 0; j < words.length; j++){
                    if(vectorWords[i] === words[j]){
                        count++;
                    }
                }
                pageVector.push(count)
            }
            var ocorrencias: Occurrence[] = [];
            for(var loop = 0; loop < vectorWords.length; loop++){
                ocorrencias.push({
                    word: vectorWords[loop],
                    count: pageVector[loop]
                })
            }
            console.log(ocorrencias)
            return pageVector;
        }
        catch (error) {
            console.log(error)
            console.log("Não foi possível responder sua requisição. Cheque a URL e tente novamente mais tarde!")
        }
    }


    const runVector = async () => {
        var pageVector = await getDataFromURL() as number[];
        var distances: Similarity[] = [];
        var cosines: Similarity[] = [];
        fetch('http://localhost:4000/api')
        .then(res => res.json())
        .then(data => {
            const dbLength = data.length;
            for(var i = 0; i < dbLength; i++){
                const dbStrings: string[] = data[i].vetor.replace('[', '').replace(']', '').split(',') 
                var dbVector = dbStrings.map(str => parseInt(str))
                distances.push({ distance: distance(pageVector, dbVector), page: data[i].nome, cosine: cosine(pageVector, dbVector), category: data[i].categoria })
                cosines.push({ cosine: cosine(pageVector, dbVector), page: data[i].nome, distance: distance(pageVector, dbVector), category: data[i].categoria })
            }
        })
        .catch(err => console.log(err))
        .then(() => {
            distances.sort((a, b) => a.distance - b.distance)
            console.log(distances)
            cosines.sort((a, b) => a.cosine - b.cosine).reverse()
            console.log(cosines)
            setFirstByCosine(cosines[0])
            setSecondByCosine(cosines[1])
            setThirdByCosine(cosines[2])    
            setFourthByCosine(cosines[3])
            setFifthByCosine(cosines[4])
            const categories = [cosines[0].category, cosines[1].category, cosines[2].category, cosines[3].category, cosines[4].category]
            setCategory(findCategory(categories)[0])
        //     fetch(`http://localhost:4000/api/`)
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log(data)
        //         var existOnDB = false;
        //         for(var i = 0; i < data.length; i++){
        //             if(pageTitle === data[i].nome){
        //                 existOnDB = true;
        //             }
        //         }
        //         if(!existOnDB){
        //             const pageUrl = 'https://pt.wikipedia.org/wiki/' + page
        //             const reqBody = JSON.stringify({
        //                 nome: pageTitle,
        //                 vetor: `[${pageVector}]`,
        //                 categoria: findCategory(categories)[1],
        //                 url: pageUrl
        //             })
        //             fetch('http://localhost:4000/api', {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json'
        //                 },
        //                 body: reqBody
        //             })
        //             .then(res => res.json())
        //             .then(() => {
        //                 console.log('Salvo novo registro')
        //             })
        //         }
        //         else{
        //             console.log("Já existe")
        //         }   
        //  })
            setShowAnswer(true)
        })
    }

    const findCategory = (array: string[]) => {
        var arrayCategorias: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
        var categorias = ["Ciências", "Cinema", "Esportes", "Geografia", "História", "Música", "Sociedade", "Tecnologia"]
        var vectorCategories = ['ciencias', 'cinema', 'esportes', 'geografia', 'historia', 'musica', 'sociedade', 'tecnologia']
        for(var i = 0; i < array.length; i++){
            if(array[i] === 'ciencias'){
                arrayCategorias[0]++;
            }
            if(array[i] === 'cinema'){
                arrayCategorias[1]++
            }
            if(array[i] === 'esportes'){
                arrayCategorias[2]++
            }
            if(array[i] === 'geografia'){;
                arrayCategorias[3]++;
            }
            if(array[i] === 'historia'){
                arrayCategorias[4]++
            }
            if(array[i] === 'musica'){
                arrayCategorias[5]++
            }
            if(array[i] === 'sociedade'){
                arrayCategorias[6]++
            }
            if(array[i] === 'tecnologia'){
                arrayCategorias[7]++
            }
        }
        return [categorias[arrayCategorias.indexOf(Math.max(...arrayCategorias))], vectorCategories[arrayCategorias.indexOf(Math.max(...arrayCategorias))]];
    }
   

    return (
        <div>
            <h1>Analysis</h1>
            <h2>Analisar {pageTitle}</h2>
            <button onClick={() => runVector()}>Run</button>
            {showAnswer && (
                <div>
                    <h2>Resultados</h2>
                    <h3>Categoria: {category}</h3>
                    <h5>First by Cosine: {firstByCosine?.page} - {firstByCosine?.cosine.toFixed(3)}</h5>
                    <h5>Second by Cosine: {secondByCosine?.page} - {secondByCosine?.cosine.toFixed(3)}</h5>
                    <h5>Third by Cosine: {thirdByCosine?.page} - {thirdByCosine?.cosine.toFixed(3)}</h5>
                    <h5>Fourth by Cosine: {fourthByCosine?.page} - {fourthByCosine?.cosine.toFixed(3)}</h5>
                    <h5>Fifth by Cosine: {fifthByCosine?.page} - {fifthByCosine?.cosine.toFixed(3)}</h5>
                </div>
            )}
        </div>
    );
}

export default Analysis;