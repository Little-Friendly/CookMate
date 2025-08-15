import { useState } from 'react';
import { FiUpload, FiTrash2 } from "react-icons/fi";


export default function AddRecipe() {
    const [steps, setSteps] = useState([""])

    const handleStepChange = (index, value) => {
        const updatedSteps = [...steps];
        updatedSteps[index] = value;
        setSteps(updatedSteps);
    };
    const addStep = () => {
        setSteps([...steps, ""])
    }
    const removeStep = (index) => {
        const updatedSteps = steps.filter((_, i) => i !== index);
        setSteps(updatedSteps);
    };

    return (
        <section className='py-20 px-30 text-gray-800'>
            <div className='space-y-5 mb-10'>
                <h2 className='text-4xl font-bold'>Add New Recipe</h2>
                <p>Share your culinary creation with the CookMate community</p>
            </div>
            {/* Recipe form */}
            <div className='p-6 border-1 border-gray-900/30 rounded-sm'>
                <h3 className='text-2xl mb-10 font-bold '>Recipe Information</h3>
                <form action="submit" className='space-y-8'>
                    <div className='flex flex-col justify-center space-y-5'>
                        <label className='block mb-2 font-medium'>Recipe Image</label>

                        {/* Drag and Drop area for image */}
                        <label htmlFor="recipeImage" className='flex flex-col text-green-900/70 border-1 border-dashed border-gray-700 rounded-md py-10 justify-center items-center cursor-pointer'>
                            <FiUpload size={40} className='mt-2 text-sm' />
                            <p>Click to upload an image or drag and drop</p>
                            <p>PNG, JPG, up to 10MB</p>
                        </label>
                        <label className='font-medium'>Recipe Name</label>
                        <input type="text" className='w-[60%] border-1 border-gray-700 rounded-sm p-2' placeholder="e.g., Grandma's Chocolate Chip Cookies" />

                        {/* Description input */}
                        <label className='font-medium' htmlFor="">Description</label>
                        <textarea className='p-2 border-1 border-gray-800/40 rounded-md' name="description" id="description" row={5} placeholder='Describe your recipe, what makes it special, and any background story...'></textarea>

                        {/* Steps Section */}
                        <label className="font-medium mt-6">Steps</label>
                        <ol className="space-y-3">
                            {/* map loops through steps array in useState variable and renders */}
                            {steps.map((step, index) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={step}
                                        onChange={(e) => handleStepChange(index, e.target.value)}
                                        placeholder={`Step ${index + 1}`}
                                        className="flex-1 p-2 border border-gray-700 rounded-sm"
                                    />
                                    {steps.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeStep(index)}
                                            className="p-2 text-red-500 hover:text-red-700"
                                        >
                                            <FiTrash2 className='cursor-pointer hover:scale-[1.1]' size={20} />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ol>

                        <button
                            type="button"
                            onClick={addStep}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Add Step
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}