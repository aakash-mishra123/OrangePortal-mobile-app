import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { type Lead, type UserActivity } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Mail, Phone, Calendar, TrendingUp, Users, MessageSquare, Activity, Eye, Search, LogOut, Rocket, Clock, CheckCircle2, AlertCircle, Filter } from "lucide-react";
import { format } from "date-fns";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<UserActivity[]>({
    queryKey: ["/api/admin/activities"],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  const handleLogout = () => {
    // Simple logout - redirect to admin login
    setLocation("/admin-login");
  };

  const exportToCSV = () => {
    if (!leads || leads.length === 0) return;

    const headers = ["Date", "Name", "Email", "Phone", "Service", "Message", "Status"];
    const csvData = leads.map(lead => [
      format(new Date(lead.createdAt), "yyyy-MM-dd HH:mm"),
      lead.name,
      lead.email,
      lead.phone,
      lead.serviceName,
      lead.message || "",
      "New"
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appkickstart-leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter leads based on search and status
  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const isLoading = leadsLoading || activitiesLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="h-16 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalLeads = leads?.length || 0;
  const recentLeads = leads?.filter(lead => {
    const leadDate = new Date(lead.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return leadDate >= weekAgo;
  }).length || 0;

  const serviceBreakdown = leads?.reduce((acc, lead) => {
    acc[lead.serviceName] = (acc[lead.serviceName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topService = Object.entries(serviceBreakdown).sort(([,a], [,b]) => b - a)[0];

  // User activity analytics
  const totalActivities = analytics?.totalActivities || 0;
  const serviceViews = analytics?.serviceViews || 0;
  const categoryBrowses = analytics?.categoryBrowses || 0;
  const serviceInquiries = analytics?.serviceInquiries || 0;

  return (
    <div className="min-h-screen bg-om-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-om-blue mb-2">Admin Dashboard</h1>
            <p className="text-om-gray-500">Manage leads and track user activity analytics</p>
          </div>
          <Button 
            onClick={exportToCSV}
            className="bg-om-orange text-white hover:bg-orange-600"
            disabled={!leads || leads.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-om-gray-600">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-om-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-om-blue">{totalLeads}</div>
              <p className="text-xs text-om-gray-500">All time inquiries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-om-gray-600">User Activities</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-om-blue">{totalActivities}</div>
              <p className="text-xs text-om-gray-500">Total user interactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-om-gray-600">Service Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-om-blue">{serviceViews}</div>
              <p className="text-xs text-om-gray-500">Pages viewed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-om-gray-600">Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-om-blue">{serviceInquiries}</div>
              <p className="text-xs text-om-gray-500">Form submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leads">Lead Management</TabsTrigger>
            <TabsTrigger value="activities">User Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-om-blue">Recent Leads</CardTitle>
                <CardDescription>All customer inquiries and contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {!leads || leads.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-om-gray-500">No leads found. Customer inquiries will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Service Interest</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-om-gray-400 mr-2" />
                                {format(new Date(lead.createdAt), "MMM dd, yyyy")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-om-blue">{lead.name}</div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center text-sm">
                                  <Mail className="h-3 w-3 text-om-gray-400 mr-1" />
                                  {lead.email}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Phone className="h-3 w-3 text-om-gray-400 mr-1" />
                                  {lead.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {lead.serviceName}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate text-sm text-om-gray-600">
                                {lead.message || "No message provided"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(`mailto:${lead.email}`)}
                                >
                                  Reply
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-om-blue">User Activity Tracking</CardTitle>
                <CardDescription>Monitor all user interactions and service browsing patterns</CardDescription>
              </CardHeader>
              <CardContent>
                {!activities || activities.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-om-gray-500">No user activities recorded yet. User interactions will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Activity Type</TableHead>
                          <TableHead>Service/Category</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 text-om-gray-400 mr-2" />
                                {format(new Date(activity.createdAt), "MMM dd, HH:mm")}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {activity.userId ? (
                                  <span className="text-green-600 font-medium">Registered User</span>
                                ) : (
                                  <span className="text-om-gray-500">Guest User</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  activity.activityType === 'service_view' ? 'default' :
                                  activity.activityType === 'service_inquiry' ? 'destructive' :
                                  'secondary'
                                }
                                className="text-xs"
                              >
                                {activity.activityType.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {activity.serviceId && (
                                  <div className="text-om-blue">Service: {activity.serviceId}</div>
                                )}
                                {activity.categoryId && (
                                  <div className="text-purple-600">Category: {activity.categoryId}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs text-om-gray-500 max-w-xs">
                                IP: {activity.ipAddress || 'N/A'}
                                {activity.metadata && typeof activity.metadata === 'object' && (
                                  <div className="mt-1">
                                    {JSON.stringify(activity.metadata, null, 1).slice(0, 100)}...
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}