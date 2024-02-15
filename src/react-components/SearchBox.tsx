import React from 'react'
import { ProjectsManager } from '../class/ProjectManager'
import { Project } from '../class/Project'
interface Props{
    //onChangeEvent: (value : string)=>void,
    projectManager : ProjectsManager,
    setProjects: (value: Project[])=>void
}
function SearchBox(props: Props) {
    
  return (
    <div style={{display:"flex", alignItems:"center", columnGap:10, width:"40%"}}>
        <input 
            onChange={(e)=>{props.projectManager.onProjectSearch(e.target.value, props.setProjects)}}
            type='text'
            placeholder='Search projects by name...'
            style={{width:'100%', height:'40px', backgroundColor:"var(--background-100)"}}
        />
    </div>
  )
}

export default SearchBox