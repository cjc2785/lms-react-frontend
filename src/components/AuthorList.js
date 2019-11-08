"use strict"

import React from 'react';
import PropTypes from 'prop-types';
import AuthorActions from '../actions/authorActions';

export class AuthorList extends React.Component{

    createAuthorRow(author){
        return (
            <tr key={author.authorId}>
                <td> {author.authorId} </td>
                <td> {author.authorName} </td>
            </tr>
        );
    }

    componentDidMount(){
        AuthorActions.readAuthors();
    }

    render() {
        
        let content = '';
        
        if(this.props.author.readState.pending){
            content = (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div> 
                </div>
            );
        }
        

        if(this.props.author.readState.success){
            content = 
                (<table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.author.authorList.map(this.createAuthorRow, this)}
                    </tbody>    
                </table>)
        }

        if(this.props.author.readState.failure){
            content = 
            (
                <div className="alert alert-danger" role="alert">
                    Error while loading authors!
                </div>
            )
        }

        return(
            <div>
                <h1>Authors</h1>
                {content}
            </div>
        );
    }
}

AuthorList.propTypes = {
    author: PropTypes.object.isRequired
};



