
import { useData } from '../../context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type DeleteStudentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  student: any;
};

const DeleteStudentDialog = ({ isOpen, onClose, student }: DeleteStudentDialogProps) => {
  const { deleteStudent } = useData();
  const { toast } = useToast();
  
  const handleDelete = () => {
    deleteStudent(student.id);
    
    toast({
      title: "Étudiant supprimé",
      description: "L'étudiant a été supprimé avec succès",
    });
    
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement l'étudiant {student?.firstName} {student?.lastName} et toutes les données associées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteStudentDialog;
