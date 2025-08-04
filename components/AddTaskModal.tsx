"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { EmptyTask } from "@/lib/constants";
import { useTaskStore } from "@/store/taskStore";
import { useModalStore } from "@/store/modalStore";
import { Task, TaskPriority, TaskStatus } from "@/types/types";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type User = { name: string; [key: string]: any };

const AddTaskModal = () => {
  const { newTask, updateTask, setNewTask, addTask, setTasks } = useTaskStore();
  const { isAddModalOpen, setIsAddModalOpen } = useModalStore();
  const { user } = useDashboardStore();
  const { toast } = useToast();

  const [userList, setUserList] = useState<User[]>([]);

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewTask(EmptyTask);
  };

  useEffect(() => {
    setUserList(JSON.parse(localStorage.getItem("usersList") as string));
  }, []);

  const handleAddTask = async () => {

    
    setNewTask(EmptyTask);
    if (
      newTask.assignee != "" &&
      newTask.description != "" &&
      newTask.title != ""
    ) {
      const userStr = localStorage.getItem("user"); // get current user string from localStorage
      const userObj = userStr ? JSON.parse(userStr) : null;

      if (newTask?.user_id) {
        const { data, error } = await supabase
          .from("tasks")
          .update([
            {
              ...newTask,
              user_id:
                newTask.assignee != null ? newTask.assignee : userObj?.user_id,
            },
          ])
          .eq("id", newTask?.id)
          .select();

        console.log("Task updated", data);
        if (!error) {
          toast({
            title: "Task has been updated",
            variant: "default",
            className: "bg-green-400 text-black",
            duration: 2000,
          });

          console.log("Taks updated");
          
          if (data && data.length > 0) {
            updateTask(data[data.length - 1]);
            setIsAddModalOpen(false);
            setNewTask(EmptyTask);
          }
        }
      } else {

        console.log("New Task",newTask);
        delete newTask.id;
        const { data, error } = await supabase
          .from("tasks")
          .insert([
            {
              ...newTask,
              user_id:
                newTask.assignee != null ? newTask.assignee : userObj?.user_id,
            },
          ])
          .select();

        if (!error) {
          toast({
            title: "Task has been created",
            variant: "default",
            className: "bg-green-400 text-black",
            duration: 2000,
          });

          if (data && data.length > 0) {
            // Assuming the last inserted task is the one just added
            console.log("Taks added");
            addTask(data[data.length - 1]);
            setIsAddModalOpen(false);
            setNewTask(EmptyTask);
          }
        }
      }
    } else {
      toast({
        title: "Please fill the form",
        variant: "default",
        className: "bg-red-400 text-black",
        duration: 2000,
      });
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleAddModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {" "}
            {newTask?.id ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 ">
          <div className="grid grid-cols-4 items-center gap-4 ">
            <Label htmlFor="title" className="text-left">
              Title
            </Label>
            <Input
              id="title"
              value={newTask?.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Textarea
              id="description"
              value={newTask?.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-left">
              Status
            </Label>
            <Select
              value={newTask?.status}
              onValueChange={(value) =>
                setNewTask({ ...newTask, status: value as TaskStatus })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-left">
              Priority
            </Label>
            <Select
              value={newTask?.priority}
              onValueChange={(value) =>
                setNewTask({ ...newTask, priority: value as TaskPriority })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-left">
              Assignee
            </Label>
            <Select
              value={
                newTask.id != "" ||
                newTask.id != undefined ||
                newTask.id != null
                  ? newTask?.assignee
                  : newTask?.id
              }
              onValueChange={(value) =>
                setNewTask({ ...newTask, assignee: value as TaskStatus })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>

              <SelectContent>
                {userList?.map((user) => (
                  <SelectItem key={user?.id} value={user?.user_id}>
                    {user?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleAddTask}>
            {newTask?.id ? "Update" : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
