"use client";

import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useModalStore } from "@/store/modalStore";
import { useTaskStore } from "@/store/taskStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { supabase } from "@/lib/supabaseClient";

const DeleteModal = () => {
  const { toast } = useToast();
  const { taskToDelete, deleteTask } = useTaskStore();
  const { setIsDeleteModalOpen, isDeleteModalOpen } = useModalStore();

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      const { data, error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskToDelete);

      deleteTask(taskToDelete);
      toast({
        title: "Task Deleted",
        variant: "destructive",
        duration: 2000,
      });
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={handleCloseDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogDescription>
            Are you want to delete this task?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteTask}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
