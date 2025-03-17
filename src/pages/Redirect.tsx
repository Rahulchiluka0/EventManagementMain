
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Redirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const to = searchParams.get("to") || "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(to);
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, to]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Redirecting...</h1>
      <p className="text-muted-foreground">You will be redirected shortly</p>
    </div>
  );
};

export default Redirect;
