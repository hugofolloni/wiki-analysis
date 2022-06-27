import React from 'react';
import { useState } from 'react';

const Home: React.FC = () => {

    const [page, setPage] = useState<string>('');

    const handleSubmit = () => {
        var nextPage = ''
        if(page.indexOf('https://pt.wikipedia.org/wiki/') === -1) {
            nextPage = page
        }
        else{
            nextPage = page.split('https://pt.wikipedia.org/wiki/')[1];
        }
        window.location.href = '/analysis?page=' + nextPage;
    }

    return (
        <div>
            <input type="text" value={page} onChange={(e) => setPage(e.target.value)} />
            <button onClick={() => handleSubmit()}>Submit</button>
        </div>
    );
}

export default Home;
