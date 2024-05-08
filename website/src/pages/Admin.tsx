import React from "react";

const Admin: React.FC = () => {

    const [id, setId] = React.useState<string>("");

    const  handleDeletePage = () => {
        console.log("Deleteing page with id: " + id);
        fetch(`http://localhost:4000/api/${id}`, {
            method: 'DELETE'          
        })
        setId('')
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
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} onKeyDown={(e) => handleKeyDown(e)}/>
                    <button onClick={() => handleDeletePage()}>Delete</button>
                </div>
            </div>

        </div>
    );
}

export default Admin;