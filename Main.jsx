import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromChefClaude, getRecipeFromMistral } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [error, setError] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
 
    async function getRecipe() {
        try {
            setError("")
            setIsLoading(true)
            console.log("Starting recipe generation with ingredients:", ingredients)
            const recipeMarkdown = await getRecipeFromMistral(ingredients)
            if (!recipeMarkdown) {
                throw new Error("No recipe was generated")
            }
            setRecipe(recipeMarkdown)
        } catch (err) {
            console.error("Error getting recipe:", err)
            setError(`Failed to generate recipe: ${err.message || "Unknown error"}`)
        } finally {
            setIsLoading(false)
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const newIngredient = formData.get("ingredient")
        if (newIngredient.trim()) {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient])
            e.target.reset()
        }
    }

    return (
        <main>
            <form onSubmit={handleSubmit} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button type="submit">Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    isLoading={isLoading}
                />
            }

            {error && <p className="error-message">{error}</p>}
            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}