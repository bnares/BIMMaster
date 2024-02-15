import * as OBC from "openbim-components"
import { ToDo } from ".."

export class TodoCard  extends OBC.SimpleUIComponent //all UI components shoud be extending from SimpleUIComponent
{
    onCardClick = new OBC.Event(); //event triggered from the outside of this class when the card will be clisked
    onDeleteButtonClick = new OBC.Event();
    slots: { actionButtons: OBC.SimpleUIComponent<HTMLElement>; }; //the name of the property must be slot if we want to cooperate with the div from template variable below with name data-tooeen-slot="actionButtons" 
    
    set description(value : string){
        //var desc = document.getElementById("description");
        const descriptionElement = this.getInnerElement("description") as HTMLParagraphElement
        descriptionElement.textContent = value
    }

    set date(value : Date){
        const dateElement = this.getInnerElement("date") as HTMLParagraphElement;
        dateElement.textContent = value.toDateString();
    }

    constructor(components : OBC.Components){
        const template = `
        <div class="todo-item">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; column-gap: 15px; align-items: center;">
                    <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">
                        <span class="material-symbols-outlined">
                            construction
                        </span>
                    </span>
                    <div>
                    <p id="date" style="text-wrap: nowrap; color: #a9a9a9; font-size: var(--font-sm)">Fri, 20 sep</p>
                    <p id="description">Make anything here as you want, even something longer.</p>
                    </div>
                </div>
                <div data-tooeen-slot="actionButtons"> 
                    data-tooeen-slot we tell the openBim engine that this is a slot with name actionButtons
                </div>

            </div>
        </div>
        `
        super(components, template);
        const cardElement = this.get(); // get tge main html content of this class => in this example all template varialbe
        cardElement.addEventListener("click",()=>{
            this.onCardClick.trigger() //this trigger method is responsible of executing the functions you pass as callbacks to the event
            //onCardClick is an event set in the properties up in this class. trigger starts all the events which we add to onCardClick added from autside of this class. index.js in ToDoCreator inside addToDo method
        })
        this.setSlot("actionButtons", new OBC.SimpleUIComponent(this._components)); //after creating property slot (go see upper) we can set slot with name of the slot to replace => actionButtons and UI component to replace inside Todo compoent => SimpleUICompoent

        const deleteBtn = new OBC.Button(this._components);
        deleteBtn.materialIcon = "delete";
        this.slots.actionButtons.addChild(deleteBtn);

        deleteBtn.onClick.add(()=>{
            this.onDeleteButtonClick.trigger();
        })
    }
}