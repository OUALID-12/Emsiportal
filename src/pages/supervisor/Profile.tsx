
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import { useData } from '../../context/DataContext';
import { Camera } from 'lucide-react';

const SupervisorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateUserProfile, updateProfilePicture } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [personalFormData, setPersonalFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    department: user?.department || 'Supervision',
  });
  
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profileImage || null);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (user) {
      updateUserProfile(user.id, personalFormData);
    }
    
    // Simulate API call delay
    setTimeout(() => {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations personnelles ont été mises à jour avec succès.",
      });
      setSaving(false);
    }, 1000);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    
    // Validation
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      setChangingPassword(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été changé avec succès.",
      });
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setChangingPassword(false);
    }, 1000);
  };
  
  const handleUploadImage = () => {
    if (!selectedFile || !user) return;
    
    setUploadingImage(true);
    
    // In a real app, you would upload the image to a server
    // For now, we'll just simulate the upload and use the preview URL
    setTimeout(() => {
      if (imagePreview && user) {
        updateProfilePicture(user.id, imagePreview);
      }
      
      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès.",
      });
      setSelectedFile(null);
      setUploadingImage(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Surveillant</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et préférences
        </p>
      </div>
      
      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-32 w-32 cursor-pointer" onClick={handleImageClick}>
                  <AvatarImage src={imagePreview || user?.profileImage} alt={`${user?.firstName} ${user?.lastName}`} />
                  <AvatarFallback className="text-2xl">
                    {`${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  onClick={handleImageClick}
                >
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">Surveillant</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              
              <input
                ref={fileInputRef}
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              
              {selectedFile && (
                <div className="text-sm text-muted-foreground w-full">
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[180px]">{selectedFile.name}</span>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={handleUploadImage}
                      disabled={uploadingImage}
                      className="ml-2"
                    >
                      {uploadingImage ? 'Téléchargement...' : 'Télécharger'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div>
          <Tabs defaultValue="personal">
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
              <TabsTrigger value="password">Mot de passe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handlePersonalSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={personalFormData.firstName}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={personalFormData.lastName}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={personalFormData.email}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={personalFormData.phoneNumber}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Département</Label>
                      <Input
                        id="department"
                        name="department"
                        value={personalFormData.department}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={saving}>
                        {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordFormData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordFormData.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordFormData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={changingPassword}>
                        {changingPassword ? 'Modification...' : 'Changer le mot de passe'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SupervisorProfile;
