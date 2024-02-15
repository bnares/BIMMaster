import { Project, IProject, ProjectStatus, UserRole } from "./class/Project"
import { ProjectsManager } from "./class/ProjectManager"
import { IToDO, ToDo, ToDoStatus } from "./class/ToDo";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import * as OBC from "openbim-components";
import { FragmentsGroup } from "bim-fragment";
import { TodoCreator } from "./bim-components/TodoCreator";
import { SimpleQTO } from "./bim-components/SimpleQTO";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Sidebar } from "./react-components/Sidebar";
import ProjectsPage from "./react-components/ProjectsPage";
import ProjectDetailsPage from "./react-components/ProjectDetailsPage";
import * as Router from "react-router-dom";
import { ViewerProvider } from "./react-components/IFCViewer";

const projectManager = new ProjectsManager();

const rootElement = document.getElementById("app") as HTMLDivElement;
const appRoot = ReactDOM.createRoot(rootElement);

appRoot.render(
    <>
        <Router.BrowserRouter>
            
            <ViewerProvider>
                <Sidebar />
                <Router.Routes>
                    <Router.Route path="/" element={<ProjectsPage projectManager={projectManager} />}></Router.Route>
                    <Router.Route path="/project/:id" element={<ProjectDetailsPage projectManager={projectManager}/>}></Router.Route>
                </Router.Routes>
            </ViewerProvider>
            
        </Router.BrowserRouter>
    </>
)

// const showOrHideModal = (id:string, show:boolean)=>{
//     const modal = document.getElementById(id);
//     if(modal && modal instanceof HTMLDialogElement){
//         if(show){
//             modal.showModal();
//         }else{
//             modal.close();
//         }
//     }else{
//         console.warn("No Such button in web page")
//     }
// }

// const projectsListWithCard = document.getElementById("projects-list") as HTMLElement
// const projectToDoList = document.getElementById("to-do-list") as HTMLElement;
// const projectManager = new ProjectsManager();
// //projectManager.createDefaultProject()
// //this dovument object is provided by the browser, it helps to interact us with DOM 

// const newProjectBtn= document.getElementById("new-project-button")

// if (newProjectBtn) {
//     getDate()
//     newProjectBtn.addEventListener("click",()=>showOrHideModal("new-project-modal",true))
// }
// else{
//     console.warn("New project button was not found")
// }

// const cancelNewProjectBtn = document.getElementById("cancel-new-project-button");
// if(cancelNewProjectBtn){
//     cancelNewProjectBtn.addEventListener("click", ()=>showOrHideModal("new-project-modal",false))
// }else{
//     console.warn("New project button was not found")
// }


// //project form 
// const projectForm = document.getElementById("new-project-form");
// if(projectForm && projectForm instanceof HTMLFormElement){
//     projectForm.addEventListener("submit",(e)=>{
//         e.preventDefault()
//         const formData = new FormData(projectForm)
//         var data : IProject = {
//             name:formData.get("name") as string,
//             status:formData.get("status") as ProjectStatus,
//             description:formData.get("description") as string,
//             userRole:formData.get("userRole") as UserRole,
//             finishDate:new Date(formData.get("finishDate") as string)
//         }
//         try{
//             var project = projectManager.newProject(data);
//             projectForm.reset();
//             showOrHideModal("new-project-modal",false);
//         }catch(err){
//             console.log("error", err);
//            // alert(err)
//             const errorDialog = document.getElementById("error-project-modal") as HTMLDialogElement;
//             errorDialog.innerHTML = `
//             <div class="alert-modal">
//             <button type="button" id="alertClosebtn" >&times;</button> 
//             <p>${err}</p>
//             </div>`
//             showOrHideModal("error-project-modal",true)
//             const errorCloseModalWindow = document.getElementById("alertClosebtn");
//             if(errorCloseModalWindow){
//                 errorCloseModalWindow.addEventListener("click",()=>showOrHideModal("error-project-modal",false))
//             }else{
//                 console.warn("error close button was not found")
//             }
//         }
        
