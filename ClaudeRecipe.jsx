import React from 'react'
import ReactMarkdown from 'react-markdown'

export default function ClaudeRecipe(props) {
    return (
        <section className="recipe-container">
            <ReactMarkdown>{props.recipe}</ReactMarkdown>
        </section>
    )
}