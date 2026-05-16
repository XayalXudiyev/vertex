import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DashboardTask {
  id: number;
  title: string;
  description: string;
  tags: string[];
  comments: string[];
  createdAt: string;
}

interface TasksState {
  items: DashboardTask[];
}

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const initialState: TasksState = {
  items: [
    {
      id: 1,
      title: "Review Beer & Diapers bundle performance",
      description:
        "Analyze cross-store lift differences and prepare co-placement proposal.",
      tags: ["Farid H.", "Anar M."],
      comments: ["Checked Ganjlik — lift is strong here."],
      createdAt: "May 3, 2026",
    },
    {
      id: 2,
      title: "Sales drop: Lipton Iced Tea at Ganjlik",
      description:
        "Z-score −3.50. Investigate root cause — stockout or competitor pricing?",
      tags: ["Leyla R."],
      comments: [],
      createdAt: "May 3, 2026",
    },
  ],
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: {
      reducer(state, action: PayloadAction<DashboardTask>) {
        state.items.unshift(action.payload);
      },
      prepare(input: { title: string; description?: string; tags?: string[] }) {
        return {
          payload: {
            id: Date.now(),
            title: input.title,
            description: input.description ?? "",
            tags: input.tags ?? [],
            comments: [],
            createdAt: formatToday(),
          },
        };
      },
    },
    deleteTask(state, action: PayloadAction<number>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    addComment(
      state,
      action: PayloadAction<{ id: number; comment: string }>
    ) {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (task) task.comments.push(action.payload.comment);
    },
  },
});

export const { addTask, deleteTask, addComment } = tasksSlice.actions;
export default tasksSlice.reducer;