//     })
// }else{
//     console.warn("The project form was not found. check the id")
// }

// function getDate(){
//     var today = new Date();
//     var calendar = document.getElementById("dateCalendar") as HTMLInputElement
//     calendar.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
// }


// var downloadButton = document.getElementById("export-projects-btn");
// if(downloadButton){
//     downloadButton.addEventListener("click",()=>{return projectManager.exportToJSON()})
// }else{
//     console.warn("Cant downloaded file");
// }

// var uploadButton = document.getElementById("import-projects-btn");
// if(uploadButton){
//     uploadButton.addEventListener("click",()=>{return projectManager.importFromJSON()})
// }else{
//     console.warn("cant import file");
// }

// var importDescription = document.getElementById("import-description-btn");
// if(importDescription){
//     importDescription.addEventListener("click",()=>{
//         return projectManager.importDescriptionFromJSON();
//     })
// }

// var sideBarProjectListButton = document.getElementById("projectsList-button");
// if(sideBarProjectListButton){
//     sideBarProjectListButton.addEventListener("click", ()=>{
//         var projectdetailsPage = document.getElementById("project-details") as HTMLElement;
//         projectdetailsPage.style.display = "none";
//         var projectListPage = document.getElementById("projects-page") as HTMLElement;
//         projectListPage.style.display = "flex";
//     })
// }else{
//     console.warn("cant find the button")
// }

// var editProjectInfo = document.getElementById("project-info-button");
// if(editProjectInfo){
    
//     editProjectInfo.addEventListener("click",()=>{
//         updateProjectCard();
//     });
// }else{
//     console.warn("noSuch button");
// }


// var updateProjectCard = ()=>{
//     //projectManager.updateProject();
//     const detailsPage  = document.getElementById("edit-project-modal") as HTMLElement;
//     if(!detailsPage) {
//         console.warn("No sych element to edit");
//         return
//     };
//     const inputElement = document.getElementById("secretIdProjectField") as HTMLInputElement;
//     const id = inputElement.value;
    
//     var project = projectManager.getProject(id) as Project;
//     const formUpdate= document.getElementById("edit-project-form");
//     var inputField = document.getElementById("edit-name-field-form") as HTMLInputElement;
//     inputField.value = project.name;
//     var updateDescription = document.getElementById("update-description") as HTMLTextAreaElement;
//     if(!updateDescription) return;
//     updateDescription.value = project.description;
//     var updateRole = document.getElementById("update-role") as HTMLSelectElement;
//     if(!updateRole) return;
//     updateRole.value = project.userRole;
//     var updateStaus = document.getElementById("update-status") as HTMLSelectElement;
//     if(!updateStaus) return;
//     updateStaus.value = project.status;
//     var updateCalendar = document.getElementById("update-dateCalendar") as HTMLInputElement;
//     if(!updateCalendar) return;
//     var dayToUpdate = new Date(project.finishDate);
//     var updateDate = dayToUpdate.getFullYear()+"-"+(dayToUpdate.getMonth()+1)+"-"+dayToUpdate.getDate();
//     updateCalendar.value = updateDate.toString();
//     showOrHideModal("edit-project-modal",true);
// }

