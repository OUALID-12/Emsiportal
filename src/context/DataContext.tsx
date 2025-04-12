
import { createContext, useState, useContext, ReactNode } from 'react';
import { Absence, Class, Course, ChatMessage, User } from '../types';

// Mock data
const mockAbsences: Absence[] = [
  {
    id: '1',
    studentId: '1',
    subject: 'Mathematics',
    date: '2025-04-05',
    time: '10:00 AM',
    status: 'pending',
    reason: 'Medical',
    description: 'Had a fever and could not attend class',
    documentUrl: '/medical-certificate.pdf',
    submittedOn: '2025-04-06',
  },
  {
    id: '2',
    studentId: '1',
    subject: 'Computer Science',
    date: '2025-04-03',
    time: '2:00 PM',
    status: 'unjustified',
  },
  {
    id: '3',
    studentId: '2',
    subject: 'Physics',
    date: '2025-04-02',
    time: '9:00 AM',
    status: 'justified',
    reason: 'Family Emergency',
    description: 'Family emergency required immediate attention',
    submittedOn: '2025-04-03',
  },
];

const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Informatique 3A',
    department: 'Computer Science',
    year: 'Year 3',
    students: ['1', '3', '4', '5']
  },
  {
    id: '2',
    name: 'Génie Civil 2A',
    department: 'Civil Engineering',
    year: 'Year 2',
    students: ['2', '6', '7', '8']
  },
];

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Programmation Web',
    room: 'Salle 101',
    day: 'Lundi',
    startTime: '09:00',
    endTime: '12:00',
    professor: 'Dr. Karim Benali',
  },
  {
    id: '2',
    name: 'Algorithmes Avancés',
    room: 'Salle 102',
    day: 'Mercredi',
    startTime: '08:00',
    endTime: '11:00',
    professor: 'Dr. Fatima Zohra',
  },
  {
    id: '3',
    name: 'Intelligence Artificielle',
    room: 'Salle 305',
    day: 'Jeudi',
    startTime: '09:00',
    endTime: '12:00',
    professor: 'Dr. Ahmed Bensouda',
  },
  {
    id: '4',
    name: 'Réseau',
    room: 'Salle 203',
    day: 'Vendredi',
    startTime: '13:00',
    endTime: '16:00',
    professor: 'Dr. Samira Talbi',
  },
];

// Mock student data
const mockStudents: User[] = [
  {
    id: '1',
    email: 'student@emsi.ma',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    role: 'student',
    studentId: 'ST12345',
    department: 'Computer Science',
    year: '3rd Year',
    class: 'A',
    phoneNumber: '+212 612345678',
    address: '123 University Street, Casablanca',
    profileImage: '',
    absences: 12,
    justifiedAbsences: 8,
  },
  {
    id: '2',
    email: 'student2@emsi.ma',
    firstName: 'Mohammed',
    lastName: 'Ali',
    role: 'student',
    studentId: 'ST12347',
    department: 'Computer Science',
    year: '3rd Year',
    class: 'A',
    phoneNumber: '+212 612345670',
    address: '456 University Avenue, Casablanca',
    profileImage: '',
    absences: 8,
    justifiedAbsences: 4,
  },
  {
    id: '3',
    email: 'student3@emsi.ma',
    firstName: 'Fatima',
    lastName: 'Zahra',
    role: 'student',
    studentId: 'ST12348',
    department: 'Computer Science',
    year: '3rd Year',
    class: 'A',
    phoneNumber: '+212 612345671',
    address: '789 College Road, Casablanca',
    profileImage: '',
    absences: 5,
    justifiedAbsences: 3,
  },
  {
    id: '4',
    email: 'student4@emsi.ma',
    firstName: 'Youssef',
    lastName: 'Benzema',
    role: 'student',
    studentId: 'ST12349',
    department: 'Computer Science',
    year: '3rd Year',
    class: 'A',
    phoneNumber: '+212 612345672',
    address: '101 Education Street, Casablanca',
    profileImage: '',
    absences: 3,
    justifiedAbsences: 2,
  },
];

