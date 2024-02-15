import React, { Children } from 'react'
import * as OBC from "openbim-components";
import { FragmentsGroup } from 'bim-fragment';
import { TodoCreator } from '../bim-components/TodoCreator';

interface IViewerContext{
    viewer : OBC.Components | null,
    setViewer: (viewer: OBC.Components | null)=>void,
}

export const ViewerContext = React.createContext<IViewerContext>({
    viewer: null,
    setViewer: ()=>{},
})

export function ViewerProvider(props:{children:React.ReactNode}){
    const [viewer, setViewer] = React.useState<OBC.Components | null>(null);
    return(
        <ViewerContext.Provider value={{viewer, setViewer}}>
            {props.children}
        </ViewerContext.Provider>
    )
}

export function IFCViewer() {
    const { setViewer} =  React.useContext(ViewerContext)
    let viewer : OBC.Components;

    const createViewer = async ()=>{
    viewer = new OBC.Components();
    setViewer(viewer)
    const sceneComponent = new OBC.SimpleScene(viewer); //defines where our object will live in 3D
    viewer.scene =sceneComponent;
    const scene = sceneComponent.get();
    scene.background = null;
    sceneComponent.setup();
    const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement;
    const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer); //allows us to see things moving around
    viewer.renderer = rendererComponent;

    const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer); //defines where we are in 3D world
    viewer.camera = cameraComponent;
    cameraComponent.controls.setLookAt(10,10,10,0,0,0);
    const grid = new OBC.SimpleGrid(viewer);

    const raycasterComponent = new OBC.SimpleRaycaster(viewer); //this has to be added before the viewer.init() and after the render is set -rendererComponent
    viewer.raycaster = raycasterComponent;

    viewer.init();
    cameraComponent.updateAspect();
    rendererComponent.postproduction.enabled = true;
    // scene.add(cube);
    // viewer.meshes.push(cube);

    const fragmentManager = new OBC.FragmentManager(viewer); //fragment manager must be after viewer.init() and before ifcLoader

    function exportFramgments(model : FragmentsGroup){
        
        const fragmentsBinary = fragmentManager.export(model)    
        const blob = new Blob([fragmentsBinary])
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${model.name.replace(".ifc","")}.frag`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const ifcLoader = new OBC.FragmentIfcLoader(viewer); //it goes with FragmentHighlighter some internal libraries
    ifcLoader.settings.wasm = {
        path: "https://unpkg.com/web-ifc@0.0.44/",
        absolute: true
    }

    const highlighter = new OBC.FragmentHighlighter(viewer); //to select elements by mouse
    highlighter.setup();

    const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer); // data to create window with properties
    highlighter.events.select.onClear.add(()=>{
        propertiesProcessor.cleanPropertiesList(); //to delete all data from window with properties after we stop selecting element
    })


    const classiifier  = new OBC.FragmentClassifier(viewer);
    const classificationWindow = new OBC.FloatingWindow(viewer);
    classificationWindow.visible = false;
    viewer.ui.add(classificationWindow);
    classificationWindow.title = "Model Groups"

    const classificationsBtn = new OBC.Button(viewer);
    classificationsBtn.materialIcon = "account_tree";

    classificationsBtn.onClick.add(()=>{
        classificationWindow.visible = !classificationWindow.visible;
        classificationsBtn.active = classificationsBtn.visible;
    })

    async function createModelTree(){
        const fragmentTree = new OBC.FragmentTree(viewer); //creats ui representeting on the groups based on the classifier
        await fragmentTree.init()
        fragmentTree.update([])
        await fragmentTree.update(["model","storeys","entities"])
        fragmentTree.onHovered.add((fragmentMap)=>{
            highlighter.highlightByID("hover", fragmentMap);
        })
        fragmentTree.onSelected.add((fragmentMap)=>{
            highlighter.highlightByID("select",fragmentMap);
        })
        const tree = fragmentTree.get().uiElement.get("tree")
        return tree;
    }

    const culler = new OBC.ScreenCuller(viewer); //creating a procces to not display elements which are not in our camera 
    cameraComponent.controls.addEventListener("sleep",()=>{ //when camera stops ('sleep' event) we tel the cooler it needs to be updated
        culler.needsUpdate = true;
    })

    async function onModelLoaded(model : FragmentsGroup){
        try{
            
            highlighter.update(); //to tel higlighter taaht new model was loaded
            classiifier.byModel(model.id.toString(),model);
            classiifier.byStorey(model)
            classiifier.byEntity(model)
            const tree = await createModelTree();
            await classificationWindow.slots.content.dispose(true)
            classificationWindow.addChild(tree)
            propertiesProcessor.process(model)
            highlighter.events.select.onHighlight.add((fragmentMap)=>{
                const expressId = [...Object.values(fragmentMap)[0]][0]
                propertiesProcessor.renderProperties(model,Number(expressId))
            })
            for(const fragment of model.items){
                culler.add(fragment.mesh);
            }
            culler.needsUpdate = true;
        }catch(e){
            
            console.warn("Error from onModelLoaded function: ",e);
            alert(e);
        }
        
    }

    function ExportModelProperties(model: FragmentsGroup, fileName:string="fragmentProperties"){
        var prop = {...model.properties};
        var json = JSON.stringify(prop,null,2);
        const blob = new Blob([json],{type:"application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    function ImportModelProperties(model : FragmentsGroup){
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        const reader = new FileReader();
        var projects={};
        reader.addEventListener("load",async ()=>{
            const json = reader.result as string;
            if(!json)return;
            projects = JSON.parse(json);
            console.log("projects Object: ",projects);
            model.properties = projects;
            await onModelLoaded(model);
        })
        input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsText(filesList[0])
        })
        input.click();
    }


    ifcLoader.onIfcLoaded.add(async (model)=>{
        exportFramgments(model);
        ExportModelProperties(model);
        onModelLoaded(model);
    })

    fragmentManager.onFragmentsLoaded.add((model)=>{
        ImportModelProperties(model);
    })

    const importFragmentButn = new OBC.Button(viewer);
    importFragmentButn.materialIcon = "upload";
    importFragmentButn.tooltip = "Load FRAG";
    importFragmentButn.onClick.add( ()=>{
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.frag'
        const reader = new FileReader()
        reader.addEventListener("load", async () => {
          const binary = reader.result
          if (!(binary instanceof ArrayBuffer)) { return }
          const fragmentBinary = new Uint8Array(binary);
          await fragmentManager.load(fragmentBinary)
        
        })
        input.addEventListener('change', () => {
          const filesList = input.files
          if (!filesList) { return }
          reader.readAsArrayBuffer(filesList[0])
        })
        input.click()
    })


    ifcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    ifcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

    const todoCreator = new TodoCreator(viewer);
    await todoCreator.setup();
    // todoCreator.onProjectCreated.add((todo)=>{ //onProjectCreated is an event from ToDoCreator class argument todo was passed in this class there by <ToDo> signature
    //     console.log("todo Event: ",todo);
    // })

    //const simpleQto = new SimpleQTO(viewer);
    //await simpleQto.setup();

    //const propsFinder = new OBC.IfcPropertiesFinder(viewer);
    //await propsFinder.init();
    // propsFinder.onFound.add((fragmentIdMap)=>{
    //     highlighter.highlightByID("select",fragmentIdMap)
    // })

    const toolbar = new OBC.Toolbar(viewer);

    toolbar.addChild(
        ifcLoader.uiElement.get("main"),
        classificationsBtn,
        propertiesProcessor.uiElement.get("main"),
        importFragmentButn,
        //importDataFromFragment,
        fragmentManager.uiElement.get("main"),
        todoCreator.uiElement.get("activationButton"),
        //simpleQto.uiElement.get("activationButton"),
        //propsFinder.uiElement.get("main"),
    )
    viewer.ui.addToolbar(toolbar);
    }

    React.useEffect(()=>{
        createViewer();
        return ()=>{
            viewer.dispose();
            setViewer(null);
        }
    },[])

  return (
    <div
      id="viewer-container"
      className="dashboard-card"
      style={{ minWidth: 0, position: "relative" }}
    />
  )
}

