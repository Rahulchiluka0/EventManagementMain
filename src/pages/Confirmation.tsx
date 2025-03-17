
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Share2 } from "lucide-react";

const Confirmation = () => {
  const { bookingId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your booking (ID: {bookingId}) has been
            confirmed. You will receive an email with your ticket details shortly.
          </p>

          <div className="space-y-4">
            <Button className="w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Tickets
            </Button>
            
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share with Friends
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

export default Confirmation;
