import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from '../axios-instance';

import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoMdPerson } from "react-icons/io";
import { PiChefHatBold } from "react-icons/pi";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [alert, showAlert] = useState({ message: "", show: false });

    const navigate = useNavigate();

    const { register, handleSubmit, reset } = useForm({
        defaultValues: { email: "", password: "", firstName: "", lastName: "", username: "" },
    });

    // LOGIN HANDLER
    const loginUser = async (values) => {
        try {
            const response = await api.post('/auth/login', {
                email: values.email,
                password: values.password
            });

            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            showAlert({ show: true, message: "Login successful!" });
            navigate("/dashboard");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
            showAlert({ show: true, message: errorMessage });
        }
    };

    // SIGNUP HANDLER
    const signupUser = async (values) => {
        try {
            const response = await api.post('/auth/signup', {
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username
            });

            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            showAlert({ show: true, message: "Signup successful! Welcome to CookMate!" });
            reset();
            // Navigate to dashboard after successful signup
            navigate("/dashboard");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Signup failed. Please try again.";
            showAlert({ show: true, message: errorMessage });
        }
    };

    // Helper function that toggles password icon in form
    const togglePasswordVisibility = () => {
        setShowPassword((visible) => !visible);
    };

    const toggleFormMode = (e) => {
        e.preventDefault(); //  this just prevent navigation from the <a> tag
        setIsLogin(!isLogin);
        setShowPassword(false); // reset password visibility on mode change
    };

    return (
        <section id="auth" className="w-full text-gray-800 flex bg-[#f8f6f3] min-h-screen">
            {/* The left column of our page */}
            <div className="w-[55%] min-w-[400px] px-8 py-20">
                <span className='rounded-full py-1 px-3 bg-amber-100 font-semibold'>Join the community</span>
                <h2 className="text-4xl mt-2 mb-10 font-semibold">
                    Welcome to <br /><span className="text-green-600">CookMate</span>
                </h2>
                <p className="mb-10">
                    Join thousands of home cooks sharing recipes, planning meals, and creating amazing culinary experiences together.
                </p>
                <ul className="space-y-5 mb-10 list-none">
                    <li>
                        <div className='flex justify-start align-center gap-3'>
                            <div className='flex justify-center items-center p-3 rounded-full bg-amber-100'>
                                <FaEnvelope className='m-auto text-gray-900/50 text-3xl' />
                            </div>
                            <div>
                                <b>Save and Organize Recipes</b>
                                <p>Build your personal cookbook with recipes you love</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='flex justify-start align-center gap-3'>
                            <div className='flex justify-center items-center p-3 rounded-full bg-amber-100'>
                                <IoMdPerson className='m-auto text-gray-900/50 text-3xl' />
                            </div>
                            <div>
                                <b>Connect with other Chefs</b>
                                <p>Share recipes and discover new favorites from the community</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className='flex justify-start align-center gap-3'>
                            <div className='flex justify-center items-center p-3 rounded-full bg-amber-100'>
                                <PiChefHatBold className='m-auto text-gray-900/50 text-3xl' />
                            </div>
                            <div>
                                <b>Smart Meal Planning</b>
                                <p>Plan your meals and generate shopping lists automatically</p>
                            </div>
                        </div>
                    </li>
                </ul>
                {/* Dummy stats could be imported using  (API) */}
            <div className='flex justify-around'>
                    <div className='flex flex-col space-y-1'>
                        <b className='text-2xl text-green-600'>50K+</b>
                        <p>Recipes</p>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <b className='text-2xl text-green-600'>50K+</b>
                        <p>Users</p>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <b className='text-2xl text-green-600'>50K+</b>
                        <p>Rating</p>
                    </div>
                </div>
            </div>

            {/* The right column */}
            <div className="w-[45%] min-w-[300px] px-8 py-20 flex items-center justify-center">
                <div className="w-full max-w-md space-y-6 p-10 border-2 border-gray-800/30 rounded-sm text-center">
                    <div className='flex flex-col justify-center items-center text-center space-y-4'>
                        <div className="flex justify-center items-center p-5 w-20 h-20 rounded-full bg-amber-100 border border-gray-500/30">
                            <PiChefHatBold className="text-gray-900/50 text-3xl" />
                        </div>

                        <h3 className='font-semibold text-2xl'>
                            {isLogin ? 'Welcome Back!' : 'Join CookMate!'}
                        </h3>
                        <h4>
                            {isLogin ? (
                                <LoginAlert alert={alert} showAlert={showAlert} />
                            ): (
                                <SignupAlert alert={alert} showAlert={showAlert} />
                            )}
                        </h4>
                    </div>

                    {/* Use the separate form components */}
                    {isLogin ? (
                        <LoginForm 
                            handleSubmit={handleSubmit} 
                            loginUser={loginUser} 
                            register={register}
                            showPassword={showPassword}
                            togglePasswordVisibility={togglePasswordVisibility}
                        />
                    ) : (
                        <SignupForm 
                            handleSubmit={handleSubmit} 
                            signupUser={signupUser} 
                            register={register}
                            showPassword={showPassword}
                            togglePasswordVisibility={togglePasswordVisibility}
                        />
                    )}

                    <span>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <a href="#" onClick={toggleFormMode} className="text-green-600 hover:underline cursor-pointer">
                            {isLogin ? "Sign up" : "Log in"}
                        </a>
                    </span>
                </div>
            </div>
        </section>
    );
}

