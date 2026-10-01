import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
    <h1 className="text-4xl font-bold accent-text page-header">page not found</h1>
    <p className="opacity-80">there's nothing at this address.</p>
    <Link to="/" className="underline underline-offset-4 hover:opacity-80">
      back to the homepage
    </Link>
  </div>
);
