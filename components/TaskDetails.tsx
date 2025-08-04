"use client";

import { Task } from "@/types/types";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const TaskDetails = ({ tasks }: any) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCommets() {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .eq("task_id", tasks?.id);
      setComments(data ?? []);
      console.log("task details **", data); // should show your data
    }
    fetchCommets();
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    const comment = {
      task_id: tasks?.id,
      author: tasks?.assignee, // Replace with current user's name if available
      comment: newComment.trim(),
    };

    await supabase.from("comments").insert(comment);

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{tasks.title}</h1>
        <p className="text-gray-600">{tasks.description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <span className="text-gray-500 text-sm">Priority</span>
          <div
            className={`font-medium ${
              tasks.priority === "High"
                ? "text-red-600"
                : tasks.priority === "Medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {tasks.priority}
          </div>
        </div>

        <div>
          <span className="text-gray-500 text-sm">Assignee</span>
          <div className="font-medium text-gray-800">{tasks.assignee}</div>
        </div>

        <div>
          <span className="text-gray-500 text-sm">Status</span>
          <div
            className={`font-medium ${
              tasks.status === "Completed"
                ? "text-green-600"
                : tasks.status === "In Progress"
                ? "text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tasks.status}
          </div>
        </div>
      </div>

      {/* Comments */}

      <h2 className="text-lg font-semibold text-gray-700 mb-2  mt-5">Add Comment</h2>

      {/* Comment Input */}
      <div className="flex items-center gap-2 mb-2">
        <textarea
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
       
      </div>
       <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          Add
        </button>
      {/* Comment List */}
      {comments.length > 0 && (
        <>
          <h1 className="text-lg font-semibold text-gray-700 mb-2">
            Comments History
          </h1>
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment?.id}
                className="p-3 bg-gray-50 rounded-lg border"
              >
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{comment?.author}:</span>{" "}
                  {comment?.comment}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TaskDetails;