function LoginForm({ handleSubmit, loginUser, register, showPassword, togglePasswordVisibility }) {
    return (
        <form className="space-y-6" onSubmit={handleSubmit(loginUser)} autoComplete="on">
            {/* Email Input */}
            <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className="w-full pl-10 pr-3 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                    {...register("email")}
                />
            </div>

            {/* Password Input */}
            <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                    {...register("password")}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            {/* Remember Me Checkbox and Forgot Password */}
            <div className='flex justify-between items-center'>
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="remember" autoComplete="remember-me" className="w-4 h-4" />
                    Remember me
                </label>
                <a href="/forgot-password" className="text-green-600 hover:underline cursor-pointer">
                    Forgot Password?
                </a>
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-green-500 text-black rounded hover:bg-green-600 hover:scale-[1.05] transition cursor-pointer"
            >
                Login
            </button>
        </form>
    );
}

function SignupForm({ handleSubmit, signupUser, register, showPassword, togglePasswordVisibility }) {
    return (
        <form className="space-y-6" onSubmit={handleSubmit(signupUser)} autoComplete="on">
            {/* Username Input */}
            <div className="relative">
                <IoMdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    className="w-full pl-10 pr-3 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                    {...register("username")}
                />
            </div>

            {/* First Name Input */}
            <div className="relative">
                <IoMdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="First Name"
                    autoComplete="given-name"
                    className="w-full pl-10 pr-3 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                    {...register("firstName")}
                />
            </div>

            {/* Last Name Input */}
            <div className="relative">
                <IoMdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Last Name"
                    autoComplete="family-name"
                    className="w-full pl-10 pr-3 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                    {...register("lastName")}
                />
            </div>

            {/* Email Input */}
            <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className="w-full pl-10 pr-3 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                    {...register("email")}
                />
            </div>

            {/* Password Input */}
            <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                    {...register("password")}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-green-500 text-black rounded hover:bg-green-600 hover:scale-[1.05] transition cursor-pointer"
            >
                Sign Up
            </button>
        </form>
    );
}

function LoginAlert({ alert, showAlert }) {
    return (
        <>
            {alert.show && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{alert.message}</span>
                    <button
                        onClick={() => showAlert({ message: "", show: false })}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}

function SignupAlert({ alert, showAlert }) {
    return (
        <>
            {alert.show && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{alert.message}</span>
                    <button
                        onClick={() => showAlert({ message: "", show: false })}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}
