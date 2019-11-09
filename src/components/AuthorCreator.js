"use strict"

import React from 'react'
import PropTypes from 'prop-types'


export default class AuthorCreator extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authorName: ''
        }
    }


    render() {

        const { authorName } = this.state

        const {
            onSubmit
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

AuthorCreator.propTypes = {
    onSubmit: PropTypes.func.isRequired
}