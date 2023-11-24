import { Project, IProject, ProjectStatus, UserRole } from "./class/Project"
import { ProjectsManager } from "./class/ProjectManager"
//first way of creating function in js
// function showModalAsFunction(){
//     const modal = document.getElementById("new-project-modal")
//     modal.showModal()
// }
//second way of creating function in js

const showOrHideModal = (id:string, show:boolean)=>{
    const modal = document.getElementById(id);
    if(modal && modal instanceof HTMLDialogElement){
        if(show){
            modal.showModal();
        }else{
            modal.close();
        }
    }else{
        console.warn("No Such button in web page")
    }
}



// const showModal = (id:string)=>{
//     const modal = document.getElementById(id)
//     if(modal && modal instanceof HTMLDialogElement){
//         modal.showModal()
        
//     }else{
//         console.warn("No Such button in web page")
//     }
// }

// const closeModal = (id:string)=>{
//     const modal = document.getElementById(id)
//     if(modal && modal instanceof HTMLDialogElement){
//         modal.close()
        
//     }else{
//         console.warn("No Such button in web page")
//     }
// }

const projectsListWithCard = document.getElementById("projects-list") as HTMLElement
const projectManager = new ProjectsManager(projectsListWithCard)
projectManager.createDefaultProject()
//this dovument object is provided by the browser, it helps to interact us with DOM 

const newProjectBtn= document.getElementById("new-project-button")

if (newProjectBtn) {
    newProjectBtn.addEventListener("click",()=>showOrHideModal("new-project-modal",true))
}
else{
    console.warn("New project button was not found")
}

const cancelNewProjectBtn = document.getElementById("cancel-new-project-button");
if(cancelNewProjectBtn){
    cancelNewProjectBtn.addEventListener("click", ()=>showOrHideModal("new-project-modal",false))
}else{
    console.warn("New project button was not found")
}


//project form 
const projectForm = document.getElementById("new-project-form");
if(projectForm && projectForm instanceof HTMLFormElement){
    projectForm.addEventListener("submit",(e)=>{
        e.preventDefault()
        const formData = new FormData(projectForm)
        console.log("formData", formData)
        console.log("Name: ",formData.get("description"))
        var data : IProject = {
            name:formData.get("name") as string,
            status:formData.get("status") as ProjectStatus,
            description:formData.get("description") as string,
            userRole:formData.get("userRole") as UserRole,
            finishDate:new Date(formData.get("finishDate") as string)
        }
        try{
            var project = projectManager.newProject(data);
            projectForm.reset();
            showOrHideModal("new-project-modal",false);
        }catch(err){
            console.log("error", err);
           // alert(err)
            const errorDialog = document.getElementById("error-project-modal") as HTMLDialogElement;
            errorDialog.innerHTML = `
            <div class="alert-modal">
            <button type="button" id="alertClosebtn" >&times;</button> 
            <p>${err}</p>
            </div>`
            showOrHideModal("error-project-modal",true)
            const errorCloseModalWindow = document.getElementById("alertClosebtn");
            if(errorCloseModalWindow){
                errorCloseModalWindow.addEventListener("click",()=>showOrHideModal("error-project-modal",false))
            }else{
                console.warn("error close button was not found")
            }
        }
        
    })
}else{
    console.warn("The project form was not found. check the id")
}




var downloadButton = document.getElementById("export-projects-btn");
if(downloadButton){
    downloadButton.addEventListener("click",()=>{return projectManager.exportToJSON()})
}else{
    console.warn("Cant downloaded file");
}

var uploadButton = document.getElementById("import-projects-btn");
if(uploadButton){
    uploadButton.addEventListener("click",()=>{return projectManager.importFromJSON()})
}else{
    console.warn("cant import file");
}

var sideBarProjectListButton = document.getElementById("projectsList-button");
if(sideBarProjectListButton){
    sideBarProjectListButton.addEventListener("click", ()=>{
        var projectdetailsPage = document.getElementById("project-details") as HTMLElement;
        projectdetailsPage.style.display = "none";
        var projectListPage = document.getElementById("projects-page") as HTMLElement;
        projectListPage.style.display = "flex";
    })
}else{
    console.warn("cant find the button")
}