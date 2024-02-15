import React from 'react'
import { Project } from '../class/Project'

interface Props{
    project : Project,
    showEditProjectForm : boolean, 
    setShowEditProjectForm : (value: boolean)=>void,
}
function ProjectDetailsInfo(props : Props) {
    //const [showEditProjectForm, setShowEditProjectForm] = React.useState(false);
    //console.log("showEditProjeectForm: ",props.showEditProjectForm);

    function openModal(){
        var window = document.getElementById("edit-project-modal");
        if((window && window instanceof HTMLDialogElement)){
            if(props.showEditProjectForm){
                window.showModal();
            }
            else{
                window.close();
            }
        }
        
    }

    var btn = document.getElementById("cancel-edit-project-button");
      if(btn && btn instanceof HTMLButtonElement){
        
        btn.addEventListener("click", ()=>{
          props.setShowEditProjectForm(false);
        })
      }

    React.useEffect(()=>openModal(),[props.showEditProjectForm])
    

  return (
    <div style={{ flexGrow: 1 }} className="dashboard-card">
        <button id="projection-button">Projection</button>
        <div className="project-info">
          <div id="project-info-header">
            <div
              data-project-initals="initials"
              id="initialsCardElement"
              style={{
                borderRadius: "50%",
                backgroundColor: "#ca8134",
                padding: 10
              }}
            >
              {props.project?.name.slice(0,2).toUpperCase()}
            </div>
            <button id="project-info-button" onClick={()=>props.setShowEditProjectForm(!props.showEditProjectForm)}>Edit</button>
            
                
                    {/* <EditProjectInfoForm openModal={openModal} setShowEditProjectForm = {setShowEditProjectForm}/> */}
                    <dialog id="edit-project-modal" style={{zIndex:200}}>
                        <form id="edit-project-form">
                        <h2>Edit Project</h2>
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
                                id="edit-name-field-form"
                                type="text"
                                name="name"
                                placeholder="Whts the name of your project?"
                            />
                            </div>
                            <div className="form-field-container">
                            <label
                                htmlFor="description"
                                style={{ display: "flex", alignItems: "center", gap: 5 }}
                            >
                                <span className="material-symbols-outlined">summarize</span>
                                Description
                            </label>
                            {/* <textarea
                                id="update-description"
                                name="description"
                                cols={30}
                                rows={5}
                                placeholder="Add Description of projecttttttttt"
                                defaultValue={""}
                            /> */}
                            </div>
                            <div className="form-field-container">
                            <label
                                htmlFor="userRole"
                                style={{ display: "flex", alignItems: "center", gap: 5 }}
                            >
                                <span className="material-symbols-outlined">account_circle</span>
                                Role
                            </label>
                            <select id="update-role" name="userRole">
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
                            <select id="update-status" name="status">
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
                            <input id="update-dateCalendar" name="finishDate" type="date" />
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
                            id="cancel-edit-project-button"
                            type="button"
                            className="form-cancel-button"
                            //onClick={()=>onBtnClicked()}
                            onClick={()=>console.log("clicked cancel")}
                            >
                            Cancelll
                            </button>
                            <button type="submit" className="form-confirm-button">
                            Accepttttt
                            </button>
                        </div>
                        </form>
                    </dialog>
                
            
          </div>
          <div id="project-info-title">
            <h5 data-project-title="name">{props.project?.name}</h5>
            <p
              data-project-description="cardDesc"
              style={{ fontSize: "x-small" }}
            >
              {props.project?.description}
            </p>
          </div>
          <div id="project-info-description">
            <div>
              <p style={{ fontSize: "xx-small", color: "#969696" }}>Status</p>
              <div data-project-status="status" style={{ fontSize: "x-small" }}>
                {props.project?.status}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "xx-small", color: "#969696" }}>Cost</p>
              <div data-project-cost="cost" style={{ fontSize: "x-small" }}>
                ${props.project?.cost}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "xx-small", color: "#969696" }}>Role</p>
              <div data-project-role="role" style={{ fontSize: "x-small" }}>
                {props.project?.userRole}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "xx-small", color: "#969696" }}>
                Fresh Date
              </p>
              <div data-project-date="date" style={{ fontSize: "x-small" }}>
                {props.project?.finishDate.toDateString()}
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#404040",
                borderRadius: 9999,
                overflow: "auto",
                width: "100%",
                marginTop: 10
              }}
            >
              <div
                id="data-progress"
                data-project-progress="progress"
                style={{
                  width: `${props.project.progress*100}`,
                  backgroundColor: "green",
                  padding: "2px 0",
                  textAlign: "center"
                }}
              >
                {props.project?.progress}%
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ProjectDetailsInfo