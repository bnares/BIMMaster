import * as OBC from "openbim-components";
import { TodoCard } from "./src/TodoCard";
import * as THREE from "three";

type ToDoPriority = "Low" | "Medium" | "High";

export interface ToDo{
    description: string,
    date: Date,
    fragmentMap: OBC.FragmentIdMap, //Fragment map is jus an object where the keys are the fragment IDs and the values are the set of expressIDs contained in that specific fragment
    camera: {position: THREE.Vector3, target:THREE.Vector3}, //getting a reference to the camera;
    priority : ToDoPriority
}

export class TodoCreator extends OBC.Component<ToDo[]> implements OBC.UI, OBC.Disposable{ //all components must exted from ONC.Component class, if we want that item must have an interface we must implement from OBC.UI
    static uuid = "626f6853-0fe9-4d4f-a18f-a790b7274d0c";
    onProjectCreated = new OBC.Event<ToDo>(); //by <ToDo> we let pass a reference to ToDo that was created. we leet the engine know that we may pass some callbacks here using event. this can be seen in addToDo method on the last line => this.onProjectCreated.trigger(todo);
    enabled: boolean = true;
    uiElement= new OBC.UIElement<{
        activationButton: OBC.Button,
        todoList: OBC.FloatingWindow
    }>;
    private _components: OBC.Components;
    private _list: ToDo[] = [];

    constructor(components: OBC.Components){
        super(components);
        this._components = components;
        components.tools.add(TodoCreator.uuid,this); 
        this.setUI();
    }

    async dispose(){
        this.uiElement.dispose();
        this._list = [];
        this.enabled = false;
    }

