
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw } from "lucide-react";

const PaymentFailed = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            We couldn't process your payment for booking ID: {bookingId}. 
            Please try again or use a different payment method.
          </p>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate(`/payment/${bookingId}`)}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>

            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
