import * as OBC from "openbim-components"
import { FragmentsGroup } from "bim-fragment";
import * as WEBIFC from "web-ifc";
import { QuantityCard } from "./src/QuantityCard";

type QtoResult = {
    [setName: string]:{[qtoName: string]: number}
}

export class SimpleQTO extends OBC.Component<QtoResult> implements OBC.UI, OBC.Disposable{
    static uuid : string = "e15362f5-c763-4897-b426-7fa67aa16f09"
    enabled: boolean=true;
    uiElement = new OBC.UIElement<{
        activationButton: OBC.Button,
        qtoList: OBC.FloatingWindow
    }>;
    private _components: OBC.Components;
    private _qtoResult: QtoResult = {};

    constructor(components: OBC.Components){
        super(components);
        this._components = components;
        this.setUI();
    }

    async setup(){
        //this method is to sum the quantities of selected elements
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter);
        
        highlighter.events.select.onHighlight.add((fragmentIdMap)=>{
            this.sumQuantities(fragmentIdMap);
        })

        highlighter.events.select.onClear.add(()=>{
            this.resetQuantities();
        })
    }

    resetQuantities(){
        this._qtoResult = {};
    }

    private setUI(){
        const activationButton = new OBC.Button(this._components);
        activationButton.materialIcon = "functions";
        activationButton.tooltip = "Quantification";
        activationButton.active = false;
        
        const qtoList = new OBC.FloatingWindow(this._components);
        this._components.ui.add(qtoList);
        qtoList.title ="Quantification";
        qtoList.description ="QTO Window"

        qtoList.visible = activationButton.active;

        activationButton.onClick.add(()=>{
            console.log("clicked show prop quantities window");
            activationButton.active = !activationButton.active;
            qtoList.visible = activationButton.active;
            console.log("visible?: ", qtoList.visible);
        })

        this.uiElement.set({activationButton, qtoList}) 
    }

    async sumQuantities(fragmentIdMap : OBC.FragmentIdMap){
        console.log("fragmentIdMap: ",fragmentIdMap);
        //framgmnetIdMap as argument means we store some group of element. we do this to search their quantities
        const fragmentManager = await this._components.tools.get(OBC.FragmentManager); //fragmentManager contains a key-value list of all loaded fragment in the viewer
        var propertiesWindow = this.uiElement.get("qtoList");
        propertiesWindow.dispose();
        for(const fragmentId in fragmentIdMap){ //here we heave "in" in loop (not of) bezouse fragmentIdMap is an object with key value pair structure => {"dsfdsId":[12,456,4] } and we iterate over keys so => "dsfdsId"
            const fragment = fragmentManager.list[fragmentId]; //getting the fragment where is selected element based in its fragmentId. if we have fragment we can get the Parent of this fragment which is the model 3d
            console.log(fragment);
            const model = fragment.mesh.parent; //here we get the parent of this fragment which is the model - FragmentGroup. model holds the all properties where we foind quantity props. inside each fragment we have a mesh property where is stored a parent property which tells us who is pa parent of this element
            if(!(model instanceof FragmentsGroup && model.properties)){ //parent element stores properties property where are hidden all quantities data
                //remember that mode variable must be of type FragmentGroup whiich in other word is our 3d model. FragmentGroup must be import upstairs is the import 
                continue;
            }
            const properties = model.properties;
            OBC.IfcPropertiesUtils.getRelationMap( //PropertiesUtils is static class which is used to find the properties of element
                properties, //properties defined in model
                WEBIFC.IFCRELDEFINESBYPROPERTIES, //one of many entities in ifc faile which starts with IFCREl. in this example we wannt 'IFCRELDEFINESBYPROPERTIES' but it can be more. the functon will find all entities in properites which are 'IFCRELDEFINESBYPROPERTIES'
                (setID, relatedIDs)=>{ //callback which tells what to do when you find table 'IFCRELDEFINESBYPROPERTIES'
                    //setID is the expressedId od entities with are 'IFCRELDEFINESBYPROPERTIES'. 
                    //relatedIds are the id's of elements which used this properites. 
                    const set = properties[setID];
                    //console.log("PROPERTIES: ",properties);
                    //console.log("SET: ",set);
                    //console.log("relatedIDs: ",relatedIDs);
                    if(set.type !== WEBIFC.IFCELEMENTQUANTITY){return}
                    const expressIDs = fragmentIdMap[fragmentId];
                    const workingIDs = relatedIDs.filter(id=>expressIDs.has(id.toString()));
                    if(workingIDs.length ==0) {return}
                    const {name: setName} = OBC.IfcPropertiesUtils.getEntityName(properties,setID);
                    if(!setName){return}
                    if(!(setName in this._qtoResult)){
                        this._qtoResult[setName] = {};
                    }
                    OBC.IfcPropertiesUtils.getQsetQuantities(
                        properties,
                        setID,
                        (qtoID)=>{
                            const {name: qtoName} = OBC.IfcPropertiesUtils.getEntityName(properties,qtoID);
                            if(!qtoName) return;
                            if(!(qtoName in this._qtoResult[setName])){
                                this._qtoResult[setName][qtoName] = 0;
                            }
                            const {value} = OBC.IfcPropertiesUtils.getQuantityValue(properties,qtoID);
                            if(!value){return}
                            this._qtoResult[setName][qtoName] +=value;
                            

                            var propertiesToDisplayInWIndow = new QuantityCard(this._components);
                            
                            // var content = `
                            // <div style="display:flex; justify-content:space-between; padding:10px">
                            //     <p id="setName">${setName}</p>
                            //     <p id="setQuantity">${this._qtoResult[setName][qtoName]}</p>
                            // </div>`
                            // propertiesToDisplayInWIndow.dataContent = content;
                            propertiesToDisplayInWIndow.setName = setName;
                            propertiesToDisplayInWIndow.setQuantity = this._qtoResult[setName][qtoName].toString();
                            console.log("propertiesToDisplay: ",propertiesToDisplayInWIndow.get());
                            var floatWindow = this.uiElement.get("qtoList");
                            floatWindow.addChild(propertiesToDisplayInWIndow);

                        }
                    )
                }
            );

        }
        console.log("qtoResult: ",this._qtoResult) 
    }

    get(): QtoResult {
        return this._qtoResult;
    }
    async dispose(){
        this.resetQuantities();
        this.uiElement.dispose();
    };
    

}