// const formUpdate= document.getElementById("edit-project-form");
// if(formUpdate && formUpdate instanceof HTMLFormElement){
//     formUpdate.addEventListener("submit", (e)=>{
//         e.preventDefault();
//         const inputElement = document.getElementById("secretIdProjectField") as HTMLInputElement;
//         const id = inputElement.value;
//         const formData = new FormData(formUpdate);
       
        
//         var project = projectManager.getProject(id) as Project;
//         project.name = formData.get("name") as string;
//         project.description = formData.get("description") as string;
//         project.status = formData.get("status") as ProjectStatus;
//         project.userRole = formData.get("userRole") as UserRole;
//         project.finishDate = new Date(formData.get("finishDate") as string)
//         project.ui.innerHTML = `
//         <div class="card-header">
//             <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1;">${project.name.slice(0,2).toUpperCase()}</p>
//             <div>
//                 <h5>${project.name}</h5>
//                 <p>${project.description}</p>
//             </div>
//             </div>
//             <div class="card-content">
//             <div class="card-property">
//                 <p style="color: #969696">Status</p>
//                 <p>${project.status}</p>
//             </div>
//             <div class="card-property">
//                 <p style="color: #969696">Role</p>
//                 <p>${project.userRole}</p>
//             </div>
//             <div class="card-property">
//                 <p style="color: #969696">Cost</p>
//                 <p>$${project.cost}</p>
//             </div>
//             <div class="card-property">
//                 <p style="color: #969696">Estimated Progress</p>
//                 <p>${project.progress*100}</p>
//             </div>
//         </div>
//         `
//         projectManager.setDetailPage(project);
//         showOrHideModal("edit-project-modal",false);
//     })
// }

// var editformCancelBtn = document.getElementById("cancel-edit-project-button") as HTMLButtonElement;
// if(editformCancelBtn){
//     editformCancelBtn.addEventListener("click",()=>{
//         showOrHideModal("edit-project-modal",false);
//     })
// }

// var addItemCancelButton = document.getElementById("cancel-toDo-button") as HTMLButtonElement;
// if(addItemCancelButton){
//     addItemCancelButton.addEventListener("click",()=>{
//         showOrHideModal("add-toDo-dialog",false);
//     })
// }

// var addItemToDoList = document.getElementById("toDo-add") as HTMLElement;
// if(addItemToDoList){
//     addItemToDoList.addEventListener("click",()=>{
//         showOrHideModal("add-toDo-dialog",true);
//     })
// }

// var addToDoForm = document.getElementById("add-toDo-form") as HTMLFormElement
// if(addToDoForm){
//     addToDoForm.addEventListener("submit",(e)=>{
//         e.preventDefault();
//         try{
//             const inputElement = document.getElementById("secretIdProjectField") as HTMLInputElement;
//             const projectId = inputElement.value;
//             var formData = new FormData(addToDoForm);
//             var iToDo : IToDO = {
//             description: formData.get("description") as string,
//             status: formData.get("status") as ToDoStatus,
//             date: new Date(formData.get("finishDate") as string),
//             projectId: projectId as string
//         }
//         projectManager.addItemToToDoList(iToDo);
//         showOrHideModal("add-toDo-dialog",false);
//         addToDoForm.reset();
//         }catch(e){
//             console.warn(e);
//         }

//     })
// }


// const submitUpdateStatusBtn = document.getElementById("update-toDo-status-form") as HTMLFormElement;
// if(submitUpdateStatusBtn){
//     submitUpdateStatusBtn.addEventListener("submit", (e)=>{
//         e.preventDefault();
        
//         var hiddenToDoItemDivWithId = document.getElementById("toDo-text-id-value") as HTMLElement;
//         var toDoListUpdateStatusForm = document.getElementById("update-toDo-status-form");
//         if(toDoListUpdateStatusForm && toDoListUpdateStatusForm instanceof HTMLFormElement){
//             try{
//                 var valueId = hiddenToDoItemDivWithId.innerText;
//                 var toDoItem = projectManager.getToDoItem(valueId) as ToDo;
//                 var formData = new FormData(toDoListUpdateStatusForm);
//                 var newStatus = formData.get("status") as ToDoStatus;
//                 toDoItem.status = newStatus;
//                 toDoItem.ui.className = `to-do-settings ${toDoItem.status =="Active" ? "toDoActive" : (toDoItem.status =="Pending" ? "toDoPending" : "toDoFinished")}`;
//                 showOrHideModal("update-toDo-dialog",false);

//             }catch(e){
//                 console.warn(e)
//             }
//         }
//     })
    
// }

// const cancleUpdateStatusBtn = document.getElementById("cancel-update-status-button") as HTMLButtonElement;
// if(cancleUpdateStatusBtn){
//     cancleUpdateStatusBtn.addEventListener("click",()=>{
//         showOrHideModal("update-toDo-dialog",false);
//     })
// }

