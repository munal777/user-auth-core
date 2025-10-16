import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-white font-sans">
      <div className="text-center max-w-xl p-10">
        <h1 className="text-5xl font-extrabold text-[#0A1F44] mb-6 tracking-tight">
          User Auth Project
        </h1>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed">
          Project build to helps other IT students to use these user auth apis to their projects.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/sign-in">
            <button className="px-8 py-3 bg-[#0047AB] text-white rounded-lg text-base font-semibold transition-transform duration-200 hover:bg-[#003A8C] hover:-translate-y-1">
              Sign In
            </button>
          </Link>
          <Link to="/sign-up">
            <button className="px-8 py-3 bg-white text-[#0047AB] border-2 border-[#0047AB] rounded-lg text-base font-semibold transition-transform duration-200 hover:bg-gray-100 hover:-translate-y-1">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
