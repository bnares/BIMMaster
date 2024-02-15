import React from 'react'
import * as Router from "react-router-dom";
import { ProjectsManager } from '../class/ProjectManager';
import ProjectDetailsInfo from './ProjectDetailsInfo';
import ToDoList from './ToDoList';
import {IFCViewer} from './IFCViewer';

interface Props{
    projectManager : ProjectsManager
}

function ProjectDetailsPage(props: Props) {
    const routeParams = Router.useParams<{id: string}>();
    const [showEditProjectForm, setShowEditProjectForm] = React.useState(false);
    const [showToDoForm, setShowToDoForm] = React.useState(false);

    //const idNUmber = id as string;
    if(!routeParams.id) return (<p>Project Id is neded to see the page</p>)
    //console.log("in projectDetail page: ",routeParams.id);
    const project = props.projectManager.getProject(routeParams.id);
    if(!project) return(<p>Project with id {routeParams.id} cant be found</p>)
  return (
    <div className="page" id="project-details">
  
  <dialog id="add-toDo-dialog">
    <form id="add-toDo-form">
      <h2>ToDo Add</h2>
      <div className="input-list">
        <div className="form-field-container">
          <label
            htmlFor="description"
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span className="material-symbols-outlined">summarize</span>
            Description
          </label>
          <textarea
            id="toDo-description"
            name="description"
            cols={30}
            rows={5}
            maxLength={30}
            placeholder="Add Description"
            defaultValue={""}
          />
        </div>
        <div className="form-field-container">
          <label
            htmlFor="status"
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span className="material-symbols-outlined">help</span>
            Status
          </label>
          <select id="toDo-status" name="status">
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
          <input id="toDo-dateCalendar" name="finishDate" type="date" />
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
          id="cancel-toDo-button"
          type="button"
          className="form-cancel-button"
        >
          Cancel
        </button>
        <button type="submit" className="form-confirm-button">
          Accept
        </button>
      </div>
    </form>
  </dialog>
  <dialog id="update-toDo-dialog">
    <form id="update-toDo-status-form">
      <h2>Update Status</h2>
      <div style={{ display: "none" }} id="toDo-text-id-value" />
      <div className="update-status-toDo">
        <div style={{ padding: 10 }} className="form-field-container">
          <label
            htmlFor="status"
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span className="material-symbols-outlined">help</span>
            Status
          </label>
          <select id="toDo-status" name="status">
            <option>Pending</option>
            <option>Active</option>
            <option>Finished</option>
          </select>
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
          id="cancel-update-status-button"
          type="button"
          className="form-cancel-button"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="submit-update-status-button"
          className="form-confirm-button"
        >
          Accept
        </button>
      </div>
    </form>
  </dialog>
  <header>
    <input data-project-id="id" id="secretIdProjectField" type="hidden" />
    <div>
      <h2 data-project-info="name">{project?.name.toUpperCase()}</h2>
      <p data-project-description="desc" style={{ color: "#969696" }}>
        {project?.description}
      </p>
    </div>
  </header>
  <div className="main-page-content">
    <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
      {<ProjectDetailsInfo project={project} setShowEditProjectForm={setShowEditProjectForm} showEditProjectForm={showEditProjectForm}/>}
      {<ToDoList  showToDoForm = {showToDoForm} setShowToDoForm = {setShowToDoForm}/>}
    </div>
    <IFCViewer />
  </div>
</div>

  )
}

export default ProjectDetailsPage