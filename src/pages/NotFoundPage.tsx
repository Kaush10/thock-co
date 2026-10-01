import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
    <div className="scrim">
      <h1 className="t-title">page not found</h1>
      <p className="t-body mt-4 text-ash">there's nothing at this address.</p>
    </div>
    <Link to="/" className="underline underline-offset-4 hover:opacity-80">
      back to the homepage
    </Link>
  </div>
);
