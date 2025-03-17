import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Users, Calendar, DollarSign, AlertCircle, TrendingUp, ArrowUp, Activity, Clock } from "lucide-react";
import { DashboardService } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await DashboardService.getAdminStats();
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: string) => {
    return parseFloat(value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-500 text-sm font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const totalUsers = dashboardData?.userStats?.reduce((acc, curr) => acc + parseInt(curr.count), 0) || 0;

  // Prepare chart data
  const userChartData = dashboardData?.userStats?.map((stat: any) => ({
    name: stat.month,
    users: parseInt(stat.count),
  })) || [];

  return (
    <div className="space-y-8 pb-8 ml-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage your platform's performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{totalUsers}</div>
            <div className="flex items-center mt-1">
              <Badge variant="default" className="text-xs text-white font-normal">
                <ArrowUp className="h-3 w-3 mr-1" />
                {dashboardData?.userStats?.length}
              </Badge>
              <p className="text-xs text-gray-500 ml-2">this month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Events</CardTitle>
            <div className="bg-blue-50 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{dashboardData?.eventStats?.upcoming_events}</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs font-normal text-gray-600 border-gray-200">
                <Clock className="h-3 w-3 mr-1" />
                Upcoming events
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <div className="bg-green-50 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{formatCurrency(dashboardData?.revenueStats?.total_revenue)}</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs font-normal text-green-600 border-green-200 bg-green-50">
                <TrendingUp className="h-3 w-3 mr-1" />
                Platform revenue
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Verifications</CardTitle>
            <div className="bg-amber-50 p-2 rounded-full">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{dashboardData?.pendingVerifications?.events}</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs font-normal text-amber-600 border-amber-200 bg-amber-50">
                <Users className="h-3 w-3 mr-1" />
                {dashboardData?.pendingVerifications?.users} users
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Transactions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* User Growth Chart */}
        <Card className="md:col-span-3 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="pb-4 border-b border-gray-50">
            <CardTitle className="text-xl font-semibold text-gray-800">User Growth</CardTitle>
            <CardDescription className="text-gray-500">Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="name"
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
                  <Bar
                    dataKey="users"
                    fill="#D40915"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="md:col-span-4 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <CardHeader className="pb-4 border-b border-gray-50">
            <CardTitle className="text-xl font-semibold text-gray-800">Recent Transactions</CardTitle>
            <CardDescription className="text-gray-500">Latest financial activities on the platform</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {dashboardData?.recentTransactions?.length > 0 ? (
                  dashboardData.recentTransactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${transaction.status === 'completed' ? 'bg-green-50' :
                            transaction.status === 'pending' ? 'bg-amber-50' : 'bg-gray-50'
                            }`}>
                            <DollarSign className={`h-5 w-5 ${transaction.status === 'completed' ? 'text-green-500' :
                              transaction.status === 'pending' ? 'text-amber-500' : 'text-gray-500'
                              }`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{transaction.item_name}</p>
                            <p className="text-sm text-gray-500">{transaction.user_name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-800">{formatCurrency(transaction.amount)}</div>
                          <div className="flex items-center justify-end mt-1">
                            <Badge className={`text-xs font-normal ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {transaction.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {transaction.payment_date ? formatDate(transaction.payment_date) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Activity className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-1">No Transactions Yet</h3>
                    <p className="text-gray-500 max-w-xs">
                      There are no recent transactions to display at this time.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {dashboardData?.recentTransactions?.length > 0 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="text-sm border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  View All Transactions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Platform Statistics */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-50">
          <CardTitle className="text-xl font-semibold text-gray-800">Platform Statistics</CardTitle>
          <CardDescription className="text-gray-500">Overall system performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium text-gray-800">Total Events</h3>
              </div>
              <div className="pl-11">
                <div className="text-2xl font-bold text-gray-800">
                  {dashboardData?.eventStats?.total_events || 0}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {dashboardData?.eventStats?.completed_events || 0} completed
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-green-50 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-800">Total Revenue</h3>
              </div>
              <div className="pl-11">
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(dashboardData?.revenueStats?.total_revenue || "0")}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatCurrency(dashboardData?.revenueStats?.this_month_revenue || "0")} this month
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-amber-50 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-medium text-gray-800">User Verifications</h3>
              </div>
              <div className="pl-11">
                <div className="text-2xl font-bold text-gray-800">
                  {dashboardData?.pendingVerifications?.users || 0}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  pending approvals
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-800">Event Verifications</h3>
              </div>
              <div className="pl-11">
                <div className="text-2xl font-bold text-gray-800">
                  {dashboardData?.pendingVerifications?.events || 0}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  pending approvals
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-50">
          <CardTitle className="text-xl font-semibold text-gray-800">Recent Activities</CardTitle>
          <CardDescription className="text-gray-500">Latest system activities and logs</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {dashboardData?.recentActivities?.length > 0 ? (
                dashboardData.recentActivities.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${activity.type === 'user' ? 'bg-blue-50' :
                      activity.type === 'event' ? 'bg-purple-50' :
                        activity.type === 'payment' ? 'bg-green-50' : 'bg-gray-50'
                      }`}>
                      {activity.type === 'user' ? (
                        <Users className="h-5 w-5 text-blue-600" />
                      ) : activity.type === 'event' ? (
                        <Calendar className="h-5 w-5 text-purple-600" />
                      ) : activity.type === 'payment' ? (
                        <DollarSign className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-gray-800">{activity.description}</p>
                        <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                      {activity.user && (
                        <div className="flex items-center mt-2">
                          <div className="bg-gray-100 h-5 w-5 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-medium text-gray-700">{activity.user.charAt(0)}</span>
                          </div>
                          <span className="text-xs text-gray-600">{activity.user}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No Recent Activities</h3>
                  <p className="text-gray-500 max-w-xs">
                    There are no recent activities to display at this time.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {dashboardData?.recentActivities?.length > 0 && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="text-sm border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                View All Activities
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4 border-b border-gray-50">
          <CardTitle className="text-xl font-semibold text-gray-800">Quick Actions</CardTitle>
          <CardDescription className="text-gray-500">Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <Users className="h-6 w-6 text-primary" />
              <span>Verify Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <Calendar className="h-6 w-6 text-blue-500" />
              <span>Verify Events</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <DollarSign className="h-6 w-6 text-green-500" />
              <span>View Transactions</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
            >
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <span>System Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;