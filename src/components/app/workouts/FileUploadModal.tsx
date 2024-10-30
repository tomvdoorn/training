import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import type { TemplateExerciseSet } from '@prisma/client';
const FileUploadModal = ({ isOpen, onClose, onUpload, sets }: { isOpen: boolean, onClose: () => void, onUpload: (file: File, setIds: number[]) => void, sets: TemplateExerciseSet[] }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSets, setSelectedSets] = useState<number[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSetToggle = (setId: number) => {
    setSelectedSets(prev => 
      prev.includes(setId) ? prev.filter(id => id !== setId) : [...prev, setId]
    );
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile, selectedSets);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" onChange={handleFileChange} accept="image/*,video/*" />
          </div>
          <div className="space-y-2">
            <Label>Associate with sets:</Label>
            {sets.map((set, index) => (
              <div key={set.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`set-${set.id}`} 
                  checked={selectedSets.includes(set.id)}
                  onCheckedChange={() => handleSetToggle(set.id)}
                />
                <Label htmlFor={`set-${set.id}`}>Set {index + 1}</Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpload} disabled={!selectedFile}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
