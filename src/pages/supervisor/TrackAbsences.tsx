
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, X, Search, FileText, Send, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const TrackAbsences = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { absences, classes, students, updateAbsenceStatus } = useData();
  const { toast } = useToast();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedAbsence, setSelectedAbsence] = useState<string | null>(null);
  const [notificationText, setNotificationText] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [detailsAbsence, setDetailsAbsence] = useState<any>(null);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const absenceId = queryParams.get('id');
  const classId = queryParams.get('class');
  
  useEffect(() => {
    if (absenceId) {
      setSelectedAbsence(absenceId);
    }
    
    if (classId) {
      setClassFilter(classId);
    }
  }, [absenceId, classId]);
  
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 
           studentId === "1" ? "Ahmed Hassan" : 
           studentId === "2" ? "Mohammed Ali" : 
           studentId === "3" ? "Fatima Zahra" : `Student ${studentId}`;
  };
  
  const getClassName = (classId: string) => {
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.name : 'Class A';
  };

  const getStudentClass = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `Class ${student.class || 'A'}` : 
           studentId === "1" ? "Class A" : 
           studentId === "2" ? "Class A" : 
           studentId === "3" ? "Class A" : "Unknown Class";
  };
  
  const filteredAbsences = absences.filter(absence => {
    const matchesSearch = 
      absence.subject.toLowerCase().includes(search.toLowerCase()) ||
      absence.date.toLowerCase().includes(search.toLowerCase()) ||
      getStudentName(absence.studentId).toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || absence.status === statusFilter;
    
    const matchesClass = classFilter === 'all' || true; // In a real app, you would check if the student belongs to the selected class
    
    return matchesSearch && matchesStatus && matchesClass;
  });
  
  const handleApprove = (id: string) => {
    updateAbsenceStatus(id, 'justified');
    
    toast({
      title: "Absence justifiée",
      description: "L'absence a été marquée comme justifiée.",
    });
    
    // Show notification dialog
    setSelectedAbsence(id);
    setNotificationText(`L'absence a été justifiée. Souhaitez-vous envoyer une notification à l'étudiant?`);
    setShowDialog(true);
  };
  
  const handleReject = (id: string) => {
    updateAbsenceStatus(id, 'unjustified');
    
    toast({
      title: "Absence non justifiée",
      description: "L'absence a été marquée comme non justifiée.",
    });
    
    // Show notification dialog
    setSelectedAbsence(id);
    setNotificationText(`L'absence a été marquée comme non justifiée. Souhaitez-vous envoyer une notification à l'étudiant?`);
    setShowDialog(true);
  };
  
  const handleSendNotification = () => {
    toast({
      title: "Notification envoyée",
      description: "L'étudiant a été notifié par SMS.",
    });
    
    setShowDialog(false);
    setSelectedAbsence(null);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'justified':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">Justifiée</Badge>;
      case 'unjustified':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400">Non justifiée</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (absence: any) => {
    setDetailsAbsence(absence);
    setShowDetailsDialog(true);
  };

  const viewStudentProfile = (studentId: string) => {
    navigate(`/student-details/${studentId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Absence Tracking</h1>
        <p className="text-muted-foreground">
          Monitor and manage student absences
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by student name or ID..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending Claims 
            <span className="ml-1 rounded-full bg-amber-500 h-5 w-5 text-[10px] flex items-center justify-center text-white">
              {absences.filter(a => a.status === 'pending').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="recent">Recent Absences</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Absence Claims</CardTitle>
              <CardDescription>
                Review and approve or reject student absence justifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAbsences.filter(a => a.status === 'pending').length > 0 ? (
                <div className="space-y-4">
                  {filteredAbsences
                    .filter(a => a.status === 'pending')
                    .map((absence) => (
                      <div
                        key={absence.id}
                        className="p-4 border rounded-md"
                      >
                        <div className="flex justify-between flex-wrap gap-4">
                          <div>
                            <div className="font-medium">{getStudentName(absence.studentId)}</div>
                            <div className="text-sm">ID: {absence.studentId} | {getStudentClass(absence.studentId)}</div>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
                        </div>
                        
                        <div className="mt-3">
                          <div className="text-sm font-medium">{absence.subject} - {new Date(absence.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                          <div className="mt-1 text-sm">
                            <span className="font-medium">Reason:</span> {absence.reason || 'Medical Issue'}
                          </div>
                          
                          {absence.documentUrl && (
                            <div className="mt-2">
                              <Button size="sm" variant="outline" className="text-xs h-7">
                                <FileText className="mr-1 h-3 w-3" />
                                medical-certificate.pdf
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-end gap-2">
                          <Button
                            onClick={() => handleApprove(absence.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleReject(absence.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending absence claims found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Absences</CardTitle>
              <CardDescription>
                Recently recorded absences across all classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {absences.slice(0, 5).map((absence) => (
                  <div
                    key={absence.id}
                    className="p-4 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{getStudentName(absence.studentId)}</div>
                      <div className="text-sm">{absence.subject} - {new Date(absence.date).toLocaleDateString('en-US')}</div>
                      <div className="mt-1">{getStatusBadge(absence.status)}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(absence)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Absence History</CardTitle>
              <CardDescription>
                Complete history of all absences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Notification Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              {notificationText}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Write a message to the student..."
                defaultValue="Dear student, your absence claim has been processed. Please check your student portal for details."
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} className="bg-emsi-green hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" />
              Send SMS Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Absence Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Absence Details</DialogTitle>
            <DialogDescription>
              Complete information about this absence
            </DialogDescription>
          </DialogHeader>
          
          {detailsAbsence && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  className="rounded-full h-10 w-10 p-0"
                  onClick={() => viewStudentProfile(detailsAbsence.studentId)}
                >
                  <User className="h-4 w-4" />
                </Button>
                <div>
                  <h3 className="font-medium">{getStudentName(detailsAbsence.studentId)}</h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {detailsAbsence.studentId} | {getStudentClass(detailsAbsence.studentId)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Subject</p>
                  <p>{detailsAbsence.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p>{new Date(detailsAbsence.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p>{detailsAbsence.time || '10:00 - 12:00'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p>{getStatusBadge(detailsAbsence.status)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="mt-1">{detailsAbsence.reason || 'Medical Issue'}</p>
              </div>
              
              {detailsAbsence.documentUrl && (
                <div>
                  <p className="text-sm font-medium">Supporting Document</p>
                  <Button size="sm" variant="outline" className="mt-1">
                    <FileText className="mr-2 h-4 w-4" />
                    View Document
                  </Button>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium">Additional Notes</p>
                <p className="mt-1 text-muted-foreground">
                  {detailsAbsence.notes || 'No additional notes provided.'}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {detailsAbsence && detailsAbsence.status === 'pending' && (
              <>
                <Button 
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => {
                    handleReject(detailsAbsence.id);
                    setShowDetailsDialog(false);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleApprove(detailsAbsence.id);
                    setShowDetailsDialog(false);
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrackAbsences;
