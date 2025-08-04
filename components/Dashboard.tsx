"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import Tasklist from "./Tasklist";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/taskStore";
import { useDashboardStore } from "@/store/dashboardStore";
import { supabase } from "@/lib/supabaseClient";
import TaskDetails from "./TaskDetails";

export function DashboardComponent() {
  const { boardView, user, setUser } = useDashboardStore();
  const { setTasks } = useTaskStore();
  const router = useRouter();

  const fetchTasks = async () => {
      const userStr = localStorage.getItem("user"); // get current user string from localStorage
      const userObj = userStr ? JSON.parse(userStr) : null; // parse to object
    //fetch all task that were created by logged user
    if (userObj) {
      let { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userObj.user_id);
      console.log("Taks Data", data);
      setTasks(data!);
    }
  };



  useEffect(() => {
    setUser(
      localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null
    );
  }, []);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    async function getAllTask() {
      try {
        fetchTasks(); // get all task details
      } catch (error) {
        console.error(error);
      }
    }
    getAllTask();
  }, []);

  if (!user) {
    return null;
  } else
    return (
      <div className="flex max-sm:flex-col h-screen bg-secondary dark:bg-background">
        <Sidebar />
        <div className="flex-1 p-8 overflow-auto ">
          <Header />
          <Tasklist />
        </div>
      </div>
    );
}
