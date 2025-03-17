import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, MapPin, Clock, Ticket, ArrowRight, Search, Star, Users, CreditCard, CheckCircle, Mail, User } from "lucide-react";

const LandingPage = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
    // Reset form
    setEmail("");
    // Show success message or toast notification
    alert("Thanks for subscribing!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-bg.jpg"
            alt="Event background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Discover & Book Amazing Events
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Find the perfect events for you, book tickets instantly, and enjoy seamless experiences with our digital ticket system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg rounded-full px-8 py-6 text-lg transition-all duration-300">
                  Explore Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 rounded-full px-8 py-6 text-lg transition-all duration-300">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="container mx-auto px-4 relative z-10 -mt-8 mb-16">
          <Card className="backdrop-blur-md bg-white/90 border border-gray-100 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <form className="flex flex-col md:flex-row">
                <div className="flex-1 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-100">
                  <div className="flex items-center">
                    <Search className="h-5 w-5 text-gray-400 mr-3" />
                    <Input
                      type="text"
                      placeholder="Search events, concerts, workshops..."
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 placeholder:text-gray-400 text-lg"
                    />
                  </div>
                </div>
                <div className="p-4 md:p-6 flex items-center justify-between md:w-auto">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md rounded-lg px-8 py-3 w-full md:w-auto transition-all duration-300">
                    Find Events
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Our Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make event discovery and booking simple, secure, and enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card className="backdrop-blur-sm bg-white/80 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Discover Events</h3>
                <p className="text-gray-600">
                  Find events that match your interests, location, and schedule with our powerful search tools.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="backdrop-blur-sm bg-white/80 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
              <CardContent className="p-8 text-center">
                <div className="bg-green-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Ticket className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy Booking</h3>
                <p className="text-gray-600">
                  Book tickets in seconds with our streamlined checkout process and secure payment options.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="backdrop-blur-sm bg-white/80 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">QR Ticket System</h3>
                <p className="text-gray-600">
                  Access your tickets instantly with our digital QR code system. No printing required.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="backdrop-blur-sm bg-white/80 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02]">
              <CardContent className="p-8 text-center">
                <div className="bg-red-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Community</h3>
                <p className="text-gray-600">
                  Connect with like-minded people and share your experiences with our vibrant community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to discover, book, and enjoy events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-xl font-bold">1</span>
              </div>
              <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2 transform"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Find Events</h3>
              <p className="text-gray-600">
                Browse through our curated list of events or search for specific ones that match your interests.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-xl font-bold">2</span>
              </div>
              <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2 transform"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Book Tickets</h3>
              <p className="text-gray-600">
                Select your preferred tickets, complete the secure checkout process, and receive instant confirmation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Attend & Enjoy</h3>
              <p className="text-gray-600">
                Show your digital ticket at the venue, skip the lines, and enjoy your event hassle-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Events Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Popular Events</h2>
              <p className="text-xl text-gray-600 max-w-2xl">
                Discover trending events that everyone's talking about
              </p>
            </div>
            <Link to="/events" className="mt-4 md:mt-0">
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg px-6 py-2.5 transition-all duration-300">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event Card 1 */}
            <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="../../public/favicon.ico"
                  alt="Music Festival"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Aug 15, 2023</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>7:00 PM</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Summer Music Festival</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Central Park, New York</span>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  Join us for a night of amazing music featuring top artists and bands from around the world.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800">$49.99</span>
                  <Link to="/events/1">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md rounded-lg px-4 py-2 transition-all duration-300">
                      Get Tickets
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Event Card 2 */}
            <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/assets/event2.jpg"
                  alt="Tech Conference"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Sep 22, 2023</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>9:00 AM</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Tech Innovation Summit</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Convention Center, San Francisco</span>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  Discover the latest trends in technology and innovation with industry leaders and experts.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800">$129.99</span>
                  <Link to="/events/2">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md rounded-lg px-4 py-2 transition-all duration-300">
                      Get Tickets
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Event Card 3 */}
            <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/assets/event3.jpg"
                  alt="Food Festival"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    New
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Oct 5, 2023</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>11:00 AM</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">International Food Festival</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Waterfront Park, Chicago</span>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  Experience culinary delights from around the world with top chefs and food enthusiasts.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800">$39.99</span>
                  <Link to="/events/3">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md rounded-lg px-4 py-2 transition-all duration-300">
                      Get Tickets
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from people who have discovered amazing events through our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "I've discovered so many amazing events through this platform! The booking process is seamless, and I love having my tickets right on my phone."
                </p>
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Music Enthusiast</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "As an event organizer, this platform has made it so much easier to manage ticket sales and check-ins. The analytics are incredibly helpful!"
                </p>
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Michael Chen</h4>
                    <p className="text-sm text-gray-500">Event Organizer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < 4 ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "The QR code ticket system is a game-changer! No more waiting in long lines or worrying about losing paper tickets. Highly recommend!"
                </p>
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Alex Rodriguez</h4>
                    <p className="text-sm text-gray-500">Concert Goer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Basic</h3>
                <p className="text-gray-600 mb-6">Perfect for occasional event-goers</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">Free</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Browse and discover events</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Book tickets with no hidden fees</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Digital QR code tickets</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md rounded-lg py-3 transition-all duration-300">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="backdrop-blur-sm bg-white/90 border-2 border-blue-500 shadow-xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                Popular
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium</h3>
                <p className="text-gray-600 mb-6">For regular event enthusiasts</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">$9.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>All Basic features</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Early access to popular events</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Exclusive discounts</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Priority customer support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md rounded-lg py-3 transition-all duration-300">
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Pro</h3>
                <p className="text-gray-600 mb-6">For event organizers & businesses</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">$29.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>All Premium features</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Create and manage events</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Custom branding options</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md rounded-lg py-3 transition-all duration-300">
                  Get Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-md rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-800 hover:no-underline">
                  How do I purchase tickets?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Purchasing tickets is easy! Simply browse events, select the one you're interested in, choose your ticket type and quantity, and proceed to checkout. We accept all major credit cards and digital payment methods.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-md rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-800 hover:no-underline">
                  Can I get a refund if I can't attend an event?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Refund policies vary by event. Each event page clearly displays the refund policy set by the organizer. Generally, most events allow refunds up to 7 days before the event date. Check the specific event details for more information.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-md rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-800 hover:no-underline">
                  How does the QR code ticket system work?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  After purchasing a ticket, you'll receive a digital ticket with a unique QR code in your email and in your account dashboard. Simply show this QR code on your phone at the event entrance for scanning. No need to print anything!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-md rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-800 hover:no-underline">
                  How do I organize my own event on the platform?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  To organize an event, you'll need a Pro account. Once registered, you can create events, set ticket types and prices, customize your event page, and manage attendees. Our platform handles all the ticket sales and provides detailed analytics.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="backdrop-blur-sm bg-white/90 border border-gray-100 shadow-md rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-800 hover:no-underline">
                  Is my payment information secure?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Absolutely! We use industry-standard encryption and secure payment processors. We never store your full credit card details on our servers. All transactions are protected with SSL encryption and comply with PCI DSS standards.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated with Latest Events</h2>
            <p className="text-xl text-white/90 mb-8">
              Subscribe to our newsletter and never miss out on exciting events in your area
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 h-12 rounded-lg focus-visible:ring-white"
                />
              </div>
              <Button type="submit" className="bg-white text-blue-700 hover:bg-white/90 shadow-lg rounded-lg h-12 px-6 transition-all duration-300">
                <Mail className="h-5 w-5 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EventHub</h3>
              <p className="text-gray-400 mb-6">
                Discover, book, and enjoy events with our seamless platform.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Browse Events</Link></li>
                <li><Link to="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/calendar" className="text-gray-400 hover:text-white transition-colors">Event Calendar</Link></li>
                <li><Link to="/venues" className="text-gray-400 hover:text-white transition-colors">Venues</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                <li><Link to="/feedback" className="text-gray-400 hover:text-white transition-colors">Feedback</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/refunds" className="text-gray-400 hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;