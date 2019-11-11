"use strict"

import React from 'react'
import PropTypes from 'prop-types'
import AuthorActions from '../actions/authorActions'

const DEFAULT_STATE = {
    pending: false,
    failure: false,
    success: false
}

export default class AuthorRow extends React.Component {

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

        const {
            author,
            updateState: sharedUpdateState,
            deleteState: sharedDeleteState
        } = this.props

        const updateState = sharedUpdateState.id === author.authorId ?
            sharedUpdateState :
            DEFAULT_STATE

        const deleteState = sharedDeleteState.id === author.authorId ?
            sharedDeleteState :
            DEFAULT_STATE

        const updateable = sharedUpdateState.id === author.authorId ||
            !sharedUpdateState.pending

        const deleteable = sharedDeleteState.id === author.authorId ||
            !sharedDeleteState.pending

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
                <td className='d-flex'>
                    <div>
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
                    </div>
                    <div className='ml-3'>
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
                    </div>
                </td>
            </tr>
        )
    }
}

AuthorRow.propTypes = {
    author: PropTypes.object.isRequired,
    updateState: PropTypes.object.isRequired,
    deleteState: PropTypes.object.isRequired
}