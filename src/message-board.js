import { createStore, combineReducers, applyMiddleware } from 'redux'; 
import { get } from './http'; 
import logger from 'redux-logger'; 

export const ONLINE = 'ONLINE'; 
export const AWAY = 'AWAY'; 
export const BUSY = 'BUSY'; 
export const OFFLINE = 'OFFLINE'; 
export const UPDATE_STATUS = 'UPDATE_STATUS'; 
export const CREAT_NEWMESSGE= 'CreateNewMessage'; 


export const READY = 'READY'; 
export const WAITING = 'WAITING'; 
export const NEW_MESSAGE_SERVER_ACCEPTED = 'NEW_MESSAGE_SERVER_ACCEPTED'; 

const defatulState = {
    messages: [{
        date: new Date('2017-06-24'), 
        postedBy: 'Moe Asaad', 
        content: 'This is Redux training',
    },
    {
        date: new Date('2017-11-11'), 
        postedBy: 'Soso', 
        content: 'I do not care',
    },
    {
        date: new Date('2017-12-01'), 
        postedBy: 'Moe Asaad', 
        content: 'No one asked you!',
    },
], 
    userStatus: ONLINE,
    apiCommunicationStatus : READY,
}

const reducer = (state = defatulState, {type, value}) => {
    switch(type){
        case UPDATE_STATUS: 
            return { ...state, userStatus: value}; 
    }
    
    return state; 

}

const userStatusReducer = (state = defatulState.userStatus, {type, value}) => {
    switch(type){
        case UPDATE_STATUS: 
            return value; 
    }
    return state; 
}; 

const apiCommunicationStatusReducer = (state = READY, { type }) => {
    switch (type){
        case CREAT_NEWMESSGE: 
            return WAITING; 
        case NEW_MESSAGE_SERVER_ACCEPTED: 
            return READY; 
    }
    return READY;
}



const messageReducer = (state = defatulState.messages, {type, value, postedBy, date}) => {
    switch(type){
        case CREAT_NEWMESSGE:
            const newState = [{date, postedBy, content: value}, ...state]; 
            return newState;  
    }
    return state; 
}; 

const combinedReducer = combineReducers({
    userStatus: userStatusReducer, 
    messages: messageReducer, 
    apiCommunicationStatus: apiCommunicationStatusReducer,
});

const store = createStore(
    combinedReducer, 
    applyMiddleware(logger())); 

document.forms.newMessage.addEventListener('submit', (e)=> {
    e.preventDefault(); 
    const value = e.target.newMessage.value; 
    const username = localStorage['preferences'] ? JSON.parse(localStorage['preferences']).userName : 'Moe'; 
    store.dispatch(newMessageAction(value, username)); 
}); 

const render = () => {
    const { messages, userStatus, apiCommunicationStatus } = store.getState(); 
    document.getElementById('messages').innerHTML = messages
            .sort((a, b) => b.date - a.date)
            .map(message => (`
                <div>
                    ${message.postedBy} : ${message.content}
                </div>
            `)).join(''); 

    document.forms.newMessage.fields.disabled = (userStatus == OFFLINE || apiCommunicationStatus == WAITING); 
    document.forms.newMessage.newMessage.value = ''; 
}

const statusUpdateAction = (value) => {
    return { 
        type: UPDATE_STATUS, 
        value,
    }; 
}; 

const newMessageAction = (content, postedBy) => { 
    const date = new Date(); 

    get('/api/create', (id) => {
        store.dispatch({
            type: NEW_MESSAGE_SERVER_ACCEPTED,
        })
    }); 

    return {
        type: CREAT_NEWMESSGE, 
        value: content, 
        postedBy, 
        date, 
    }; 
}; 

document.forms.selectStatus.status.addEventListener('change', (e) => { 
    store.dispatch(statusUpdateAction(e.target.value)); 
})

render(); 

store.subscribe(render); 

console.log('Making request.....'); 
get ('http://test.com', (id) => {
    console.log('Recieved callback', id); 
})
console.log('Resuming execution......'); 