import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, X, FileText, ExternalLink, Building, Globe, FileIcon, CreditCard, FileCheck, User, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserService } from "../../lib/api";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
  verification_status: string;
  organization_name: string | null;
  website: string | null;
  description: string | null;
  tax_id: string | null;
  event_types: string[] | null;
  pan_card_path: string | null;
  canceled_check_path: string | null;
  agreement_path: string | null;
}

const UsersVerification = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string, title: string } | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [approvalNote, setApprovalNote] = useState("");
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await UserService.getPendingUsers({ page: currentPage });
        console.log({ response });

        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load pending verifications",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, [currentPage]);

  const handleVerification = async (userId: string, status: string, note?: string) => {
    try {
      await UserService.verifyUser(userId, status, note);
      toast({
        title: `User ${status === 'verified' ? 'Verified' : 'Rejected'}`,
        description: `User verification has been ${status === 'verified' ? 'approved' : 'rejected'}`
      });
      setUsers(prev => prev.filter(user => user.id !== userId));
      setRejectionDialogOpen(false);
      setRejectionNote("");
      setSelectedUserId(null);
    } catch (error) {
      toast({
        title: "Operation Failed",
        description: `Failed to ${status === 'verified' ? 'verify' : 'reject'} user`,
        variant: "destructive"
      });
    }
  };

  const openRejectionDialog = (userId: string) => {
    setSelectedUserId(userId);
    setRejectionDialogOpen(true);
  };

  const openApprovalDialog = (userId: string) => {
    setSelectedUserId(userId);
    setApprovalDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDocumentType = (path: string): 'image' | 'pdf' | 'other' => {
    const lowerPath = path.toLowerCase();
    if (lowerPath.endsWith('.pdf')) return 'pdf';
    if (lowerPath.endsWith('.png') || lowerPath.endsWith('.jpg') ||
      lowerPath.endsWith('.jpeg') || lowerPath.endsWith('.gif')) return 'image';
    return 'other';
  };

  const getDocumentUrl = (path: string | null) => {
    if (!path) return null;
    return `http://localhost:3000/uploads/organizers/${path}`;
  };

  const openDocumentDialog = (path: string | null, title: string) => {
    if (!path) return;
    setSelectedDocument({
      url: getDocumentUrl(path) as string,
      title
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-500 text-sm font-medium">Loading verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 ml-4">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">User Verification</h1>
        <p className="text-gray-600">Review and approve user verification requests.</p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-50">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-500" />
            Pending Verifications ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Collapsible className="border border-gray-100 rounded-xl p-5 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-800 text-lg">{`${user.first_name} ${user.last_name}`}</h3>
                        <p className="text-gray-500 flex items-center">
                          <Globe className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          {user.email}
                        </p>
                        <div className="flex items-center mt-2 space-x-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 capitalize">
                            {user.role.replace(/_/g, ' ')}
                          </Badge>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            Registered: {formatDate(user.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300"
                          onClick={() => handleVerification(user.id, 'verified')}
                        >
                          <Check className="h-4 w-4 mr-1.5" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300"
                          onClick={() => openRejectionDialog(user.id)}
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Reject
                        </Button>
                      </div>
                    </div>

                    {user.role === 'event_organizer' && (
                      <>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 transition-colors duration-300"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Organizer Details
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4 space-y-6 bg-blue-50/30 backdrop-blur-sm p-5 rounded-xl border border-blue-100/50">
                          {/* Organization Details */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-800 flex items-center">
                              <Building className="h-4 w-4 mr-2 text-blue-500" />
                              Organization Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-6 bg-white/70 p-4 rounded-lg">
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Organization Name</p>
                                <p className="text-sm text-gray-800">{user.organization_name || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Tax ID</p>
                                <p className="text-sm text-gray-800">{user.tax_id || 'Not provided'}</p>
                              </div>
                              {user.website && (
                                <div className="col-span-2">
                                  <p className="text-xs font-medium text-gray-500 flex items-center mb-1">
                                    <Globe className="h-3 w-3 mr-1 text-blue-500" />
                                    Website
                                  </p>
                                  <a
                                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center transition-colors duration-300"
                                  >
                                    {user.website}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </div>
                              )}
                              <div className="col-span-2">
                                <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                                <p className="text-sm text-gray-800 bg-white/50 p-3 rounded-md">{user.description || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Event Types */}
                          {user.event_types && user.event_types.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-gray-800 flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                Event Types
                              </h4>
                              <div className="flex flex-wrap gap-2 pl-6 bg-white/70 p-4 rounded-lg">
                                {user.event_types.map((type, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-blue-50/70 text-blue-700 border-blue-200"
                                  >
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Documents */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-800 flex items-center">
                              <FileIcon className="h-4 w-4 mr-2 text-blue-500" />
                              Verification Documents
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                              {user.pan_card_path && (
                                <div className="border border-gray-100 rounded-lg p-4 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                                  <p className="text-xs font-medium text-gray-500 flex items-center mb-3">
                                    <CreditCard className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                    PAN Card
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                                    onClick={() => openDocumentDialog(user.pan_card_path, "PAN Card")}
                                  >
                                    View Document
                                    <FileText className="h-3.5 w-3.5 ml-1.5" />
                                  </Button>
                                </div>
                              )}

                              {user.canceled_check_path && (
                                <div className="border border-gray-100 rounded-lg p-4 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                                  <p className="text-xs font-medium text-gray-500 flex items-center mb-3">
                                    <FileCheck className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                    Canceled Check
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                                    onClick={() => openDocumentDialog(user.canceled_check_path, "Canceled Check")}
                                  >
                                    View Document
                                    <FileText className="h-3.5 w-3.5 ml-1.5" />
                                  </Button>
                                </div>
                              )}

                              {user.agreement_path && (
                                <div className="border border-gray-100 rounded-lg p-4 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                                  <p className="text-xs font-medium text-gray-500 flex items-center mb-3">
                                    <FileCheck className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                    Agreement Document
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                                    onClick={() => openDocumentDialog(user.agreement_path, "Agreement Document")}
                                  >
                                    View Document
                                    <FileText className="h-3.5 w-3.5 ml-1.5" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </>
                    )}
                  </Collapsible>
                </motion.div>
              ))}

              {users.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-50 p-3 mb-4">
                    <Check className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No pending verifications</h3>
                  <p className="text-gray-500 max-w-sm">
                    All user verification requests have been processed. Check back later for new submissions.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{selectedDocument.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 flex justify-center">
                {getDocumentType(selectedDocument.url) === 'image' ? (
                  <img
                    src={selectedDocument.url}
                    alt={selectedDocument.title}
                    className="max-w-full max-h-[70vh] object-contain rounded-md shadow-md"
                  />
                ) : getDocumentType(selectedDocument.url) === 'pdf' ? (
                  <iframe
                    src={selectedDocument.url}
                    title={selectedDocument.title}
                    className="w-full h-[70vh] rounded-md shadow-md"
                  />
                ) : (
                  <div className="p-8 bg-gray-50 rounded-lg text-center">
                    <FileIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      This document type cannot be previewed. Please download to view.
                    </p>
                    <Button
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open(selectedDocument.url, '_blank')}
                    >
                      Download Document
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Reject Verification</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Label htmlFor="rejection-note" className="text-sm font-medium text-gray-700">
              Provide a reason for rejection (optional)
            </Label>
            <Textarea
              id="rejection-note"
              placeholder="Explain why this verification is being rejected..."
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              className="mt-2 min-h-[120px]"
            />
          </div>
          <DialogFooter className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setRejectionDialogOpen(false);
                setRejectionNote("");
                setSelectedUserId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => selectedUserId && handleVerification(selectedUserId, 'rejected', rejectionNote)}
            >
              <X className="h-4 w-4 mr-2" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Approve Verification</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Label htmlFor="approval-note" className="text-sm font-medium text-gray-700">
              Add a note (optional)
            </Label>
            <Textarea
              id="approval-note"
              placeholder="Add any notes for the user..."
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              className="mt-2 min-h-[120px]"
            />
          </div>
          <DialogFooter className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setApprovalDialogOpen(false);
                setApprovalNote("");
                setSelectedUserId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => selectedUserId && handleVerification(selectedUserId, 'verified', approvalNote)}
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersVerification;