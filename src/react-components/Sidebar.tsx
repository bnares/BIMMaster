import * as React from "react";
import * as Router from "react-router-dom";
import { ViewerContext } from "./IFCViewer";
import { TodoCreator } from "../bim-components/TodoCreator";

export function Sidebar(){
    const {viewer} = React.useContext(ViewerContext);
    const createTodo = async ()=>{
        if(!viewer) return;
        const todoCreator = await viewer.tools.get(TodoCreator);
        todoCreator.addToDo("My custom to do","Medium");
    }

    return(
        <aside id="sidebar">
            <img id="company-logo" src="./assets/company-logo.svg" alt="Construction company"></img>
            <ul id="nav-buttons">
                <Router.Link to="/">
                    <li id="projectsList-button">
                        <span className="material-symbols-outlined">
                            apartment
                        </span>
                        Projects
                    </li>
                </Router.Link>
                <Router.Link to="/project">
                    <li>
                        <span className="material-icons">peolple</span>
                        Users
                    </li>
                </Router.Link>
                <li onClick={createTodo}>
                    <span className="material-icons-round">construction</span>
                
                </li>
                
            </ul>
        </aside>
    )
}