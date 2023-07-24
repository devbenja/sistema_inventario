import { useState, useEffect } from "react";
import { useAuth } from "./context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "./components/Alert";
import { fetchSignInMethodsForEmail, getAuth } from "firebase/auth";
//
import booksLibre from "./assets/booksLibre.jpg";

export function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { login, logingWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        navigate("/Home");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  useEffect(() => {
    if (error) {
      const errorTimer = setTimeout(() => {
        setError("");
      }, 3000);

      return () => clearTimeout(errorTimer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpia el error anterior

    // Frontend validation
    if (!user.email) {
      setError("Please enter your email");
      return;
    }
    if (!user.password) {
      setError("Please enter your password.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setError("Invalid email format. Please enter a valid email address.");
      return;
    }

    // Verificar que la contraseña tenga al menos 6 caracteres
    if (user.password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    // validaciones de firebase

    try {
      const auth = getAuth();
      const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
      if (signInMethods.length === 0) {
        setError("User not found. Please check your email or register.");
        return;
      }

      await login(user.email, user.password);
      setSuccessMessage("Login sucessful");

      // navigate("/Home");
      setError();
    } catch (error) {
      const errorMessage =
        getErrorMessage(error.code) ||
        "An error occurred while trying to log in. Please try again.";
      setError(errorMessage);
    }
  };
  const handleGoogleSignin = async () => {
    try {
      await logingWithGoogle();
      navigate("/");
    } catch (error) {
      setError(error.error);
    }
  };

  const handleResetPassword = async () => {
    if (!user.email) {
      setError("Please enter your email");
      return;
    }
    try {
      await resetPassword(user.email);
      setError("We sent you an email with a link to reset your password");
    } catch (error) {
      setError(error.message);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email. Please enter a valid email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please enter the correct password.";
      case "auth/user-not-found":
        return "User not found. Please check your email or register.";
      case "auth/weak-password":
        return "Password is too weak. Please enter a stronger password.";
      case "auth/email-already-in-use":
        return "This email is already registered. Please try another one.";
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block ">
        <img
          className="w-full h-full object-cover"
          src={booksLibre}
          alt="Logo"
        />
      </div>

      <div className="bg-custom flex flex-col items-center justify-center">
        {error && <Alert message={error} />}
        {successMessage && <Alert type="success" message={successMessage} />}

        <form
          onSubmit={handleSubmit}
          className="max-w-[400px] w-full mx-auto rounded-lg bg-gray-800 p-8 px-8"
        >
          <h2 className="text-4xl text-white font-bold text-center">SIGN IN</h2>
          <div className="flex flex-col text-gray-400 py-2">
            <label htmlFor="email">Email</label>
            <input
              className="p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
              type="text"
              name="email"
              onChange={handleChange}
              placeholder="example@gmail.com"
            />
          </div>
          <div className="flex flex-col text-gray-400 py-2">
            <label htmlFor="password">Password</label>
            <input
              className="p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              placeholder="******"
            />
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <button className="w-1/2 my-5 py-2 bg-blue-500 shadow-lg  text-white font-semibold rounded-lg hover:bg-blue-700">
              SIGNIN
            </button>
            <a
              href="#"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              onClick={handleResetPassword}
            >
              Forgot Password?
            </a>
          </div>
        </form>
        <p className="max-w-[400px] flex justify-between w-full mx-auto rounded-lg bg-gray-800 p-8 px-8  text-white mt-4 py-4 ">
          Don't have an account?
          <Link to="/Register" className="text-blue-500 hover:text-blue-800 ">
            Register
          </Link>
        </p>
        <button
          onClick={handleGoogleSignin}
          className="max-w-[400px] w-full mx-auto rounded-lg bg-gray-800 p-8 px-8 text-white mt-4 py-4  hover:bg-blue-700 "
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
