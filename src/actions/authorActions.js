import Dispatcher from '../dispatcher/appDispatcher'
import axios from 'axios'

const AuthorActions = {
    createAuthor: function(author){
        Dispatcher.dispatch({
            actionType: 'create_author_started'
        })
        axios.post(`http://localhost:3000/authors`, author)
        .then(res => {
            Dispatcher.dispatch({
                actionType: 'create_author_successful',
                data:  res.data
            })
        })
        .catch( (error) => {
            console.log(error);
            Dispatcher.dispatch({
                actionType: 'create_author_failure'
            })
        })
    },
    readAuthors: function(){
        Dispatcher.dispatch({
            actionType: 'read_authors_started'
        })
        axios.get(`http://localhost:3000/authors`)
        .then(res => {
            Dispatcher.dispatch({
                actionType: 'read_authors_successful',
                data:  res.data
            })
        })
        .catch( (error) => {
            console.log(error)
            Dispatcher.dispatch({
                actionType: 'read_authors_failure'
            })
        });
    },
    updateAuthor: function(author){
       
        Dispatcher.dispatch({
            actionType: 'update_author_started',
            data: {author}
        })
        axios.put(`http://localhost:3000/authors`, author)
        .then(() => {
            Dispatcher.dispatch({
                actionType: 'update_author_successful',
                data:  {author}
            })
        })
        .catch( (error) => {
            console.log(error);
            Dispatcher.dispatch({
                actionType: 'update_author_failure',
                data: {author}
            })
        })
    },
    deleteAuthor: function(author){
       
        Dispatcher.dispatch({
            actionType: 'delete_author_started',
            data: {author}
        })
        axios.delete(`http://localhost:3000/authors/${author.authorId}`)
        .then(() => {
            Dispatcher.dispatch({
                actionType: 'delete_author_successful',
                data:  {author}
            })
        })
        .catch( (error) => {
            console.log(error);
            Dispatcher.dispatch({
                actionType: 'delete_author_failure',
                data: {author}
            })
        })
    },
}

module.exports = AuthorActions