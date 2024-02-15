import React from 'react'
import { IProject, Project, ProjectStatus, UserRole } from '../class/Project';
import { ProjectsManager } from '../class/ProjectManager';
import ProjectCard from './ProjectCard';
import SearchBox from './SearchBox';
import * as Firestore from "firebase/firestore";
import { getCollection } from '../firebase';

interface Props{
  projectManager : ProjectsManager
}

export default function ProjectsPage(props:Props) {
    
    const tipStyle : React.CSSProperties = {
        color:'gray',
        fontSize:"var(--font-sm)",
        marginTop:"5px",
        fontStyle:"italic",
    }

    const getFirestoreProjects = async ()=>{
      const projectsCollection =  getCollection<IProject>("/project") as Firestore.CollectionReference<IProject>;
      const firebaseProjects = await Firestore.getDocs(projectsCollection);
      
      for(const doc of firebaseProjects.docs){
        const data = doc.data();
        const project : IProject= {
          ...data,
          finishDate: (data.finishDate as unknown as Firestore.Timestamp).toDate()
        }

        try{
          props.projectManager.newProject(project, doc.id);
          console.log(project);
        }catch(e){

        }
      }
    }

    React.useEffect(()=>{
      getFirestoreProjects()

    },[])

    //const [projectManager] = React.useState(new ProjectsManager());
    const [projects, setProjects]= React.useState<Project[]>(props.projectManager.list);
    props.projectManager.onProjectCreated = ()=>{
      setProjects([...props.projectManager.list]);
      //console.log("id of created project: ", projects[-1].id);
    }
    props.projectManager.onProjectDeleted=()=>{
      setProjects([...props.projectManager.list]);
    }

    const projectCards = projects.map((project)=>{
      return <ProjectCard project={project}  key={project.id}/>
    })

    React.useEffect(()=>{
      console.log("Project status updated: ",projects);
    },[projects])
    const onNewProjectClick = ()=>{
        const modal = document.getElementById("new-project-modal");
        if(!(modal && modal instanceof HTMLDialogElement)) return;
        modal.showModal();
    }

    const showOrHideModal = (boolValue: boolean)=>{
        const modal = document.getElementById("new-project-modal");
        if(!(modal && modal instanceof HTMLDialogElement)) return;
        if(boolValue) modal.showModal();
        else modal.close();
    }

    const onFormSubmit = (e : React.FormEvent)=>{
        e.preventDefault();
        
        const projectForm = document.getElementById("new-project-form");
        if(!(projectForm && projectForm instanceof HTMLFormElement )) return;
        
        const formData = new FormData(projectForm)
        var data : IProject = {
            name:formData.get("name") as string,
            status:formData.get("status") as ProjectStatus,
            description:formData.get("description") as string,
            userRole:formData.get("userRole") as UserRole,
            finishDate:new Date(formData.get("finishDate") as string)
        }
        try{
            const projectsCollection = getCollection<IProject>("/project");
            //const projectsCollection =  Firestore.collection(firebaseDB,"/project") as Firestore.CollectionReference<IProject>;
            Firestore.addDoc(projectsCollection,data);
            var project = props.projectManager.newProject(data);
            //console.log("fill project: ",project);
            projectForm.reset();
            showOrHideModal(false);
        }catch(err){
            console.log("error", err);
           // alert(err)
            const errorDialog = document.getElementById("error-project-modal") as HTMLDialogElement;
            errorDialog.innerHTML = `
            <div class="alert-modal">
            <button type="button" id="alertClosebtn" >&times;</button> 
            <p>${err}</p>
            </div>`
            showOrHideModal(true)
            const errorCloseModalWindow = document.getElementById("alertClosebtn");
            if(errorCloseModalWindow){
                errorCloseModalWindow.addEventListener("click",()=>showOrHideModal(false))
            }else{
                console.warn("error close button was not found")
            }
        }
    }

    const onProjectSearch = (value : string)=>{
      const filteredProjects = props.projectManager.list.filter((project)=>project.name.includes(value));
      setProjects(filteredProjects);
    }

    

  return (
    <div className="page" id="projects-page">
  <dialog id="error-project-modal">
    <div className="alert-modal">
      {/* <button type="button" id="alertClosebtn" >&times;</button>
                  This is an alert box. */}
    </div>
  </dialog>
  <dialog id="new-project-modal">
    <form onSubmit={(e)=>onFormSubmit(e)} id="new-project-form">
      <h2>New Project</h2>
      <div className="input-list">
        <div className="form-field-container">
          <label
            htmlFor="name"
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span className="material-symbols-outlined">location_city</span>
            Name
          </label>
          <input
            data-form-name="name"
            type="text"
            name="name"
            placeholder="Whts the name of your project?"
          />
          <div id="input-tip">TIP Give it short name</div>
        </div>
        <div className="form-field-container">
          <label
            htmlFor="description"
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span className="material-symbols-outlined">summarize</span>
            Description
          </label>
          <textarea
            name="description"
            cols={30}
            rows={5}
            placeholder="Add Description of project"
            defaultValue={""}
          />
        </div>
        <div className="form-field-container">
          <label
            htmlFor="userRole"
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span className="material-symbols-outlined">account_circle</span>
            Role
          </label>
          <select name="userRole">
            <option>Architect</option>
            <option>Engineer</option>
            <option>Developer</option>
          </select>
        </div>
        <div className="form-field-container">
          <label
            htmlFor="status"
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span className="material-symbols-outlined">help</span>
            Status
          </label>
          <select name="status">
            <option>Pending</option>
            <option>Active</option>
            <option>Finished</option>
          </select>
        </div>
        <div className="form-field-container">
          <label
            htmlFor="finishDate"
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span className="material-symbols-outlined">calendar_month</span>
            Date
          </label>
          <input id="dateCalendar" name="finishDate" type="date" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 5,
          padding: 10
        }}
      >
        <button
          id="cancel-new-project-button"
          type="button"
          className="form-cancel-button"
          onClick={()=>(showOrHideModal(false))}
        >
          Cancel
        </button>
        <button type="submit" className="form-confirm-button" >
          Accept
        </button>
      </div>
    </form>
  </dialog>
  <header id="page-header">
    <h2>Projects</h2>
    <SearchBox  projectManager ={props.projectManager} setProjects = {setProjects} />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
        columnGap: 15
      }}
    >
      <span id="import-projects-btn" className="material-symbols-outlined">
        upload
      </span>
      <span id="export-projects-btn" className="material-symbols-outlined">
        download
      </span>
      <span id="import-description-btn" className="material-symbols-outlined">
        description
      </span>
      <button onClick={onNewProjectClick} id="new-project-button">
        <span className="material-symbols-outlined">add</span>
        New Project
      </button>
    </div>
  </header>
  <div id="projects-list">
    {/* here goes projects card div managed by ProjectManager class */}
    {projects.length>0 ? projectCards : <h3>Nothing was found</h3>}
  </div>
</div>

  )
}
