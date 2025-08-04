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

    console.log(
      "userList",
      JSON.parse(localStorage.getItem("usersList") as string)
    );
    console.log(
      "ggggggggggggggg",
      userList.map((data) => data.name)
    );
  }, []);

  const handleAddTask = async () => {
    // return;
    // if there is id present in task it will update that task
    if (newTask) {
      // const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/updatetask`;
      // const headers = {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ ...newTask }),
      // };
      // const res = await fetch(url, headers);
      // const data = await res.json();

      // const obj = [
      //   {
      //     title: "New Task 4",
      //     description: "desc 4",
      //     priority: "Medium 4",
      //   },
      // ];

      // const { data, error } = await supabase.from("task").insert(JSON.stringify(obj)).select();
      // console.log("Data",data);
      const userStr = localStorage.getItem("user"); // get current user string from localStorage
      const userObj = userStr ? JSON.parse(userStr) : null; // parse to object
      delete newTask.id;
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ ...newTask, user_id: newTask.assignee != null ? newTask.assignee :userObj?.user_id}])
        .select();

      if (!error) {
        toast({
          title: "Task Updated",
          variant: "default",
          className: "bg-green-400 text-black",
          duration: 2000,
        });

        if (data && data.length > 0) {
          // console.log("ALL  Task", data[data.length - 1]);
          // Assuming the last inserted task is the one just added
          //setTasks(data); // Update only the latest task
          addTask(data[data.length - 1]);
          // If you want to update all tasks, use a setTasks method if available
        }
        setNewTask(EmptyTask);
        setIsAddModalOpen(false);
      }
    } else {
      // is there is no id present in task it will add new task to the list
      // try {
      //   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/addtask`;
      //   const headers = {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${user?.token}`,
      //     },
      //     // body: JSON.stringify({ ...newTask, user: user?.email }),
      //   };
      //   const res = await fetch(url, headers);
      //   const data = await res.json();
      //   addTask(data.task);
      //   toast({
      //     title: "Task Added",
      //     variant: "default",
      //     className: "bg-green-400 text-black",
      //     duration: 2000,
      //   });
      // } catch (error) {
      //   console.error(error);
      // }
      // setNewTask(EmptyTask);
      // setIsAddModalOpen(false);
    }
  };
  // {newTask._id ? "Edit Task" : "Add New Task"}
  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleAddModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Add New Task"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 ">
          <div className="grid grid-cols-4 items-center gap-4 ">
            <Label htmlFor="title" className="text-left">
              Title
            </Label>
            <Input
              id="title"
              value={newTask.title}
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
              value={newTask.description}
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
              value={newTask.status}
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
              value={newTask.priority}
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
              value={newTask.assignee}
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
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-left">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={
                newTask.dueDate ? format(newTask.dueDate, "yyyy-MM-dd") : ""
              }
              onChange={(e) =>
                setNewTask({...newTask,dueDate: e.target.value? new Date(e.target.value): undefined,})
              }
              className="col-span-3 w-fit"
            />
          </div> */}
        </div>
        {/* {newTask._id ? "Save Changes" : "Add Task"} */}
        <DialogFooter>
          <Button type="submit" onClick={handleAddTask}>
            {"Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
