import React, { useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CartContext } from '../components/Contexts';

const SigninSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
      {icon}
    </div>
    <Field
      {...props}
      className="w-full pl-10 pr-3 py-3 bg-[#F8F9FA] rounded-md border-0 focus:outline-none focus:ring-1 focus:ring-[#F5A524]"
    />
  </div>
);

const SigninPage = () => {
  const route = useNavigate();
  const { login } = useContext(CartContext);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await login(values, route);
      resetForm();
    } catch (error) {
      if (error.response?.status === 400) {
        console.error("No user found. Please create an account");
        resetForm();
      } else if (error.response?.status === 401) {
        console.error("Invalid credentials");
        resetForm();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const SignInForm = ({ errors, touched, isSubmitting }) => (
    <Form className="space-y-6">
      <div>
        <InputField
          name="email"
          type="email"
          placeholder="Email"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          }
        />
        {errors.email && touched.email && (
          <div className="text-red-500 text-xs mt-1">{errors.email}</div>
        )}
      </div>

      <div>
        <InputField
          name="password"
          type="password"
          placeholder="Password"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
        {errors.password && touched.password && (
          <div className="text-red-500 text-xs mt-1">{errors.password}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-[#F5A524] text-white py-3 rounded-full hover:bg-[#e09620] transition-colors text-sm font-medium ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Signing In...
          </span>
        ) : (
          "SIGN IN"
        )}
      </button>
    </Form>
  );


  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="md:hidden w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#F5A524]">
          Sign In to Your Account
        </h2>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SigninSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => <SignInForm {...formikProps} />}
        </Formik>

        <p className="text-center mt-6 text-gray-600">
          Not registered yet?{' '}
          <Link to="/signup" className="text-[#F5A524] font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <div className="hidden md:flex w-[1000px] h-[600px] shadow-lg rounded-lg overflow-hidden">
        <div className="w-[55%] bg-white px-20 py-12">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#F5A524]">
            Sign In to<br />Your Account
          </h2>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={SigninSchema}
            onSubmit={handleSubmit}
          >
            {(formikProps) => <SignInForm {...formikProps} />}
          </Formik>
        </div>

        <div className="w-[45%] bg-[#003049] text-white p-12 relative overflow-hidden">
          <div className="absolute top-8 right-8">
            <div className="w-12 h-12 border-2 border-[#0A4A6F] rotate-45"></div>
          </div>
          <div className="absolute bottom-10 -left-20">
            <div className="w-60 h-60 rounded-full bg-[#0A4A6F] opacity-30"></div>
          </div>
          <div className="absolute bottom-40 right-10">
            <div className="w-12 h-12 border-2 border-[#0A4A6F] rotate-45"></div>
          </div>
          <div className="h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl font-semibold mb-6">Welcome Back!</h1>
            <p className="text-base text-gray-300 mb-12">
              To keep connected with us please<br />login with your personal info
            </p>
            <Link
              to="/signup"
              className="border-2 border-white rounded-full px-16 py-3 text-sm font-medium hover:bg-white hover:text-[#003049] transition-colors"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;