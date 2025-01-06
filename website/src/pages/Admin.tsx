import React from "react";

const Admin: React.FC = () => {

    const [name, setName] = React.useState<string>("");

    const  handleDeletePage = () => {
        console.log("Deleteing page with id: " + name);
        fetch(`https://wiki-analysis.vercel.app/api/name/${name}`, {
            method: 'DELETE'          
        })
        setName('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleDeletePage();
        }
    }
    

    return (
        <div>  
            <div className="main">
                <h1>Admin</h1>
                <div className="admin-container" style={{ width: '50%'}}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => handleKeyDown(e)}/>
                    <button onClick={() => handleDeletePage()}>Delete</button>
                </div>
            </div>

        </div>
    );
}

export default Admin;