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

export default function AdminDashboard() {
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
      "New Kickstart Request"
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

  // Filter leads based on search
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return leadDate >= today;
  }).length || 0;

  const serviceBreakdown = leads?.reduce((acc, lead) => {
    acc[lead.serviceName] = (acc[lead.serviceName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const topService = Object.entries(serviceBreakdown).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="animate-in slide-in-from-left-6 duration-500">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AppKickstart Admin
                </h1>
              </div>
              <p className="text-gray-600 ml-13">
                Monitor leads and track platform performance
              </p>
            </div>
            <div className="flex items-center space-x-4 animate-in slide-in-from-right-6 duration-500">
              <Button onClick={exportToCSV} variant="outline" className="hover:bg-blue-50 transition-colors duration-200">
                <Download className="h-4 w-4 mr-2" />
                Export Leads
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 animate-in slide-in-from-left-4 duration-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Leads</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{totalLeads}</div>
              <p className="text-xs text-blue-600 mt-1">All time requests</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Today's Leads</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800">{recentLeads}</div>
              <p className="text-xs text-green-600 mt-1">New today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Top Service</CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-orange-800 truncate">
                {topService?.[0] || 'No data'}
              </div>
              <p className="text-xs text-orange-600 mt-1">
                {topService?.[1] || 0} requests
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: '300ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Response Time</CardTitle>
              <Clock className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800">5 min</div>
              <p className="text-xs text-purple-600 mt-1">Average call time</p>
            </CardContent>
          </Card>
        </div>

        {/* Leads Management */}
        <Card className="animate-in slide-in-from-bottom-6 duration-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">Kickstart Requests</CardTitle>
                <CardDescription>Manage and track all project kickstart requests</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Date & Time</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Service & Resource</TableHead>
                    <TableHead className="font-semibold">Project Details</TableHead>
                    <TableHead className="font-semibold">Budget & Timeline</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No leads match your search.' : 'No kickstart requests yet.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {format(new Date(lead.createdAt), "MMM dd, yyyy")}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(lead.createdAt), "hh:mm a")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Badge variant="outline" className="font-medium">
                              {lead.serviceName}
                            </Badge>
                            {lead.resourceType && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Resource:</span> {lead.resourceType}
                              </div>
                            )}
                            {lead.experienceLevel && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Level:</span> {lead.experienceLevel}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="space-y-1">
                            {lead.projectDetails && (
                              <div className="text-sm text-gray-700 truncate" title={lead.projectDetails}>
                                {lead.projectDetails.length > 100 
                                  ? `${lead.projectDetails.substring(0, 100)}...` 
                                  : lead.projectDetails}
                              </div>
                            )}
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Mail className="h-3 w-3" />
                              <span>{lead.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Phone className="h-3 w-3" />
                              <span>{lead.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {lead.budget && (
                              <div className="text-gray-700">
                                <span className="font-medium">Budget:</span> {lead.budget}
                              </div>
                            )}
                            {lead.projectDuration && (
                              <div className="text-gray-600">
                                <span className="font-medium">Duration:</span> {lead.projectDuration}
                              </div>
                            )}
                            {lead.timeFrame && (
                              <div className="text-gray-600">
                                <span className="font-medium">Start:</span> {lead.timeFrame}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <Rocket className="h-3 w-3 mr-1" />
                            Kickstarted
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="h-8">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}