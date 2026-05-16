import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Task {
  id: number;
  title: string;
  description: string;
  assignToManager: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskPayload {
  title: string;
  description: string;
  assignToManager: string[];
}

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://3.127.221.126:8080/api",
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      providesTags: ["Task"],
    }),
    createTask: builder.mutation<Task, TaskPayload>({
      query: (body) => ({
        url: "/tasks/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<Task, { id: number; body: TaskPayload }>({
      query: ({ id, body }) => ({
        url: `/tasks/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tasks/delete${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
