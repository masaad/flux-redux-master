export class Store {
    constructor(dispatcher){
        this.__listeners = []; 
        this.__state = this.getInitialState();
        dispatcher.register(this.__onDispatch.bind(this)); 
    }

    __onDispatch(){
        throw new Error("Subclasses must override __onDispatch method of a Flux Store"); 
    }

    getInitialState(){
        throw new Error("Subclasses must override getInitialState method of a Flux Store"); 
    }

    addListener(listerner){
        this.__listeners.push(listerner); 
    }

    __emitChange(){
        this.__listeners.forEach(listerner => listerner(this.__state)); 
    }
}