import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios-instance';

export default function UserDashboard() {
    const [userRecipes, setUserRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            if (!token || !userData) {
                navigate('/auth');
                return;
            }

            setUser(JSON.parse(userData));
            
            try {
                // Fetch only user's recipes
                const response = await api.get('/recipes/my-recipes');
                setUserRecipes(response.data);
            } catch (error) {
                console.error('Error fetching user recipes:', error);
                // Fallback to dummy data for now
                setUserRecipes([
                    {
                        id: 1,
                        title: "My Spaghetti Carbonara",
                        description: "Classic Italian pasta dish with eggs, cheese, and pancetta",
                        cookingTime: 20,
                        author: "You"
                    }
                ]);
            }
            setLoading(false);
        };

        checkAuthAndLoadData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleEditRecipe = (recipeId) => {
        navigate(`/dashboard/edit-recipe/${recipeId}`);
    };

    const handleDeleteRecipe = async (recipeId) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await api.delete(`/recipes/${recipeId}`);
                setUserRecipes(userRecipes.filter(recipe => recipe.id !== recipeId));
            } catch (error) {
                console.error('Error deleting recipe:', error);
            }
        }
    };

    const handleCreateRecipe = () => {
        navigate('/dashboard/create-recipe');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-green-600">CookMate Dashboard</h1>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => navigate('/recipes')}
                                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Browse All Recipes
                            </button>
                            <button 
                                onClick={() => navigate('/chat')}
                                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Chat
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Welcome back, {user?.firstName || user?.username}!
                        </h2>
                        <button 
                            onClick={handleCreateRecipe}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Create New Recipe
                        </button>
                    </div>
                    
                    {userRecipes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-4">
                                You haven't created any recipes yet. Start building your cookbook!
                            </div>
                            <button 
                                onClick={handleCreateRecipe}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Create Your First Recipe
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userRecipes.map((recipe) => (
                                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {recipe.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {recipe.description}
                                        </p>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-sm text-gray-500">
                                                {recipe.cookingTime} mins
                                            </span>
                                            <span className="text-sm text-green-600 font-medium">
                                                Your Recipe
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => handleEditRecipe(recipe.id)}
                                                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteRecipe(recipe.id)}
                                                className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
