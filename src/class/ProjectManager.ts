import { IProject, Project, ProjectStatus, UserRole } from "./Project";
import { IToDO, ToDo } from "./ToDo";

export class ProjectsManager{
    list: Project[] = [];
    toDo:ToDo[]=[];
    onProjectCreated = ()=>{};
    onProjectDeleted = () =>{};
    //toDoList:HTMLElement;

    constructor(){
        
        
        // const project = this.newProject({
        //     name: "Default Project",
        //     description: "This is just a default app project",
        //     status: "pending",
        //     userRole: "architect",
        //     finishDate: new Date()
        //   })
          //project.ui.click()
    }

    newProject(data: IProject, id? : string){
        
        if(data.name.length<5){
            throw new Error("Name cant be shorther than 5 characters");
        }
        var projectList = this.list.map(project=>{return project.name});
        const nameInUse = projectList.includes(data.name);
        if(nameInUse){
            throw new Error("A Project with name "+data.name+" already exist")
        }
        
        const project = new Project(data, id)
        
        
        this.list.push(project)
        this.onProjectCreated();
        return project
    }

  

    private formatDate(date : any) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

   createDefaultProject(){
    var data : IProject={
        name:"Project Name",
        description:"Project Description",
        status:"active",
        userRole:"engineer",
        finishDate: new Date()
    }
    const project = new Project(data)
    
    this.list.push(project)
   }

   getToDoItem(id:string){
    var item = this.toDo.find(note=>{return note.id==id})
    return item;
   }

   getProject(id: string){
    var project = this.list.find((project)=>{return project.id==id})
    return project
   }

   deleteProject(id:string){
        const project = this.getProject(id)
        if(!project) return;
        //project.ui.remove(); //we need to delete the html tag grom the index.html file
        var projectToFilter = this.list.filter(project=>{return project.id!=id});
        this.list = projectToFilter;
        this.onProjectDeleted();
   }

   getTotal(total ,num){
    return total+num
   }

   calculateTotalCostOfProjects(){
    var start =0;
    return this.list.reduce((init,project)=>+init+project.cost,start);
   }

   getProjectByName(name:string){
    var project = this.list.find(project=>project.name==name)
    return project;
   }

   exportToJSON(fileName : string="project", toDoFileName:string="toDo"){
        
        var json = JSON.stringify(this.list,null,2);
        var toDo = JSON.stringify(this.toDo,null,2);
        
        const blob = new Blob([json],{type:"application/json"})
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);

        const blobToDo = new Blob([toDo],{type:"application/json"})
        const urlToDo = URL.createObjectURL(blobToDo);
        const aToDo = document.createElement("a");
        aToDo.href = urlToDo;
        aToDo.download = toDoFileName;
        aToDo.click();
        URL.revokeObjectURL(urlToDo);
    }

   importFromJSON(){
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const json = reader.result as string
      if (!json) { return }
      const projects: IProject[] = JSON.parse(json as string)
      
      for (const project of projects) {
        try {
          this.newProject(project)
        } catch (error) {
            if(error == ("Error: A Project with name msn w warszawie already exist")){
                var projectToUpdate = this.getProjectByName(project.name) as Project;
                this.deleteProject(projectToUpdate.id);
                var newUpdatedProject=this.newProject(project);
                newUpdatedProject.id = projectToUpdate.id;
                continue;
            };
          
        }
      }
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) { return }
      reader.readAsText(filesList[0])
    })
    input.click()
   }

   importDescriptionFromJSON(){
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const json = reader.result as string
      if (!json) { return }
      const iToDos: IToDO[] = JSON.parse(json as string)
      
      for (var project of iToDos) {
        try {
            
          console.log("project: ",project);
          var desc = new ToDo(project);
          this.toDo.push(desc);
          //this.toDoList.append(desc.ui);
        } catch (error) {
          console.log("importFromJSON error: ",error);
        }
      }
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) { return }
      reader.readAsText(filesList[0])
    })
    input.click()
   }

   addItemToToDoList(data : IToDO){
    var toDo = new ToDo(data);
    this.toDo.push(toDo);
    //this.toDoList.append(toDo.ui);
   }

   onProjectSearch = (value : string, setter : (value: Project[])=>void)=>{
    const filteredProjects = this.list.filter((project)=>project.name.includes(value));
    setter(filteredProjects);
  }

}


