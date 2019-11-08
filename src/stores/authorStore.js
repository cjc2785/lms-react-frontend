import Dispatcher from '../dispatcher/appDispatcher';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

let _authorStore = {
    author: {
        authorList: [],
        createState: {
            pending: false,
            success: false,
            failure: false
        },
        readState: {
            pending: false,
            success: false,
            failure: false
        },
        error: ''
    }
};

class AuthorStoreClass extends EventEmitter {

    addChangeListener(cb) {
        this.on(CHANGE_EVENT, cb);
    }

    removeChangeListener(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }


    getAllAuthors() {
        return _authorStore.author;
    }

    resetCreateState() {
        _authorStore.author.createState = {
            pending: false,
            success: false,
            failure: false
        }
    }

    resetReadState() {
        _authorStore.author.readState = {
            pending: false,
            success: false,
            failure: false
        }
    }
}

const AuthorStore = new AuthorStoreClass();

Dispatcher.register((action) => {

    switch (action.actionType) {
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
        case 'create_author_successful':
            AuthorStore.resetCreateState();
            _authorStore.author.authorList.push(action.data.author)
            _authorStore.author.authorList.sort((a, b) => a.authorId > b.authorId ? 1 : - 1);
            _authorStore.author.createState.success = true;
            AuthorStore.emitChange();
            break;
        case 'create_author_failure':
            AuthorStore.resetCreateState();
            _authorStore.author.createState.failure = true;
            AuthorStore.emitChange();
            break;
        case 'create_author_started':
            AuthorStore.resetCreateState();
            _authorStore.author.createState.pending = true;
            AuthorStore.emitChange();
            break;
        default:
            return;
    }
});

export default AuthorStore;