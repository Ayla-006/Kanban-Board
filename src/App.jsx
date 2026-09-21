import { useState,useEffect } from "react";
function Header({searchFilter,priorityFiltering}){
  return(
    <div className='bg-[#0E1939] pt-2 pl-4 pr-4 pb-4 flex flex-col lg:flex-row md:justify-between'>
      <div className='flex flex-col'>
        <h3 className="text-[#FFFFFF] text-[20px] md:text-[24px] font-650 leading-9">Kanban Board</h3>
        <div className='text-[#6B7280] flex flex-row items-center gap-x-3  text-xs font-medium mt-1 whitespace-nowrap md:text-sm md:gap-x-4'>
          <p>• Plan</p><p>• Track</p><p>• Get Things Done</p>
        </div>
      </div>
      <Search searchFilter={searchFilter}/>
      <Filter priorityFilter={priorityFiltering}/>
    </div>
  );
}
function Search({searchFilter}){
  function handleChange(e){
    searchFilter(e.target.value);
  }
  return(
  <>
    <div className="bg-[#172545] border-2 border-[#1C2A47] w-full h-10 rounded-lg mt-4 md:w-full md:mb-4 lg:w-80 lg:mb-0">
      <i className="ml-2 text-gray-400 fa-solid fa-magnifying-glass mt-2"></i>
      <input onChange={handleChange} className="focus:outline-none ml-2 text-[14px] text-[#6B7280]" placeholder="Search task..."></input>
    </div>
  </>
  );
}
function Filter({priorityFilter}){
  function filterTask(e){
    priorityFilter(e.target.value);
  }
  return(
    <>
      <div className="text-[13px] text-[#6B7280] flex flex-row gap-x-4 mt-4 md:mt-0 md:text-sm">
        <button onClick={filterTask} value={"All"} className="cursor-pointer bg-[#152240] rounded-lg pr-4 pl-4 py-1.5 self-center">◯ All</button>
        <button onClick={filterTask} value={"High"} className="cursor-pointer bg-[#152240] rounded-lg pr-4 pl-4 py-1.5 self-center">🔴 High</button>
        <button onClick={filterTask} value={"Medium"} className="cursor-pointer bg-[#152240] rounded-lg pr-4 pl-4 py-1.5 self-center">🟡 Medium</button>
        <button onClick={filterTask} value={"Low"} className="cursor-pointer bg-[#152240] rounded-lg pr-4 pl-4 py-1.5 self-center">🟢 Low</button>
      </div>
    </>
  );
}
function TaskCard({currentTask,color,delTask}){
  function handleDelete(){
    delTask(currentTask.id);
  }
  function startDragging(e){
    e.dataTransfer.setData("id",currentTask.id);
  }
  return(
    <div draggable={true} onDragStart={startDragging} className="p-4">
      <div className={`p-4 bg-[#162542] border-l-4 rounded-lg flex flex-col border-y border-r border-[#13213B]`}
      style={{borderLeftColor:color}}>
      <div className="flex flex-row justify-between">
        <p className="ml-1 text-[#FFFFFF] text-[15px] font-semibold">{currentTask.name}</p>
        <i onClick={handleDelete} className="cursor-pointer text-[#EF4444] fa-solid fa-trash"></i>
      </div>
      <p className="cursor-pointer mt-2 text-[#E2F1F8] text-xs text-medium text-center w-fit p-2 rounded-lg" style={{backgroundColor:color}}>{currentTask.priority}</p>
      <p className="text-[#8B9BBE] text-sm font-normal mt-2">{currentTask.description}</p>
      <div className="mt-4 flex flex-row justify-start gap-x-2">
        <i className="-ml-1 w-3.5 h-3.5 text-[#7084AD] fa-solid fa-calendar-days"></i>
        <p className="font-normal text-xs text-[#6B7280]">{currentTask.duedate}</p>
      </div>
    </div>
    </div>
  );
}
function Column({onDrop,onDragOver,icon,title,number,tasks,deletion}){
  const relevantTasks=tasks.filter(task=>title===task.status);
  number=relevantTasks.length;
  function handleDrop(e){
    onDrop(e,title);
  }
  return(
    <div onDrop={handleDrop} onDragOver={onDragOver} className="bg-[#0E1939] border-2 border-[#1C2A4A] w-full h-160 overflow-y-auto scrollbar-none rounded-lg lg:w-90">
      <div className="flex flex-row gap-x-2 justify-center p-4">
          {icon}
          <p className="font-sans font-700 text-lg text-[#E2F1F8]">{title}</p>
          <p className="font-sans font-semibold text-lg text-[#6B7280]">({number})</p>
      </div>
      {relevantTasks.map((task)=>{
        if(task.priority==="High"){
          const color="#F63652";
          return <TaskCard  key={task.id} currentTask={task} color={color} delTask={deletion}/>
        }
        else if(task.priority==="Medium"){
          const color="#F6B006";
          return <TaskCard key={task.id} currentTask={task} color={color} delTask={deletion}/>
        }
        else if(task.priority==="Low"){
          const color="#08BD7D";
          return <TaskCard key={task.id} currentTask={task} color={color} delTask={deletion}/>
        }
      })}
    </div>
  );
}
function Form({close,onSubmit}){
  const [formdata,setFormData]=useState({name:'',priority:'High',description:'',duedate:'',status:'Backlog'});
  function handleTaskNameChange(e){
    setFormData({
      ...formdata,
      name:e.target.value
    })
  };
  function handleTaskDescChange(e){
    setFormData({
      ...formdata,
      description:e.target.value
    })
  }
  function handleDateChange(e){
    setFormData({
      ...formdata,
      duedate:e.target.value
    })
  }
  function handlePriorityChange(e){
    setFormData({
      ...formdata,
      priority:e.target.value
    })
  }
  function handleClick(event){
    event.preventDefault();
    onSubmit(formdata);
    close();
  }
  function handleCancelClick(){
    close();
  }
  return(
    <div className="fixed inset-0 flex justify-center items-center p-4">
      <form onSubmit={handleClick} className="bg-[#0E1A34] border-2 border-[#1C2A4A] w-[600px] flex flex-col rounded-xl">
      <h3 className="cursor-pointer text-xl font-bold text-[#FFFFFF] flex justify-center items-center p-8">Add New Task</h3>
      <label className="text-sm font-semibold text-[#E2F1F8] flex flex-col pl-8 pr-8 pt-2">
        Enter Your Task Name?<input required onChange={handleTaskNameChange} className="focus:outline-none mt-2 text-[#E2F1F8] placeholder:text-sm font-normal text-[#6B7280] bg-[#162542] border border-[#1C2B4E] rounded-lg px-3 py-2.5" placeholder="Task Name..."/>
      </label>
      <label className="text-sm font-semibold text-[#E2F1F8] flex flex-col pl-8 pr-8 pt-4">
        Select Task Priority:
        <select required onChange={handlePriorityChange} className="mt-2 w-full bg-[#162542] border border-[#1C2B4E] rounded-lg px-3 py-2.5 text-[#E2F1F8] text-sm font-medium">
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </label>
      <label className="text-sm font-semibold text-[#E2F1F8] flex flex-col pl-8 pr-8 pt-4">
        Give Brief Description Of Your Task:
        <textarea required onChange={handleTaskDescChange} className="mt-2 focus:outline-none bg-[#162542] border border-[#1C2B4E] rounded-lg px-3 py-2.5"/>
      </label>
      <label className="text-sm font-semibold text-[#E2F1F8] flex flex-col pl-8 pr-8 pt-4">
        Set Your Task's Due Date
        <input required onChange={handleDateChange} type="date" className="mt-2 focus:outline-none w-full bg-[#162542] border border-[#1C2B4E] rounded-lg px-3 py-2.5"/>
      </label>
      <div className="mb-4 flex flex-row gap-x-4 justify-center items-center pl-8 pr-8 pt-4">
        <button type="submit" className="cursor-pointer bg-[#5049F9] w-[140px] rounded-lg p-4 text-[#E2F1F8]">Submit</button>
        <button type="button" onClick={handleCancelClick} className="cursor-pointer bg-[#5049F9] w-[140px] rounded-lg p-4 text-[#E2F1F8]">Cancel</button>
      </div>
    </form>
    </div>
  );
}
function App(){
  const [isFormOpen,setIsFormOpen]=useState(false);
  const [tasks,setTasks]=useState(localStorage.getItem("Tasks")!==null?JSON.parse(localStorage.getItem("Tasks")):[]);
  const [id,setId]=useState(100);
  const [searchText,setSearchText]=useState("");
  const [priority,setPriority]=useState("All");
  useEffect(()=>{
    localStorage.setItem("Tasks",JSON.stringify(tasks));
  },[tasks]);
  function priorityFilter(value){
    setPriority(value);
  }
  function searching(value){
    setSearchText(value);
  }
  const filteredArray=(tasks.filter((fewTask)=>{
    return (fewTask.name.toLowerCase().includes(searchText.toLowerCase()) && (fewTask.priority===priority || priority==="All"));
  }))
  function changeStatus(id,title){
    const newTaskArray=tasks.map((task)=>{
      if(task.id===id){
        return{
          ...task,
          status:title
        };
      }
      return task;
    });
    setTasks(newTaskArray);
  }
  function handleDeletion(taskId){
    const modifiedArray=tasks.filter((tasklists)=>{
      return tasklists.id!==taskId;
    });
    setTasks(modifiedArray);
  }
  function dragover(e){
    e.preventDefault();
  }
  function dropping(e,title){
    const id=Number(e.dataTransfer.getData("id"));
    changeStatus(id,title);
  }
  function handleClick(){
    setIsFormOpen(true);
  }
  function closeForm(){
    setIsFormOpen(false);
  }
  function handleSubmit(taskData){
    const newTask={...taskData,id:id};
    setTasks([...tasks,newTask]);
    setId(id=>id+1);
  }
  return(
    <div className="flex flex-col min-h-screen bg-[#0B101E] w-full overflow-x-hidden">
      <Header searchFilter={searching} priorityFiltering={priorityFilter}/>
      <div className="mb-4 mt-8 flex flex-row justify-center">
        <button onClick={handleClick} className="cursor-pointer bg-[#5049F9] w-[140px] rounded-lg p-4 text-[#E2F1F8]">+ Add Task</button>
      </div>
      <div className="flex flex-col gap-y-12 items-center ml-8 mr-8 mt-4 mb-8 lg:flex-row justify-center gap-x-8">
      <Column onDrop={dropping} onDragOver={dragover} icon={<i className="mt-1.5 text-[#7BDDFD] fa-solid fa-layer-group"></i>} title="Backlog" number={0} tasks={filteredArray} deletion={handleDeletion}/>
      <Column onDrop={dropping} onDragOver={dragover} icon={<i className="mt-1.5 text-[#38BDF8] fa-solid fa-stopwatch"></i>} title="In Progress" number={0} tasks={filteredArray} deletion={handleDeletion}/>
      <Column onDrop={dropping} onDragOver={dragover} icon={<i className="mt-1.5 text-[#A6F3E4] fa-solid fa-circle-check"></i>} title="Done" number={0} tasks={filteredArray} deletion={handleDeletion}/>
      </div>
      {isFormOpen && <Form close={closeForm} onSubmit={handleSubmit}/>}
    </div>
  );
}
export default App;
