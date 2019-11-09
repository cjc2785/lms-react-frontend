"use strict"

import React from 'react'
import PropTypes from 'prop-types'
import AuthorCreator from './AuthorCreator'
import AuthorRow from './AuthorRow'
import AuthorActions from '../actions/authorActions'


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
        AuthorActions.readAuthors()
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
            )
        }


        if (this.props.author.readState.success) {
            content = (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.author.authorList.map(this.createAuthorRow, this)}
                    </tbody>
                </table>
            )
        }

        if (this.props.author.readState.failure) {
            content = (
                <div className="alert alert-danger" role="alert">
                    Error while loading authors!
                </div>
            )
        }

        return (
            <div className='container'>

                <h1>Authors</h1>
                {createState.failure && (
                    <div className="alert alert-danger"
                        role="alert">
                        Create author failed!
                    </div>
                )}
                {createState.pending && (
                    <div className="">
                        <div className="spinner-border"
                            role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )}
                {!createState.pending && (!isCreatorOpen ? (
                    <button type="button"
                        className="btn btn-primary"
                        onClick={this.handleAddClick}>
                        +
                    </button>
                ) : (
                        <AuthorCreator onSubmit={this.handleCreatorSubmit}
                            onCancel={this.handleCreatorCancel} />
                    ))}

                {content}
            </div>
        )
    }
}

AuthorList.propTypes = {
    author: PropTypes.object.isRequired
}