    async setup(){
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter);
        highlighter.add(`${TodoCreator.uuid}-priority-Low`,[new THREE.MeshStandardMaterial({color:0x59bc59})]) //creating own colors for elements in the viewer with Low priority
        highlighter.add(`${TodoCreator.uuid}-priority-Normal`,[new THREE.MeshStandardMaterial({color:0x597cff})]);
        highlighter.add(`${TodoCreator.uuid}-priority-High`,[new THREE.MeshStandardMaterial({color:0xff7676})]);
    }

    async addToDo(description: string, priority : ToDoPriority){
        if(!this.enabled) return;
        const camera = this._components.camera;
        if(!(camera instanceof OBC.OrthoPerspectiveCamera)){
            throw new Error("ToDoCreator needs the OrthoPerspectiveCamera in order to work")
        }
        
        const position = new THREE.Vector3();
        camera.controls.getPosition(position);
        const target = new THREE.Vector3();
        camera.controls.getTarget(target);
        const todoCamera = {position, target};

        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter); //OBC.FragmentHiglighter is just to tell tools what kind of component must found in tools list. if not found create

        const todo: ToDo = {
            description:description,
            date: new Date(),
            fragmentMap: highlighter.selection.select, //to get fragment map of element which is currently selected by the user
            //anything related to store a reference to model elements need to be done using fragment map
            camera: todoCamera,
            priority
        }

        this._list.push(todo);
        console.log("toDo: ",todo);

        const todoCard = new TodoCard(this._components); //creating own class for UI of toDo card
        todoCard.description = todo.description; //by using setter in TodoCard class we set this property 
        todoCard.date = todo.date;

        todoCard.onCardClick.add(()=>{
            const fragmentMapLength = Object.keys(todo.fragmentMap).length;
            if(fragmentMapLength==0){return} //if we dont select anything in the model and create a note. this note wont have reference to element it describes and if we click error will be display. thanls to this no error will be shown

            highlighter.highlightByID("select", todo.fragmentMap);
            camera.controls.setLookAt(
                todo.camera.position.x,
                todo.camera.position.y,
                todo.camera.position.z,
                todo.camera.target.x,
                todo.camera.target.y,
                todo.camera.target.z,
                true
            )
        })

        todoCard.onDeleteButtonClick.add(()=>{
            var itemToDelete = this._list.find(x=>x.camera.position == todo.camera.position && x.camera.target == todo.camera.target && x.description.toString()==todo.description.toString());
            var data = this._list.filter(x=>x!=itemToDelete);
            const fragmentMapLength = Object.keys(todo.fragmentMap).length;
            if(fragmentMapLength==0){return} //if we dont select anything in the model and create a note. this note wont have reference to element it describes and if we click error will be display. thanls to this no error will be shown
            this._list = data;
            todoList.removeChild(todoCard);
            todoCard.dispose();
        })

        const todoList = this.uiElement.get("todoList"); //get the floating window with all toDos from constructor of this class
        todoList.addChild(todoCard); //adding new toDoCard description to the floating window
        this.onProjectCreated.trigger(todo);
        
    }

    private async setUI(){
        const activationButton = new OBC.Button(this._components);
        activationButton.materialIcon = "construction" //construction
        activationButton.tooltip = "ToDo Settings"

        const newToDoBtn = new OBC.Button(this._components,{name:"Create"});
        activationButton.addChild(newToDoBtn);

        const form = new OBC.Modal(this._components);
        this._components.ui.add(form);
        form.title = "Create New ToDo"

        const descriptionInput = new OBC.TextArea(this._components);
        descriptionInput.label = "Description";
        form.slots.content.addChild(descriptionInput); //slots are the UI components inside other UIcomponents. content are some internal feture if we deal with FORMS

        const priorityDropdown = new OBC.Dropdown(this._components);
        priorityDropdown.label = "Priority";
        priorityDropdown.addOption("Low","Normal","High");
        priorityDropdown.value="Normal";
        form.slots.content.addChild(priorityDropdown);

        form.slots.content.get().style.padding = "20px";
        form.slots.content.get().style.display = "flex";
        form.slots.content.get().style.flexDirection = "column";
        form.slots.content.get().style.rowGap = "20px";

        form.onAccept.add(async ()=>{
            await this.addToDo( descriptionInput.value, priorityDropdown.value as ToDoPriority);
            descriptionInput.value = "";
            form.visible = false;
        })

        form.onCancel.add(()=>{
            form.visible =  false;
        })
        newToDoBtn.onClick.add(()=>{
            form.visible = true;
        })

        const todoList = new OBC.FloatingWindow(this._components);
        this._components.ui.add(todoList);
        todoList.visible = false;
        todoList.title = "ToDo List"

        const todoListToolbar = new OBC.SimpleUIComponent(this._components); //creating UI component for colorizing element based on priority
        todoList.addChild(todoListToolbar); 

        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter);
        const colorizeBtn = new OBC.Button(this._components);
        colorizeBtn.materialIcon = "format_color_fill";
        todoListToolbar.addChild(colorizeBtn); //we add this buttn to be display in UI todoListToolbar

        colorizeBtn.onClick.add(()=>{
            colorizeBtn.active = !colorizeBtn.active;
            if(colorizeBtn.active){
                for(const todo of this._list){
                    const fragmentMapLength = Object.keys(todo.fragmentMap).length;
                    if(fragmentMapLength==0) return;
                    highlighter.highlightByID(`${TodoCreator.uuid}-priority-${todo.priority}`, todo.fragmentMap)
                }
            }else{
                highlighter.clear(`${TodoCreator.uuid}-priority-Low`);
                highlighter.clear(`${TodoCreator.uuid}-priority-Normal`);
                highlighter.clear(`${TodoCreator.uuid}-priority-High`);
            }
        })

        this.uiElement.set({activationButton, todoList}) //adding demanding html to uiElement

        const todoListBtn = new OBC.Button(this._components,{name:"List"});
        activationButton.addChild(todoListBtn);
        todoListBtn.onClick.add(()=>{
            todoList.visible = !todoList.visible;
        })
    }
    
    get(): ToDo[] { //this method has to return aht we specify in class generic type
        return this._list;
    }

}