// //ThreeJS viewer

// // const boxGeometry = new THREE.BoxGeometry();
// // const material = new THREE.MeshStandardMaterial({color:"#6528D7"});
// // const cube = new THREE.Mesh(boxGeometry, material);
// // cube.position.set(0,2,0);


// const viewer = new OBC.Components();
// const sceneComponent = new OBC.SimpleScene(viewer); //defines where our object will live in 3D
// viewer.scene =sceneComponent;
// const scene = sceneComponent.get();
// scene.background = null;
// sceneComponent.setup();
// const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement;
// const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer); //allows us to see things moving around
// viewer.renderer = rendererComponent;

// const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer); //defines where we are in 3D world
// viewer.camera = cameraComponent;
// cameraComponent.controls.setLookAt(10,10,10,0,0,0);
// const grid = new OBC.SimpleGrid(viewer);

// const raycasterComponent = new OBC.SimpleRaycaster(viewer); //this has to be added before the viewer.init() and after the render is set -rendererComponent
// viewer.raycaster = raycasterComponent;

// viewer.init();
// cameraComponent.updateAspect();
// rendererComponent.postproduction.enabled = true;
// // scene.add(cube);
// // viewer.meshes.push(cube);

// const fragmentManager = new OBC.FragmentManager(viewer); //fragment manager must be after viewer.init() and before ifcLoader

// function exportFramgments(model : FragmentsGroup){
    
