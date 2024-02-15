import React from 'react'

interface Props{
    showToDoForm : boolean,
    setShowToDoForm : (value : boolean)=>void,
}

function ToDoList(props: Props) {

    

    React.useEffect(()=>{
      var cancelBtn = document.getElementById("cancel-toDo-button") as HTMLButtonElement;
        cancelBtn?.addEventListener("click", ()=>{
        var window = document.getElementById("add-toDo-dialog");
        if(!(window&& window instanceof HTMLDialogElement)) return;
        window.close();
    })

      var addBtn = document.getElementById("toDo-add") as HTMLElement;
      if(!addBtn){console.warn("No such btn")}
      addBtn.addEventListener("click", ()=>{
        var dialogElem = document.getElementById("add-toDo-dialog");
        if(!(dialogElem && dialogElem instanceof HTMLDialogElement)) return;
        dialogElem.showModal();
    })

    },[])


  return (
    <div style={{ flexGrow: 3, rowGap: 10 }} className="dashboard-card">
        <div
          style={{
            display: "flex",
            columnGap: 10,
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%"
          }}
        >
          <p style={{ fontSize: "small", minWidth: 40 }}>To-do</p>
          <div
            style={{
              display: "flex",
              columnGap: 5,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <span
              style={{ fontSize: "large" }}
              className="material-symbols-outlined"
            >
              search
            </span>
            <input
              style={{ width: "100%" }}
              type="text"
              placeholder="Seaarch by Name"
            />
            <span
              style={{ fontSize: "large", cursor: "pointer" }}
              id="toDo-add"
              className="material-symbols-outlined"
            >
              add
            </span>
          </div>
        </div>
        <div id="to-do-list">
          {/* Adding from Project manager new element */}
        </div>

        <dialog id="add-toDo-dialog">
            <form id="add-toDo-form">
            <h2>ToDo Add</h2>
            <div className="input-list">
                <div className="form-field-container">
                <label
                    htmlFor="description"
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                    <span className="material-symbols-outlined">summarize</span>
                    Description
                </label>
                <textarea
                    id="toDo-description"
                    name="description"
                    cols={30}
                    rows={5}
                    maxLength={30}
                    placeholder="Add Description"
                    defaultValue={""}
                />
                </div>
                <div className="form-field-container">
                <label
                    htmlFor="status"
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                    <span className="material-symbols-outlined">help</span>
                    Status
                </label>
                <select id="toDo-status" name="status">
                    <option>Pending</option>
                    <option>Active</option>
                    <option>Finished</option>
                </select>
                </div>
                <div className="form-field-container">
                <label
                    htmlFor="finishDate"
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                    <span className="material-symbols-outlined">calendar_month</span>
                    Date
                </label>
                <input id="toDo-dateCalendar" name="finishDate" type="date" />
                </div>
            </div>
            <div
                style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 5,
                padding: 10
                }}
            >
                <button
                id="cancel-toDo-button"
                type="button"
                className="form-cancel-button"
                >
                Cancel
                </button>
                <button type="submit" className="form-confirm-button">
                Accept
                </button>
            </div>
            </form>
        </dialog>
    </div>
  )
}

export default ToDoList