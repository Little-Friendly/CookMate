import { useState } from 'react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';


export default function AddRecipe() {
    const [steps, setSteps] = useState([''])
    const [ingredients, setIngredients] = useState([""]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false)

    // Handles the steps
    const handleStepChange = (index, value) => {
        const updatedSteps = [...steps];
        updatedSteps[index] = value;
        setSteps(updatedSteps);
    };
    const addStep = () => {
        setSteps([...steps, ''])
    }
    const removeStep = (index) => {
        const updatedSteps = steps.filter((_, i) => i !== index);
        setSteps(updatedSteps);
    };

    // Handles the ingredient change
    const handleIngredientChange = (index, value) => {
        const updated = [...ingredients];
        updated[index] = value;
        setIngredients(updated);
    };


    const addIngredient = () => {
        setIngredients([...ingredients, ""]);
    };

    const removeIngredient = (index) => {
        const updated = ingredients.filter((_, i) => i !== index);
        setIngredients(updated);
    };

    // Handle file selection (click)
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // Preview image
        }
    };

    ///// Handle drag events for image
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <section className='text-gray-800 min-w-3xl'>
            <div className='space-y-5 mb-10'>
                <h2 className='text-2xl font-bold'>Add New Recipe</h2>
                <p>Share your culinary creation with the CookMate community</p>
            </div>
            {/* Recipe form */}
            <div className='p-6 border-1 border-gray-900/30 rounded-sm'>
                <h3 className='text-xl mb-10 font-bold '>Recipe Information</h3>
                <form action='submit'>
                    <div className='flex flex-col justify-center space-y-5'>
                        <label htmlFor='recipeImage' className='block m-1 font-medium'>Recipe Image</label>

                        {/* Drag and Drop area for image */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex flex-col text-green-900/70 border-1 border-dashed border-gray-700 rounded-md py-10 justify-center items-center cursor-pointer ${dragActive ? "bg-green-100/30 border-green-500" : ""
                                }`}
                        >
                            <label htmlFor="recipeImage" className="flex flex-col items-center cursor-pointer">
                                <FiUpload size={40} className="mt-2 text-sm" />
                                <p>Click to upload an image or drag and drop</p>
                                <p>Any image format, up to 10MB</p>
                            </label>

                            {/* Hidden input for file selection */}
                            <input
                                type="file"
                                id="recipeImage"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange} // your existing helper
                            />
                        </div>


                        {preview && (
                            <div className="mt-4">
                                <img src={preview} alt="Recipe Preview" className="w-48 h-48 object-cover rounded-md" />
                            </div>
                        )}

                        {/* Recipe Name */}
                        <label className='font-medium m-1'>What's the name of the new recipe?</label>
                        <input type='text' className='w-[60%] border-1 border-gray-700 rounded-sm p-2' placeholder="e.g., Grandma's Chocolate Chip Cookies" />

                        {/* Description input */}
                        <label className='font-medium m-1' htmlFor=''>Description</label>
                        <textarea className='p-2 border-1 border-gray-800/40 rounded-md' name='description' id='description' row={5} placeholder='Describe your recipe, what makes it special, and any background story...'></textarea>

                        {/* Ingredients Section */}
                        <label className='font-medium m-1'>Ingredients</label>
                        <ul className='space-y-3'>
                            {ingredients.map((ingredient, index) => (
                                <li key={index} className='flex items-center space-x-3'>
                                    <input
                                        type='text'
                                        value={ingredient}
                                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                                        placeholder={`Ingredient ${index + 1}`}
                                        className='flex-1 p-2 border-2 border-gray-500/30 rounded-sm'
                                    />
                                    {ingredients.length > 1 && (
                                        <button
                                            type='button'
                                            onClick={() => removeIngredient(index)}
                                            className='p-2 text-red-500 hover:text-red-700'
                                        >
                                            <FiTrash2 className='cursor-pointer hover:scale-[1.1]' size={20} />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <button
                            type='button'
                            onClick={addIngredient}
                            className='w-[20%] bg-gray-900 text-gray-200 font-semibold px-4 py-2 border-2 border-gray-500/30 rounded hover:bg-gray-950 cursor-pointer'
                        >
                            Add Ingredient
                        </button>


                        {/* Steps Section */}
                        <label className='font-medium m-1'>List the steps for your recipe</label>
                        <ol className='space-y-3'>
                            {/* map loops through steps array in useState variable and renders each one */}
                            {steps.map((step, index) => (
                                <li key={index} className='flex items-center space-x-3'>
                                    <input
                                        type='text'
                                        value={step}
                                        onChange={(e) => handleStepChange(index, e.target.value)}
                                        placeholder={`Step ${index + 1}`}
                                        className='flex-1 p-2 border-2 border-gray-500/30 rounded-sm'
                                    />
                                    {steps.length > 1 && (
                                        <button
                                            type='button'
                                            onClick={() => removeStep(index)}
                                            className='p-2 text-red-500 hover:text-red-700'
                                        >
                                            <FiTrash2 className='cursor-pointer hover:scale-[1.1]' size={20} />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ol>

                        <button
                            type='button'
                            onClick={addStep}
                            className='w-[20%] bg-gray-900 text-gray-200 font-semibold px-4 py-2 border-2 border-gray-500/30 rounded hover:bg-gray-950 cursor-pointer'
                        >
                            Add Step
                        </button>

                        <button
                            type="submit"
                            className="w-[25%] self-end mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Submit Recipe
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}