import {v4 as uuidv4} from 'uuid'
import { ToDo } from './ToDo'
export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject{
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate : Date
}

export class Project implements IProject{
    //To satisfy IProject
    name : string
    description : string
    status : "pending" | "active" | "finished"
    userRole : "architect" | "engineer" | "developer"
    finishDate : Date
    //class internal
   
    cost: number = 0
    progress: number = 0
    id:string
    

    constructor(data : IProject, id= uuidv4()){
        this.name = data.name
        this.description = data.description
        this.status = data.status
        this.userRole = data.userRole
        this.finishDate = data.finishDate
        // for(const key in data){
        //     this[key] = data[key]
        //     console.log("object: ",this[key])
        // }
        this.id = id;
        
        
    }

    
}