//     const fragmentsBinary = fragmentManager.export(model)    
//     const blob = new Blob([fragmentsBinary])
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${model.name.replace(".ifc","")}.frag`;
//     a.click();
//     URL.revokeObjectURL(url);
// }

// const ifcLoader = new OBC.FragmentIfcLoader(viewer); //it goes with FragmentHighlighter some internal libraries
// ifcLoader.settings.wasm = {
//     path: "https://unpkg.com/web-ifc@0.0.44/",
//     absolute: true
// }

// const highlighter = new OBC.FragmentHighlighter(viewer); //to select elements by mouse
// highlighter.setup();

// const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer); // data to create window with properties
// highlighter.events.select.onClear.add(()=>{
//     propertiesProcessor.cleanPropertiesList(); //to delete all data from window with properties after we stop selecting element
// })


// const classiifier  = new OBC.FragmentClassifier(viewer);
// const classificationWindow = new OBC.FloatingWindow(viewer);
// classificationWindow.visible = false;
// viewer.ui.add(classificationWindow);
// classificationWindow.title = "Model Groups"

// const classificationsBtn = new OBC.Button(viewer);
// classificationsBtn.materialIcon = "account_tree";

// classificationsBtn.onClick.add(()=>{
//     classificationWindow.visible = !classificationWindow.visible;
//     classificationsBtn.active = classificationsBtn.visible;
// })

// async function createModelTree(){
//     const fragmentTree = new OBC.FragmentTree(viewer); //creats ui representeting on the groups based on the classifier
//     await fragmentTree.init()
//     fragmentTree.update([])
//     await fragmentTree.update(["model","storeys","entities"])
//     fragmentTree.onHovered.add((fragmentMap)=>{
//         highlighter.highlightByID("hover", fragmentMap);
//     })
//     fragmentTree.onSelected.add((fragmentMap)=>{
//         highlighter.highlightByID("select",fragmentMap);
//     })
//     const tree = fragmentTree.get().uiElement.get("tree")
//     return tree;
// }

// const culler = new OBC.ScreenCuller(viewer); //creating a procces to not display elements which are not in our camera 
// cameraComponent.controls.addEventListener("sleep",()=>{ //when camera stops ('sleep' event) we tel the cooler it needs to be updated
//     culler.needsUpdate = true;
// })

// async function onModelLoaded(model : FragmentsGroup){
//     try{
        
//         highlighter.update(); //to tel higlighter taaht new model was loaded
//         classiifier.byModel(model.id.toString(),model);
//         classiifier.byStorey(model)
//         classiifier.byEntity(model)
//         const tree = await createModelTree();
//         await classificationWindow.slots.content.dispose(true)
//         classificationWindow.addChild(tree)
//         propertiesProcessor.process(model)
//         highlighter.events.select.onHighlight.add((fragmentMap)=>{
//             const expressId = [...Object.values(fragmentMap)[0]][0]
//             propertiesProcessor.renderProperties(model,Number(expressId))
//         })
//         for(const fragment of model.items){
//             culler.add(fragment.mesh);
//         }
//         culler.needsUpdate = true;
//     }catch(e){
        
//         console.warn("Error from onModelLoaded function: ",e);
//         alert(e);
//     }
    
// }

// function ExportModelProperties(model: FragmentsGroup, fileName:string="fragmentProperties"){
//     var prop = {...model.properties};
//     var json = JSON.stringify(prop,null,2);
//     const blob = new Blob([json],{type:"application/json"});
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = fileName;
//     a.click();
//     URL.revokeObjectURL(url);
// }

// function ImportModelProperties(model : FragmentsGroup){
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "application/json";
//     const reader = new FileReader();
//     var projects={};
//     reader.addEventListener("load",async ()=>{
//         const json = reader.result as string;
//         if(!json)return;
//         projects = JSON.parse(json);
//         console.log("projects Object: ",projects);
//         model.properties = projects;
//         await onModelLoaded(model);
//     })
//     input.addEventListener('change', () => {
//         const filesList = input.files
//         if (!filesList) { return }
//         reader.readAsText(filesList[0])
//     })
//     input.click();
// }


// ifcLoader.onIfcLoaded.add(async (model)=>{
//     exportFramgments(model);
//     ExportModelProperties(model);
//     onModelLoaded(model);
// })

// fragmentManager.onFragmentsLoaded.add((model)=>{
//     ImportModelProperties(model);
// })

// const importFragmentButn = new OBC.Button(viewer);
// importFragmentButn.materialIcon = "upload";
// importFragmentButn.tooltip = "Load FRAG";
// importFragmentButn.onClick.add( ()=>{
//     const input = document.createElement('input')
//     input.type = 'file'
//     input.accept = '.frag'
//     const reader = new FileReader()
//     reader.addEventListener("load", async () => {
//       const binary = reader.result
//       if (!(binary instanceof ArrayBuffer)) { return }
//       const fragmentBinary = new Uint8Array(binary);
//       await fragmentManager.load(fragmentBinary)
      
//     })
//     input.addEventListener('change', () => {
//       const filesList = input.files
//       if (!filesList) { return }
//       reader.readAsArrayBuffer(filesList[0])
//     })
//     input.click()
// })


// ifcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
// ifcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

// const todoCreator = new TodoCreator(viewer);
// await todoCreator.setup();
// todoCreator.onProjectCreated.add((todo)=>{ //onProjectCreated is an event from ToDoCreator class argument todo was passed in this class there by <ToDo> signature
//     console.log("todo Event: ",todo);
// })

// const simpleQto = new SimpleQTO(viewer);
// await simpleQto.setup();

// const propsFinder = new OBC.IfcPropertiesFinder(viewer);
// await propsFinder.init();
// propsFinder.onFound.add((fragmentIdMap)=>{
//     highlighter.highlightByID("select",fragmentIdMap)
// })

// const toolbar = new OBC.Toolbar(viewer);

// toolbar.addChild(
//     ifcLoader.uiElement.get("main"),
//     classificationsBtn,
//     propertiesProcessor.uiElement.get("main"),
//     importFragmentButn,
//     //importDataFromFragment,
//     fragmentManager.uiElement.get("main"),
//     todoCreator.uiElement.get("activationButton"),
//     simpleQto.uiElement.get("activationButton"),
//     propsFinder.uiElement.get("main"),
// )
// viewer.ui.addToolbar(toolbar);



