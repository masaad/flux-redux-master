import { Dispatcher, Store } from './flux'; 

const controlPanelDispatcher = new Dispatcher(); 

const Update_UserName = 'UpdateUserName';

const userNameUpdateAction = (name) => {
    return {
        type: Update_UserName, 
        value: name,
    }; 
}

const Update_FontSize = 'UpdateFontSize'; 

const fontSizePrefUpdateAction = (size) => {
    return {
        type: Update_FontSize, 
        value: size, 
    };
}

document.getElementById(`userNameInput`).addEventListener(`input`, ({target}) => {
    const name = target.value; 
    console.log("Dispatchig...", name); 
    controlPanelDispatcher.dispatch(userNameUpdateAction(name)); 
})

document.forms.fontSizeForm.fontSize.forEach(element => {
    element.addEventListener('change', ({target}) => {
        controlPanelDispatcher.dispatch(fontSizePrefUpdateAction(target.value)); 
    }); 
}); 

class UserPrefsStore extends Store{
    getInitialState(){
        return localStorage['preferences'] ? JSON.parse(localStorage['preferences']) : {
            userName: 'Moe', 
            fontSize: 'small',
        }        
    }

    __onDispatch(action){
        switch (action.type){
            case Update_UserName: 
                this.__state.userName = action.value; 
                this.__emitChange(); 
                break;
            case Update_FontSize: 
                this.__state.fontSize = action.value; 
                this.__emitChange(); 
                break;
        }        
    }

    getUserPreferences(){
        return this.__state; 
    }
}

const userPrefsStore = new UserPrefsStore(controlPanelDispatcher);  

userPrefsStore.addListener((state) => {
    console.info('the current state is ...', state); 
    render(state); 
    localStorage['preferences'] = JSON.stringify(state); 
})

const render = ({userName, fontSize}) => {
    document.getElementById('userName').innerText = userName; 
    document.getElementsByClassName('container')[0].style.fontSize = fontSize === 'small' ? '16px' : '24px'; 
    document.forms.fontSizeForm.fontSize.value = fontSize; 
}

render(userPrefsStore.getUserPreferences()); 