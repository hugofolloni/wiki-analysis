import { ReactNode, useState } from 'react';
import { Result } from './models'

const Analysis: React.FC = () => {

    const [page, setPage] = useState<string>("")

    const [data, setData] = useState({} as Result)
    const [showContainer, setShowContainer] = useState(false)
    const [showAnswer, setShowAnswer] = useState(false)

    const runVector = () => {
        setShowContainer(true)

        var searchFor = page
        if(page.indexOf('en.wikipedia.org') === -1){
            searchFor = `https://en.wikipedia.org/wiki/${page.replace(" ", "_")}`
        }

        console.log(searchFor)

        fetch('https://wiki-analysis.vercel.app/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                url: `${searchFor}`
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setData(data)
        })
        .then(() => 
            setShowAnswer(true)
        )
    }


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            runVector();
        }
    }

    return (
        <div className='main'>
            <div className="main-texts">
                <h2>I CAN REVEAL A WIKIPEDIA CATEGORY</h2>
                <p>Enter the page title exactly as it appears in the title bar or URL.</p>
            </div>
            <div className="inputs-field">
                <input type="text" value={page} onChange={(e) => setPage(e.target.value)} onKeyDown={(e) => handleKeyDown(e)}/>
                <button onClick={() => runVector()}>Go</button>
            </div>
            {showContainer && (
                <div className="answer-wrapper">
                    <div className="translucent" onClick={() => window.location.reload()}/>
                    <div className="answer-div">
                    <p onClick={() => window.location.reload()} className='close-button'>X</p>
                    {(showAnswer && (
                        <div className='main-answer'>
                            <h2 className='page-title'>{data.title}</h2>
                            <div className="category">
                                <h3 style={{fontSize: '12px', fontWeight: '500', textAlign: 'start'}}>{data.description}</h3>
                            </div>
                            <div className="category">
                                <h3>Category: {data.categories.main[0].toUpperCase()}{data.categories.main.slice(1).toLowerCase()}</h3>
                                {data.categories.secondary !== null && (
                                    <h4>Secondary: {data.categories.secondary[0].toUpperCase()}{data.categories.secondary.slice(1).toLowerCase()}</h4>
                                )}    
                            </div>
                            <div className="recom">
                                <h3>Recommendations:</h3>
                                { data.siblings.map((item):ReactNode=> (
                                    <span>- <a target='_blank' rel='noreferrer' href={item.url}>{item.page}</a> - {item.cosine.toFixed(3)}</span>
                                ))}  
                            </div>
                        </div>
                    
                 )) || <div className="loader"/>}
                 </div>
                </div>)}
            
        </div>
    );
}

export default Analysis;