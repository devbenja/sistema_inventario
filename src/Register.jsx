import { useState, useEffect } from "react";
import { useAuth } from "./context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "./components/Alert";
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";

import booksLibre from "./assets/booksLibre.jpg";

export function Register() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    if (error) {
      const errorTimer = setTimeout(() => {
        setError("");
      }, 3000);

      return () => clearTimeout(errorTimer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const successTimer = setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 3000);

      return () => clearTimeout(successTimer);
    }
  }, [successMessage, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpia el error anterior

    // Frontend validation
    if (user.email.trim() === "") {
      setError("Please enter a valid email.");
      return;
    }

    if (user.password.trim() === "") {
      setError("Please enter a valid password.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setError("Invalid email format. Please enter a valid email address.");
      return;
    }
    if (user.password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }
    // Firasebae

    try {
      const auth = getAuth();
      const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
      if (signInMethods.length > 0) {
        setError("This email is already registered. Please try another one.");
        return;
      }

      // Si el correo no está registrado, procedemos con el registro en Firebase
      await signup(user.email, user.password);
      setSuccessMessage("Register sucessful");
      // navigate("/");
      setError("");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email. Please verify your email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please verify your password.");

          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError(
            "There was an error while trying to register. Please try again."
          );
          break;
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block">
        <img
          defecto
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
          <h2 className="text-4xl text-white font-bold text-center">
            Register
          </h2>
          <div className="flex flex-col text-gray-400 py-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="rodolfo99@gmail.com"
              onChange={handleChange}
              className="p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
            />
          </div>

          <div className="flex flex-col text-gray-400 py-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              placeholder="******"
              className="p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
            />
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <button className="w-1/2 my-5 py-2 bg-blue-500 shadow-lg  text-white font-semibold rounded-lg hover:bg-blue-700">
              Register
            </button>
          </div>
        </form>
        <p className="max-w-[400px] flex justify-between w-full mx-auto rounded-lg bg-gray-800 p-8 px-8  text-white mt-4 py-4 ">
          Already an account?
          <Link to="/Login" className="text-blue-700 hover:text-blue-900">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
