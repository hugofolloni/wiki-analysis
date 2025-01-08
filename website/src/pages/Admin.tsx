import { useEffect, useState, ReactNode } from "react";
import { Page } from './models'

const Admin: React.FC = () => {

    const [pages, setPages] = useState<Page[]>()
    const [pageIndex, setPageIndex] = useState<number[]>([0, 50])

    const handleDeletePage = (name: string, idx: number) => {
        if(pages) { 
            const updatedPages = [...pages]; 
            updatedPages.splice(idx, 1); 
            setPages(updatedPages); 
            fetch(`https://wiki-analysis.vercel.app/api/name/${name}`, {
                method: 'DELETE'          
            })
        }
    }

    useEffect(() => {
        fetch('https://wiki-analysis.vercel.app/api/')
        .then(res => res.json())
        .then(data => {
            console.log(data) 
            setPages(data.reverse())
        })
    }, [])
    
    const changeIndex = (signal: string) => {
        if(signal === "-" && pageIndex[0] > 0) {
            setPageIndex([pageIndex[0] - 50, pageIndex[1] - 50])
        }

        if(pages&& signal === "+" && pageIndex[1]  < pages?.length) {
            setPageIndex([pageIndex[0] + 50, pageIndex[1] + 50])
        }
    }

    return (
        <div>  
            <div className="main">
                {(pages && <h1>Admin</h1>) || <h3>Loading...</h3>}
                <div className="admin-container">
                    {pages && pages?.length > 0 && pages.slice(pageIndex[0], pageIndex[1]).map((page, idx): ReactNode => (
                        <div className="admin-item">
                            <h2>{page.name}</h2>
                            <h4>{page.category}</h4>
                            <div onClick={() => handleDeletePage(page.name, idx)}>Delete</div>
                        </div>
                    ))}
                </div>
                {pages && 
                <div className="admin-selector">
                    <h3 onClick={() => changeIndex("-")}>{'<'}</h3>
                    <h3 onClick={() => changeIndex("+")}>{'>'}</h3>
                    <h4>{pageIndex[0]} - {pages && Math.min(pages.length, pageIndex[1])}</h4>
                </div>
                }
            </div>

        </div>
    );
}

export default Admin;