import Dispatcher from '../dispatcher/appDispatcher';
import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

let _authorStore = {
    author:{
        authorList: [],
        readState:{
            pending:false,
            success:false,
            failure:false
        },
        error: ''
    }
};

class AuthorStoreClass extends EventEmitter{

    addChangeListener(cb){
        this.on(CHANGE_EVENT, cb);
    }

    removeChangeListener(cb){
        this.removeListener(CHANGE_EVENT, cb);
    }

    emitChange(){
        this.emit(CHANGE_EVENT);
    }


    getAllAuthors(){
        return _authorStore.author;
    }

    resetReadState(){
        _authorStore.author.readState = {
            pending:false,
            success:false,
            failure:false
          }
    }
}

const AuthorStore = new AuthorStoreClass();

Dispatcher.register( (action) => {

    switch (action.actionType){
        case 'read_authors_successful':
            AuthorStore.resetReadState();
            _authorStore.author.authorList = action.data;
            _authorStore.author.readState.success = true;
            AuthorStore.emitChange();
            break;
        case 'read_authors_failure':
            AuthorStore.resetReadState();
            _authorStore.author.readState.failure = true;
            AuthorStore.emitChange();
            break;
        case 'read_authors_started':
            AuthorStore.resetReadState();
            _authorStore.author.readState.pending = true;
            AuthorStore.emitChange();
            break;
        default:
            return;
    }
} );

export default AuthorStore;