interface DataContextType {
  absences: Absence[];
  classes: Class[];
  courses: Course[];
  students: User[];
  chatMessages: ChatMessage[];
  addAbsenceClaim: (absence: Omit<Absence, 'id' | 'status'>) => void;
  updateAbsenceStatus: (id: string, status: 'justified' | 'unjustified') => void;
  sendChatMessage: (message: string, role?: string) => void;
  addStudent: (student: any) => void;
  updateStudent: (updatedStudent: any) => void;
  deleteStudent: (studentId: string) => void;
  addTimetableSession: (course: Omit<Course, 'id'>) => void;
  updateTimetableSession: (course: Course) => void;
  deleteTimetableSession: (courseId: string) => void;
  exportStudentsData: () => void;
  updateUserProfile: (userId: string, profileData: Partial<User>) => void;
  updateProfilePicture: (userId: string, pictureUrl: string) => void;
}

const DataContext = createContext<DataContextType>({
  absences: [],
  classes: [],
  courses: [],
  students: [],
  chatMessages: [],
  addAbsenceClaim: () => {},
  updateAbsenceStatus: () => {},
  sendChatMessage: () => {},
  addStudent: () => {},
  updateStudent: () => {},
  deleteStudent: () => {},
  addTimetableSession: () => {},
  updateTimetableSession: () => {},
  deleteTimetableSession: () => {},
  exportStudentsData: () => {},
  updateUserProfile: () => {},
  updateProfilePicture: () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [absences, setAbsences] = useState<Absence[]>(mockAbsences);
  const [classes] = useState<Class[]>(mockClasses);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [students, setStudents] = useState<User[]>(mockStudents);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const addAbsenceClaim = (absence: Omit<Absence, 'id' | 'status'>) => {
    const newAbsence: Absence = {
      ...absence,
      id: `${absences.length + 1}`,
      status: 'pending',
      submittedOn: new Date().toISOString().split('T')[0],
    };

    setAbsences([...absences, newAbsence]);
    return newAbsence;
  };

  const updateAbsenceStatus = (id: string, status: 'justified' | 'unjustified') => {
    setAbsences(
      absences.map((absence) =>
        absence.id === id ? { ...absence, status } : absence
      )
    );
  };

  const sendChatMessage = (message: string, role = 'student') => {
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setChatMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      let botResponse = "Je suis désolé, je ne comprends pas votre question. Essayez de me demander des informations sur les absences, les cours ou l'emploi du temps.";
      
      const messageLower = message.toLowerCase();
      
      // Student related queries
      if (messageLower.includes('absent') || messageLower.includes('absence')) {
        if (role === 'student') {
          const studentAbsences = absences.filter(a => a.studentId === '1');
          const justified = studentAbsences.filter(a => a.status === 'justified').length;
          const unjustified = studentAbsences.filter(a => a.status === 'unjustified').length;
          const pending = studentAbsences.filter(a => a.status === 'pending').length;
          
          botResponse = `Vous avez un total de ${studentAbsences.length} absences ce semestre, dont ${justified} justifiées, ${unjustified} non justifiées et ${pending} en attente de justification.`;
        } else {
          const totalAbsences = absences.length;
          const justified = absences.filter(a => a.status === 'justified').length;
          const unjustified = absences.filter(a => a.status === 'unjustified').length;
          const pending = absences.filter(a => a.status === 'pending').length;
          
          botResponse = `Il y a actuellement ${totalAbsences} absences enregistrées pour tous les étudiants, dont ${justified} sont justifiées, ${unjustified} non justifiées et ${pending} en attente de justification.`;
        }
      } 
      // Timetable related queries
      else if (messageLower.includes('emploi') || messageLower.includes('timetable') || messageLower.includes('cours')) {
        const upcomingCourses = courses.slice(0, 2).map(c => `${c.name} (${c.day} ${c.startTime})`).join(' et ');
        botResponse = `Vous pouvez consulter votre emploi du temps dans la section 'Emploi du temps' dans le menu. Les prochains cours sont ${upcomingCourses}.`;
      } 
      // Class related queries
      else if (messageLower.includes('classe') || messageLower.includes('class')) {
        if (role === 'supervisor') {
          const classesList = classes.map(c => c.name).join(', ');
          botResponse = `Vous supervisez actuellement ${classes.length} classes: ${classesList}. La classe Informatique 3A a le taux d'absences le plus élevé (12%).`;
        } else {
          botResponse = "Vous êtes dans la classe Informatique 3A. Votre classe a un taux de présence de 88%, ce qui est légèrement inférieur à la moyenne de l'école (92%).";
        }
      } 
      // Students specific queries (for supervisor)
      else if (role === 'supervisor' && (messageLower.includes('étudiant') || messageLower.includes('student'))) {
        if (messageLower.includes('nombre') || messageLower.includes('many') || messageLower.includes('combien')) {
          botResponse = `Il y a ${students.length} étudiants sous votre supervision.`;
        } else if (messageLower.includes('list') || messageLower.includes('liste')) {
          const studentsList = students.map(s => `${s.firstName} ${s.lastName}`).join(', ');
          botResponse = `Les étudiants sous votre supervision sont: ${studentsList}.`;
        } else if (messageLower.includes('absence élevée') || messageLower.includes('high absence')) {
          const sortedByAbsences = [...students].sort((a, b) => (b.absences || 0) - (a.absences || 0));
          const topAbsentees = sortedByAbsences.slice(0, 2).map(s => `${s.firstName} ${s.lastName} (${s.absences} absences)`).join(', ');
          botResponse = `Les étudiants avec le plus d'absences sont: ${topAbsentees}. Vous devriez peut-être les contacter.`;
        } else {
          botResponse = `Vous supervisez actuellement ${students.length} étudiants. Vous pouvez me demander: combien d'étudiants, la liste des étudiants, ou les étudiants avec le plus d'absences.`;
        }
      }
      // Greeting
      else if (messageLower.includes('bonjour') || messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('salut')) {
        botResponse = role === 'supervisor' 
          ? "Bonjour! Je suis votre assistant pour la gestion des absences. Comment puis-je vous aider aujourd'hui? Vous pouvez me demander des informations sur les étudiants, les absences, ou les emplois du temps."
          : "Bonjour! Je suis votre assistant pour suivre vos absences. Comment puis-je vous aider aujourd'hui? Vous pouvez me demander des informations sur vos absences ou votre emploi du temps.";
      }
      
      const botMessageObj: ChatMessage = {
        id: `${Date.now()}-bot`,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      
      setChatMessages((prev) => [...prev, botMessageObj]);
    }, 1000);
  };

  const addStudent = (student: any) => {
    const newStudent = {
      ...student,
      id: `${students.length + 1}`,
      absences: 0,
      justifiedAbsences: 0
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (updatedStudent: any) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === updatedStudent.id ? {...student, ...updatedStudent} : student
      )
    );
  };

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
  };

  // Timetable management functions
  const addTimetableSession = (courseData: Omit<Course, 'id'>) => {
    const newCourse = {
      ...courseData,
      id: `${courses.length + 1}`
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateTimetableSession = (updatedCourse: Course) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  const deleteTimetableSession = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  // User profile functions
  const updateUserProfile = (userId: string, profileData: Partial<User>) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === userId ? {...student, ...profileData} : student
      )
    );
  };

  const updateProfilePicture = (userId: string, pictureUrl: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === userId ? {...student, profileImage: pictureUrl} : student
      )
    );
  };

  // Export student data
  const exportStudentsData = () => {
    const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Département', 'Année', 'Classe', 'Absences', 'Absences Justifiées'];
    const studentsData = students.map(student => [
      student.studentId,
      student.lastName,
      student.firstName,
      student.email,
      student.department,
      student.year,
      student.class || 'N/A',
      student.absences || 0,
      student.justifiedAbsences || 0
    ]);
    
    const csvContent = [
      headers.join(','),
      ...studentsData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'students-data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DataContext.Provider
      value={{
        absences,
        classes,
        courses,
        students,
        chatMessages,
        addAbsenceClaim,
        updateAbsenceStatus,
        sendChatMessage,
        addStudent,
        updateStudent,
        deleteStudent,
        addTimetableSession,
        updateTimetableSession,
        deleteTimetableSession,
        exportStudentsData,
        updateUserProfile,
        updateProfilePicture
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
