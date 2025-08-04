import { EmptyTask } from "@/lib/constants";
import { Task } from "@/types/types";
import { create } from "zustand";


export type State = {
  tasks: Task[];
  newTask: Task;
  taskToDelete: any;
};

export type Actions = {
  setNewTask: (task: Task) => void;
  setTaskToDelete: (id: number) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: any) => void;
  updateTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
};
export const useTaskStore = create<State & Actions>((set) => ({
  tasks: [],
  newTask: EmptyTask,
  taskToDelete: "",
  setTasks: (tasks: Task[]) => set({ tasks }),
  setNewTask: (task: Task) => set({ newTask: task }),
  setTaskToDelete: (id: any) => set({ taskToDelete: id }),
  addTask: (task: Task) => {
    set((state) => ({ tasks: [...state.tasks, { ...task }] }));
  },
  deleteTask: (id: string) =>
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  updateTask: (task: Task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  },
}));
