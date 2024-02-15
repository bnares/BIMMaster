import {v4 as uuidv4} from 'uuid'

export type ToDoStatus="Pending" | "Active" | "Finished";
export interface IToDO{
    description:string,
    status:ToDoStatus,
    date:Date,
    projectId: string
}
export class ToDo implements IToDO{
    description: string;
    status: ToDoStatus;
    date: Date;
    projectId: string;
    id:string;
    ui: HTMLDivElement;

    constructor(data:IToDO){
        this.description = data.description;
        this.date = new Date(data.date);
        this.status = data.status;
        this.projectId = data.projectId
        this.id = uuidv4();
        this.setUI();
        this.setListener();
    }

    setListener(){
        this.ui.addEventListener("click",()=>{
            const updateStatusDialog = document.getElementById(`${this.id}`);
            
            if(updateStatusDialog){
                var htmlElement =document.getElementById("toDo-text-id-value") as HTMLElement;
                if(htmlElement){
                    htmlElement.textContent = this.id;
                }
                
                var htmlToFindDivWithId = updateStatusDialog.querySelector("[data-toDo-id='id']");
                if(htmlToFindDivWithId){
                    var id = htmlToFindDivWithId.textContent;
                    this.showOrHideModal("update-toDo-dialog",true);
                    
                }
                
            }
        })
    }

    setUI(){
        //console.log("status: ",this.status);
        if(this.ui) return;
        this.ui = document.createElement("div");
        this.ui.className = `to-do-settings ${this.status =="Active" ? "toDoActive" : (this.status =="Pending" ? "toDoPending" : "toDoFinished")}`;
        this.ui.id = this.id;
        this.ui.innerHTML = `
        <div style="display:none;" data-toDo-id="id">${this.id}</div>
        <div style="background-color: #969696; padding: 5px; border-radius: 4px;">
            <span class="material-symbols-outlined">
                construction
            </span>
        </div>
        <div style="display: flex;width:100%;  justify-content: space-between; align-items: center; padding: 5px; cursor: pointer;">
            <p style="font-size:x-small; flex-grow: 2;">${this.description}</p>
            <p style="font-size:xx-small; flex-grow: 1;">${this.date.getFullYear()}-${this.date.getMonth()+1}-${this.date.getDate()}</p>
        </div>
        `
    }

    private showOrHideModal = (id:string, show:boolean)=>{
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

}