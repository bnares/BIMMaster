import * as OBC from "openbim-components";

export class QuantityCard extends OBC.SimpleUIComponent<HTMLElement>{
    
    //slots:{quantityProperty: OBC.SimpleUIComponent<HTMLElement>};
    // set dataContent(value: string){
    //     console.log("value inside setter: ",value);
    //     const content = this.getInnerElement("dataContent") as HTMLDivElement;
    //     console.log("content inside setter: ",content);
    //     content.innerHTML = value;
    // }

    set setName(value: string){
        const name = this.getInnerElement("setName") as HTMLParagraphElement;
        name.innerText = value;
    }

    set setQuantity(value: string){
        const quantity = this.getInnerElement("setQuantity") as HTMLParagraphElement;
        quantity.innerText = value;
    }

    constructor(components: OBC.Components){
        const template = `
            <div class="qunatity-card">
                <div style="display:flex; justify-content:flex-start; gap:10px">
                    <span class="material-symbols-outlined">
                        arrow_drop_down_circle
                    </span>
                    <h6 style="font:bold" id="quantity-title">Here Goes title</h6
                </div>
                <div  style="display:flex; flex-direction:column; justify-content:flex-start; align-items:center">
                    <div style="display:flex; justify-content:space-between; padding:10px">
                        <p id="setName"> </p>
                        <p id="setQuantity"> </p>
                    </div>
                </div>
            </div>
        `
        super(components, template);
        this._components = components;
        
    }
}