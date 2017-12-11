import { generate as id } from 'shortid'; 
import { Dispatcher, ReduceStore } from './flux'; 

const taskDispatcher = new Dispatcher(); 

const CreateTask = 'CreateTask'; 
const CompleteTask = 'CompleteTask'; 
const ShowTasks = 'ShowTasks'; 

const CreateNewTaskAction = (content) => {
    return {
        type: CreateTask, 
        value: content, 
    }; 
}

const CompleteTaskAction = (id, isComplete) => {
    return {
        type: CompleteTask, 
        id, 
        value: isComplete, 
    }; 
}

const ShowTasksAction = (show) => {
    return { 
        type: ShowTasks, 
        value: show,
    }; 
}


class TasksStore extends ReduceStore{
    getInitialState(){
        return {
            tasks: [{
                id: id(), 
                content: 'Update CSS Styles', 
                complete: false,
            }, 
            {
                id: id(), 
                content: 'Add unit tests', 
                complete: false,
            }, 
            {
                id: id(), 
                content: 'Post to social media', 
                complete: false,
            }, 
            {
                id: id(), 
                content: 'Install hard drive', 
                complete: false,
            },         
            ],
            showComplete: true, 
        }; 
    }

    reduce(state, action){
        console.log('Reducing....', state, action); 
        let newState; 
        switch(action.type){
            case CreateTask: 
                newState = { ...state, tasks: [...state.tasks]};
                newState.tasks.push({
                    id: id(), 
                    content: action.value, 
                    complete: false, 
                }); 
                return newState; 
            case ShowTasks: 
                newState = { ... state, tasks: [... state.tasks ], showComplete: action.value}; 
                return newState; 
            case CompleteTask: 
                newState = { ... state, tasks: [... state.tasks ]}; 
                const index = newState.tasks.findIndex(t => t.id === action.id); 
                newState.tasks[index] = { ... state.tasks[index], complete: action.value};                 
                return newState; 
        }
        return state; 
    }

    getState() {
        return this.__state; 
    }
}

const TaskComponent = ({content, complete, id}) => {
    const test = `<section> 
        ${content} <input type='checkbox' name='taskCompleteCheck' data-taskid=${id} ${complete ? 'checked' : ''} >
    </section>`
    return test;
}

document.forms.undo.addEventListener('submit', (e) => {
    e.preventDefault(); 
    tasksStore.revertLastState(); 
}); 

const render = () => {
    const tasksSection = document.getElementById('tasks'); 
    const state = tasksStore.getState(); 
    const rendered = state.tasks.filter(task => state.showComplete ? true : !task.complete)
                                .map(TaskComponent).join(' '); 
    tasksSection.innerHTML = rendered; 

    document.getElementsByName('taskCompleteCheck').forEach(element => {
        element.addEventListener('change', (e) => {
            const id = e.target.attributes['data-taskid'].value; 
            const checked = e.target.checked; 
            taskDispatcher.dispatch(CompleteTaskAction(id, checked)); 
        })
    })
}

document.forms.newTask.addEventListener ('submit', (e) => {
    e.preventDefault(); 
    const name = e.target.newTaskName.value; 
    if (name){
        taskDispatcher.dispatch(CreateNewTaskAction(name)); 
        e.target.newTaskName.name = null; 
    }
});

document.getElementById('showComplete').addEventListener('change', ({ target }) => {
    const showComplete = target.checked; 
    taskDispatcher.dispatch(ShowTasksAction(showComplete)); 
}); 

const tasksStore = new TasksStore(taskDispatcher); 

taskDispatcher.dispatch('Test_Dispatch');

tasksStore.addListener(() => {
    render(); 
})

render(); 

