"use strict"

import React from 'react';
import PropTypes from 'prop-types';
import AuthorActions from '../actions/authorActions';


class AuthorCreator extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authorName: ''
        }
    }

  
    render() {

        const { authorName } = this.state 

        const {
            onSubmit,
            onCancel
        } = this.props

        return (
            <div className="input-group mb-3">
                <input type="text" 
                    className="form-control" 
                    onChange={({target}) => this.setState(
                        {authorName: target.value})}
                    value={authorName}
                    placeholder="Enter a name"/>
                <div className="input-group-append">
                    <button className="btn btn-success" 
                        type="submit"
                        onClick={() => onSubmit({authorName})}>OK</button>
                </div>
            </div>
        )
    }
}

export class AuthorList extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            isCreatorOpen: false
        }

        this.handleCreatorSubmit = this.handleCreatorSubmit.bind(this)
        this.handleCreatorCancel = this.handleCreatorCancel.bind(this)
        this.handleAddClick = this.handleAddClick.bind(this)
    }

    createAuthorRow(author) {
        return (
            <tr key={author.authorId}>
                <td> {author.authorId} </td>
                <td> {author.authorName} </td>
            </tr>
        );
    }

    componentDidMount() {
        AuthorActions.readAuthors();
    }

    handleCreatorSubmit(author) {
        this.setState({isCreatorOpen: false}, () => {
         
            AuthorActions.createAuthor(author)
        })
    }

    handleCreatorCancel() {
        this.setState({isCreatorOpen: false})
    }

    handleAddClick() {
        this.setState({isCreatorOpen: true})
    }

    render() {

        let content = '';

        const {
            isCreatorOpen 
        } = this.state

        if (this.props.author.readState.pending) {
            content = (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        }


        if (this.props.author.readState.success) {
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

        if (this.props.author.readState.failure) {
            content =
                (
                    <div className="alert alert-danger" role="alert">
                        Error while loading authors!
                </div>
                )
        }

        return (
            <div className='container'>

                <h1>Authors</h1>
                {!isCreatorOpen ? (
                    <button type="button"
                        className="btn btn-primary" onClick={this.handleAddClick}>
                        +
                    </button>
                ) : (
                    <AuthorCreator onSubmit={this.handleCreatorSubmit}
                        onCancel={this.handleCreatorCancel}/>
                )}

                {content}
            </div>
        );
    }
}

AuthorList.propTypes = {
    author: PropTypes.object.isRequired
};

AuthorCreator.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
};



