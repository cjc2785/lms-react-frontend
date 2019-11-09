"use strict"

import React from 'react';
import PropTypes from 'prop-types';
import AuthorActions from '../actions/authorActions';
import { create } from 'domain';


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
                    onChange={({ target }) => this.setState(
                        { authorName: target.value })}
                    value={authorName}
                    placeholder="Enter a name" />
                <div className="input-group-append">
                    <button className="btn btn-success"
                        type="submit"
                        onClick={() => onSubmit({ authorName })}>OK</button>
                </div>
            </div>
        )
    }
}

class AuthorRow extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            editing: false,
            authorName: props.author.authorName
        }
        this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    handleUpdateSubmit() {

        const { authorName } = this.state

        const updatedAuthor = {
            authorId: this.props.author.authorId,
            authorName
        }

        this.setState({ editing: false }, () => {

            AuthorActions.updateAuthor(updatedAuthor)
        })
    }

    handleDelete() {
        AuthorActions.deleteAuthor(this.props.author)
    }

    render() {

        const { editing, authorName } = this.state
        const { author, updateState: sharedUpdateState, deleteState: sharedDeleteState } = this.props

        const updateState = sharedUpdateState.id === author.authorId ?
            sharedUpdateState :
            DEFAULT_STATE

        const deleteState = sharedDeleteState.id === author.authorId ?
            sharedDeleteState :
            DEFAULT_STATE

        const updateable = sharedUpdateState.id === author.authorId || !sharedUpdateState.pending
        const deleteable = sharedDeleteState.id === author.authorId || !sharedDeleteState.pending

        return (
            <tr key={author.authorId}>
                <td> {author.authorId} </td>
                <td> {editing ? (
                    <input type="text"
                        className="form-control"
                        onChange={({ target }) => this.setState(
                            { authorName: target.value })}
                        value={authorName}
                        placeholder="Enter a name" />
                ) : authorName} </td>
                <td>
                    {!updateState.pending && (editing ? (
                        <button type="button"
                            className="btn btn-primary"
                            disabled={!updateable}
                            onClick={this.handleUpdateSubmit}>Done</button>
                    ) : (
                            <button type="button"
                                className="btn btn-primary"
                                disabled={!updateable}
                                onClick={
                                    () => this.setState({ editing: true })
                                }>Update</button>
                        ))}
                    {updateState.failure && (
                        <div className="alert alert-danger" role="alert">
                            Update author failed!
                        </div>
                    )}
                    {updateState.pending && (
                        <div className="">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    )}
                </td>
                <td>
                    {!deleteState.pending && (
                        <button type="button"
                            className="btn btn-dark"
                            disabled={!deleteable}
                            onClick={this.handleDelete}>X</button>
                    )}
                    {deleteState.failure && (
                        <div className="alert alert-danger" role="alert">
                            Delete author failed!
                        </div>
                    )}
                    {deleteState.pending && (
                        <div className="">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    )}
                </td>
            </tr>
        )
    }
}

const DEFAULT_STATE = {
    pending: false,
    failure: false,
    success: false
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

        const { updateState, deleteState } = this.props.author

        const { authorId: id } = author

        return (
            <AuthorRow key={id}
                author={author}
                updateState={updateState}
                deleteState={deleteState} />
        );
    }

    componentDidMount() {
        AuthorActions.readAuthors();
    }

    handleCreatorSubmit(author) {
        this.setState({ isCreatorOpen: false }, () => {

            AuthorActions.createAuthor(author)
        })
    }

    handleCreatorCancel() {
        this.setState({ isCreatorOpen: false })
    }

    handleAddClick() {
        this.setState({ isCreatorOpen: true })
    }

    render() {

        let content = '';

        const {
            isCreatorOpen
        } = this.state

        const { createState } = this.props.author



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
                {createState.failure && (
                    <div className="alert alert-danger" role="alert">
                        Create author failed!
                </div>
                )}
                {createState.pending && (
                    <div className="">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}
                {!createState.pending && (!isCreatorOpen ? (
                    <button type="button"
                        className="btn btn-primary" onClick={this.handleAddClick}>
                        +
                    </button>
                ) : (
                        <AuthorCreator onSubmit={this.handleCreatorSubmit}
                            onCancel={this.handleCreatorCancel} />
                    ))}

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



