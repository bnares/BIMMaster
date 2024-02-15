import React from 'react'
import { Project } from '../class/Project'
import * as Router from "react-router-dom";

interface Props {
    project: Project
}

function ProjectCard(props : Props) {
   
  return (
    <Router.Link to={`/project/${props.project.id}`}>
    <div className='project-card' onClick={()=>{console.log("clicked id: ",props.project.id)}}>
        <div className="card-header">
            <p
            style={{
                backgroundColor: "#ca8134",
                padding: 10,
                borderRadius: 8,
                aspectRatio: 1
            }}
            >
                HC
            </p>
            <div>
            <h5>
            {props.project.name}
            </h5>
            <p>
                {props.project.description}
            </p>
            </div>
        </div>
        <div className="card-content">
            <div className="card-property">
            <p style={{ color: "#969696" }}>Status</p>
            <p>
                {props.project.status}
            </p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Role</p>
            <p>
                {props.project.userRole}
            </p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Cost</p>
            <p>
                ${props.project.cost}
            </p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Estimated Progress</p>
            <p>
                {props.project.progress*100}%
            </p>
            </div>
        </div>
    </div>
    </Router.Link>
  )
}

export default ProjectCard