
import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type StudentFormProps = {
  isOpen: boolean;
  onClose: () => void;
  studentData?: any;
  mode: 'add' | 'edit';
};

const StudentFormDialog = ({ isOpen, onClose, studentData, mode }: StudentFormProps) => {
  const { addStudent, updateStudent, classes } = useData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: studentData?.firstName || '',
    lastName: studentData?.lastName || '',
    email: studentData?.email || '',
    studentId: studentData?.studentId || '',
    department: studentData?.department || 'Computer Science',
    year: studentData?.year || '3rd',
    class: studentData?.class || 'A',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'add') {
      addStudent({
        ...formData,
        id: Math.random().toString(36).substring(2, 9),
        absences: 0,
        justifiedAbsences: 0
      });
      
      toast({
        title: "Étudiant ajouté",
        description: "L'étudiant a été ajouté avec succès",
      });
    } else {
      updateStudent({
        ...studentData,
        ...formData
      });
      
      toast({
        title: "Étudiant modifié",
        description: "Les informations de l'étudiant ont été mises à jour",
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Ajouter un étudiant' : 'Modifier l\'étudiant'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Remplissez les informations pour ajouter un nouvel étudiant.' 
              : 'Modifiez les informations de l\'étudiant.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="studentId">ID Étudiant</Label>
            <Input
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Informatique</SelectItem>
                  <SelectItem value="Electrical Engineering">Génie Électrique</SelectItem>
                  <SelectItem value="Civil Engineering">Génie Civil</SelectItem>
                  <SelectItem value="Mechanical Engineering">Génie Mécanique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Select
                value={formData.year}
                onValueChange={(value) => handleSelectChange('year', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st">1ère année</SelectItem>
                  <SelectItem value="2nd">2ème année</SelectItem>
                  <SelectItem value="3rd">3ème année</SelectItem>
                  <SelectItem value="4th">4ème année</SelectItem>
                  <SelectItem value="5th">5ème année</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class">Classe</Label>
            <Select
              value={formData.class}
              onValueChange={(value) => handleSelectChange('class', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Classe A</SelectItem>
                <SelectItem value="B">Classe B</SelectItem>
                <SelectItem value="C">Classe C</SelectItem>
                <SelectItem value="D">Classe D</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-emsi-green hover:bg-emsi-darkgreen">
              {mode === 'add' ? 'Ajouter' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentFormDialog;
