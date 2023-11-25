import { IProject, Project } from "./Project";

export class ProjectsManager{
    list: Project[] = []
    ui:HTMLElement

    constructor(container: HTMLElement){
        this.ui = container
    }

    newProject(data: IProject){
        var projectList = this.list.map(project=>{return project.name});
        const nameInUse = projectList.includes(data.name);
        if(nameInUse){
            throw new Error("A Project with name "+data.name+" already exist")
        }
        const project = new Project(data)
        project.ui.addEventListener("click", ()=>{
            const projectPage = document.getElementById("projects-page");
            const projectdetails = document.getElementById("project-details");
            if(projectPage==null || projectdetails==null) return;
            projectPage.style.display = "none";
            projectdetails.style.display= "flex"
            this.setDetailPage(project);
        })
        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }

    private setDetailPage(project : Project){
        const detailsPage = document.getElementById("project-details");
        if(!detailsPage) return;
        const name = detailsPage.querySelector("[data-project-info='name']");
        if(name) name.textContent = project.name;
        const desc = detailsPage.querySelector("[data-project-description='desc']");
        if(desc) desc.textContent = project.description;
        const title = detailsPage.querySelector("[data-project-title='name']");
        if(title) title.textContent = project.name;
        const cardDesc = detailsPage.querySelector("[data-project-description='cardDesc']");
        if(cardDesc) cardDesc.textContent = project.description;
        const status = detailsPage.querySelector("[data-project-status='status']");
        if(status) status.textContent = project.status;
        const cost = detailsPage.querySelector("[data-project-cost='cost']");
        if(cost) cost.textContent = "$"+project.cost;
        const role = detailsPage.querySelector("[data-project-role='role']");
        if(role) role.textContent=project.userRole;
        const date = detailsPage.querySelector("[data-project-date='date']");
        if(date) date.textContent = this.formatDate(project.finishDate);
        const progress = detailsPage.querySelector("[data-project-progress='progress']");
        if(progress) {
            progress.textContent = project.progress.toString()+"%";
            const progressElement = document.getElementById("data-progress") as HTMLElement;
            if(progressElement) progressElement.style.width = ` ${project.progress.toString()}%`;

        }

    }

    private formatDate(date) {
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
    this.ui.append(project.ui)
    this.list.push(project)
   }

   getProject(id: string){
    var project = this.list.find((project)=>{return project.id==id})
    return project
   }

   deleteProject(id:string){
        const project = this.getProject(id)
        if(!project) return;
        project.ui.remove(); //we need to delete the html tag grom the index.html file
        var projectToFilter = this.list.filter(project=>{return project.id!=id});
        this.list = projectToFilter;
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

   exportToJSON(fileName : string="project"){
        var json = JSON.stringify(this.list,null,2);
        const blob = new Blob([json],{type:"application/json"})
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

   importFromJSON(){
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const json = reader.result
      if (!json) { return }
      const projects: IProject[] = JSON.parse(json as string)
      for (const project of projects) {
        try {
          this.newProject(project)
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
}