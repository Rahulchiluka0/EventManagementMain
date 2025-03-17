import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, ArrowUp, Download, Filter, CreditCard, Clock, ChevronRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const monthlyEarnings = [
  { month: "Jan", earnings: 1200 },
  { month: "Feb", earnings: 1800 },
  { month: "Mar", earnings: 2200 },
  { month: "Apr", earnings: 1600 },
  { month: "May", earnings: 2400 },
  { month: "Jun", earnings: 2100 },
];

const eventEarnings = [
  { name: "Summer Food Festival", value: 2500 },
  { name: "Artisan Market", value: 1800 },
  { name: "Farmers Market", value: 1200 },
];

const COLORS = ["#D40915", "#1F2937", "#047857"];

const recentTransactions = [
  {
    id: 1,
    date: "2024-03-15",
    description: "Stall Booking - Summer Food Festival",
    amount: "+$500",
    type: "credit",
  },
  {
    id: 2,
    date: "2024-03-14",
    description: "Maintenance Fee",
    amount: "-$50",
    type: "debit",
  },
  {
    id: 3,
    date: "2024-03-13",
    description: "Sales Revenue - Food Corner A12",
    amount: "+$350",
    type: "credit",
  },
];

const EarningsView = () => {
  return (
    <div className="space-y-8 pb-8 ml-4">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Earnings Overview</h1>
            <p className="text-gray-600">Track your revenue and financial performance</p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
            <div className="bg-green-50 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">$11,300</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 flex items-center gap-1 px-2 py-0.5">
                <ArrowUp className="h-3 w-3 mr-1" />
                15%
              </Badge>
              <p className="text-xs text-gray-500 ml-2">from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Per Event</CardTitle>
            <div className="bg-blue-50 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">$1,850</div>
            <p className="text-xs text-gray-500 mt-1">Based on last 6 events</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Next Payout</CardTitle>
            <div className="bg-purple-50 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">$2,500</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-0 flex items-center gap-1 px-2 py-0.5">
                <Clock className="h-3 w-3 mr-1" />
                5 days
              </Badge>
              <p className="text-xs text-gray-500 ml-2">until processing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">Monthly Earnings</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Revenue trends over time</p>
            </div>
            <Select defaultValue="6months">
              <SelectTrigger className="w-[140px] border-gray-200">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyEarnings} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D40915" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#D40915" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#D40915"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#D40915", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#D40915", strokeWidth: 0 }}
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">Earnings by Event</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Revenue distribution</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventEarnings}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {eventEarnings.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb'
                    }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                      paddingLeft: '20px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Section */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">Recent Transactions</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Your latest financial activity</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="mb-6">
              <TabsList className="bg-gray-100/80 p-1 rounded-lg w-auto inline-flex">
                <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="credits" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                  Credits
                </TabsTrigger>
                <TabsTrigger value="debits" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm">
                  Debits
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg flex-shrink-0 ${transaction.type === "credit" ? "bg-green-50" : "bg-red-50"
                        }`}>
                        <CreditCard className={`h-5 w-5 ${transaction.type === "credit" ? "text-green-600" : "text-red-600"
                          }`} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-800">{transaction.description}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"
                        }`}>
                        {transaction.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="credits" className="mt-0">
              <div className="space-y-4">
                {recentTransactions.filter(t => t.type === "credit").map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg flex-shrink-0 bg-green-50">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-800">{transaction.description}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-green-600">{transaction.amount}</span>
                    </div>
                  </div>
                ))}
                {recentTransactions.filter(t => t.type === "credit").length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <DollarSign className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No credits found</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                      You don't have any credit transactions in the selected period.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="debits" className="mt-0">
              <div className="space-y-4">
                {recentTransactions.filter(t => t.type === "debit").map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg flex-shrink-0 bg-red-50">
                        <CreditCard className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-800">{transaction.description}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-red-600">{transaction.amount}</span>
                    </div>
                  </div>
                ))}
                {recentTransactions.filter(t => t.type === "debit").length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <DollarSign className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No debits found</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                      You don't have any debit transactions in the selected period.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mt-8">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-50">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-800">Payment Methods</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Manage your payment options</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Add Method
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 9.51V12.5H2V9.51C2 8.12 3.12 7 4.51 7H19.5C20.88 7 22 8.12 22 9.51Z" fill="#1A56DB" />
                      <path d="M22 12.5V14.49C22 15.88 20.88 17 19.49 17H4.5C3.12 17 2 15.88 2 14.49V12.5H22Z" fill="#1A56DB" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Visa ending in 4242</h3>
                    <p className="text-sm text-gray-500">Expires 12/2025</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">Default</Badge>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 shadow-sm hover:shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-50 rounded-md">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#D40915" />
                      <path d="M9.5 9.5C9.5 8.12 10.62 7 12 7C13.38 7 14.5 8.12 14.5 9.5C14.5 10.88 13.38 12 12 12C10.62 12 9.5 10.88 9.5 9.5Z" fill="#D40915" />
                      <path d="M12 14C9.33 14 7 15.34 7 17H17C17 15.34 14.67 14 12 14Z" fill="#D40915" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Mastercard ending in 8888</h3>
                    <p className="text-sm text-gray-500">Expires 09/2024</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Set Default
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Schedule */}
      <Card className="bg-gradient-to-r from-red-50 to-white border border-gray-100 shadow-sm mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Payout Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Next Payout</h3>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">$2,500</div>
              <p className="text-sm text-gray-600">
                Scheduled for June 15, 2024
              </p>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Payout Method</h3>
                <div className="bg-green-50 p-2 rounded-lg">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="text-lg font-medium text-gray-800 mb-1">Bank Account (****6789)</div>
              <p className="text-sm text-gray-600">
                2-3 business days processing
              </p>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">Payout Frequency</h3>
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="text-lg font-medium text-gray-800 mb-1">Monthly</div>
              <p className="text-sm text-gray-600">
                Every 15th of the month
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm"
            >
              Update Payout Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Tax Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="font-medium text-gray-800 mb-1">Tax Documents</h3>
                <p className="text-sm text-gray-600">
                  Your tax documents for the current fiscal year
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download 1099-K
                </Button>
                <Button
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm"
                >
                  Update Tax Info
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-800 mb-4">Tax Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between p-3 border-b border-gray-100">
                <span className="text-gray-600">Total Taxable Income</span>
                <span className="font-medium text-gray-800">$10,850</span>
              </div>
              <div className="flex justify-between p-3 border-b border-gray-100">
                <span className="text-gray-600">Estimated Tax Rate</span>
                <span className="font-medium text-gray-800">15%</span>
              </div>
              <div className="flex justify-between p-3 border-b border-gray-100">
                <span className="text-gray-600">Estimated Tax Due</span>
                <span className="font-medium text-gray-800">$1,627.50</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-gray-600">Tax Filing Deadline</span>
                <span className="font-medium text-gray-800">April 15, 2025</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Insights */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stall Bookings</span>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">$7,500</span>
                    <span className="text-xs text-gray-500">(65%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Sales Commission</span>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">$2,800</span>
                    <span className="text-xs text-gray-500">(25%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Additional Services</span>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">$1,000</span>
                    <span className="text-xs text-gray-500">(10%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-4">Expense Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Fees</span>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">$1,130</span>
                    <span className="text-xs text-gray-500">(40%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Payment Processing</span>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">$850</span>
                    <span className="text-xs text-gray-500">(30%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Maintenance Fees</span>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">$565</span>
                    <span className="text-xs text-gray-500">(20%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Other Expenses</span>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 mr-2">$282</span>
                    <span className="text-xs text-gray-500">(10%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="font-medium text-gray-800 mb-1">Net Profit Margin</h3>
                <p className="text-sm text-gray-600">
                  Your profit after all expenses
                </p>
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-2xl font-bold text-gray-800">68.5%</div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 flex items-center gap-1 px-2 py-0.5 mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    5.2%
                  </Badge>
                </div>
                <div className="h-16 w-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                  <span className="text-green-600 font-bold">Good</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Resources */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Help & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <h3 className="font-medium text-gray-800 mb-2">Tax Guidelines</h3>
              <p className="text-sm text-gray-600 mb-4">
                Learn about tax obligations for stall owners and how to properly report your earnings.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                View Guide
              </Button>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <h3 className="font-medium text-gray-800 mb-2">Financial Planning</h3>
              <p className="text-sm text-gray-600 mb-4">
                Tips and strategies to maximize your profits and plan for future growth.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Read Article
              </Button>
            </div>

            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <h3 className="font-medium text-gray-800 mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Need help with your earnings or have questions about payments? Our team is here to help.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-sm"
              >
                Get Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsView;