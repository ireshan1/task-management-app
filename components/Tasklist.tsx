"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import EditDeleteMenu from "./EditDeleteMenu";
import { useTaskStore } from "@/store/taskStore";
import { Task, TaskPriority, TaskStatus } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/dashboardStore";
import TaskDetails from "./TaskDetails";

const Tasklist = () => {
  const { toast } = useToast();
  const { tasks } = useTaskStore();
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"title" | "priority" | "none">("none");
  const router = useRouter();
  const { boardView, setBoardView } = useDashboardStore();
  const [taskDetails, setTaskDetails] = useState<Task[]>([]);

  const filteredTasks = tasks.filter(
    (task) =>
      ((statusFilter === "all" || task.status === statusFilter) &&
        priorityFilter === "all") ||
      task.priority === priorityFilter
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "title")
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);

    if (sortBy === "priority") {
      const priorityOrder = { Low: 0, Medium: 1, High: 2 };
      return sortOrder === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  function handleTask(task: any) {
    setTaskDetails(task);
    setBoardView("task-detail");
  }

  return (
    <div>
      {boardView !== "task-detail" ? (
        <>
          {/* Filters  */}
          <div className="mb-4 flex flex-wrap gap-4 justify-start  cursor-pointer">
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as TaskStatus | "all")
              }
            >
              <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary ">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={(value) =>
                setPriorityFilter(value as TaskPriority | "all")
              }
            >
              <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary ">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "title" | "priority" | "none")
              }
            >
              <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary ">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Sorting</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tasks */}
          <div className="  py-4 space-y-2 cursor-pointer">
            {sortedTasks.length == 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
                No tasks found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      className=""
                      onClick={() => handleTask(task)}
                    >
                      <TableCell className="space-y-2  text-nowrap w-1/2 capitalize">
                        <div>
                          <h3 className="font-semibold text-base">
                            {task?.title}
                          </h3>
                        </div>
                      </TableCell>
                      <TableCell className="text-nowrap ">
                        {task?.description && <p>{task?.description}</p>}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {task.priority}
                      </TableCell>

                      <TableCell className="text-nowrap">
                        {task.status}
                      </TableCell>
                     
                      <TableCell className="text-right" onClick={(e)=> e.stopPropagation()}>
                        <EditDeleteMenu task={task} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell className="text-left text-md" colSpan={5}>
                      Total : {sortedTasks.length}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </div>
        </>
      ) : (
        <TaskDetails tasks={taskDetails} />
      )}
    </div>
  );
};

export default Tasklist;
