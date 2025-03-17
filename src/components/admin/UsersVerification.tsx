import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, X, FileText, ExternalLink, Building, Globe, FileIcon, CreditCard, FileCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserService } from "../../lib/api";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  // Add a function to determine document type
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
    return <div className="text-center py-8">Loading verifications...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              {users.map((user) => (
                <Collapsible key={user.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{`${user.first_name} ${user.last_name}`}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="capitalize">
                          {user.role.replace(/_/g, ' ')}
                        </Badge>
                        <p className="text-xs text-muted-foreground ml-2">
                          Registered: {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600"
                        onClick={() => handleVerification(user.id, 'verified')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => openRejectionDialog(user.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>

                  {user.role === 'event_organizer' && (
                    <>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full justify-start mt-2">
                          <FileText className="h-4 w-4 mr-2" />
                          View Organizer Details
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4 space-y-4 bg-gray-50 p-4 rounded-md">
                        {/* Organization Details */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            Organization Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                            <div>
                              <p className="text-xs text-muted-foreground">Organization Name</p>
                              <p className="text-sm">{user.organization_name || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Tax ID</p>
                              <p className="text-sm">{user.tax_id || 'Not provided'}</p>
                            </div>
                            {user.website && (
                              <div className="col-span-2">
                                <p className="text-xs text-muted-foreground flex items-center">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Website
                                </p>
                                <a
                                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center"
                                >
                                  {user.website}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground">Description</p>
                              <p className="text-sm">{user.description || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Event Types */}
                        {user.event_types && user.event_types.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Event Types</h4>
                            <div className="flex flex-wrap gap-2 pl-6">
                              {user.event_types.map((type, index) => (
                                <Badge key={index} variant="outline">{type}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Documents */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center">
                            <FileIcon className="h-4 w-4 mr-2" />
                            Verification Documents
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                            {user.pan_card_path && (
                              <div className="border rounded p-3 bg-white">
                                <p className="text-xs text-muted-foreground flex items-center mb-2">
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  PAN Card
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 p-0 h-auto hover:text-blue-800"
                                  onClick={() => openDocumentDialog(user.pan_card_path, "PAN Card")}
                                >
                                  View Document
                                  <FileText className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            )}

                            {user.canceled_check_path && (
                              <div className="border rounded p-3 bg-white">
                                <p className="text-xs text-muted-foreground flex items-center mb-2">
                                  <FileCheck className="h-3 w-3 mr-1" />
                                  Canceled Check
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 p-0 h-auto hover:text-blue-800"
                                  onClick={() => openDocumentDialog(user.canceled_check_path, "Canceled Check")}
                                >
                                  View Document
                                  <FileText className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            )}

                            {user.agreement_path && (
                              <div className="border rounded p-3 bg-white">
                                <p className="text-xs text-muted-foreground flex items-center mb-2">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Agreement
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 p-0 h-auto hover:text-blue-800"
                                  onClick={() => openDocumentDialog(user.agreement_path, "Agreement")}
                                >
                                  View Document
                                  <FileText className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </>
                  )}
                </Collapsible>
              ))}
              {users.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No pending verifications
                </p>
              )}
            </div>
          </ScrollArea>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Document Viewer Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
            {selectedDocument && (
              <>
                {getDocumentType(selectedDocument.url) === 'image' ? (
                  <div className="max-h-[60vh] flex items-center justify-center">
                    <img
                      src={selectedDocument.url}
                      alt={selectedDocument.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : getDocumentType(selectedDocument.url) === 'pdf' ? (
                  <iframe
                    src={`${selectedDocument.url}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-full border-0"
                    title={selectedDocument.title}
                  />
                ) : (
                  <div className="text-center">
                    <p>This document type cannot be previewed.</p>
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedDocument.url, '_blank')}
                      className="mt-4"
                    >
                      Open in New Tab
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => window.open(selectedDocument?.url, '_blank')}
              className="mr-2"
            >
              Open in New Tab
              <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
            <Button onClick={() => setSelectedDocument(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Note Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-note">Rejection Reason</Label>
              <Textarea
                id="rejection-note"
                placeholder="Please provide a reason for rejection (e.g., 'Invalid PAN card', 'Blurry documents', etc.)"
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setRejectionDialogOpen(false);
                setRejectionNote("");
                setSelectedUserId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => selectedUserId && handleVerification(selectedUserId, 'rejected', rejectionNote)}
              disabled={!rejectionNote.trim()}
            >
              Reject Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersVerification;