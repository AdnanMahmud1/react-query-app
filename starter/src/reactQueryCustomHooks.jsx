import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import customFetch from "./utils";
import { toast } from "react-toastify";


export const useFetchTasks = () => {
  const { isLoading, data, error, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await customFetch.get("/");
      return data;
    },
  });
  return { isLoading, isError, data };
};

export const useCreateTasks = () => {
    const queryClient = useQueryClient();

    const { mutate: createTask, isLoading } = useMutation({
      mutationFn: (taskTitle) => customFetch.post("/", { title: taskTitle }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success("task added");

      },
      onError: (error) => {
        toast.error(error.response.data.msg);
        console.log(error);
      },
    });
    return {createTask, isLoading};
};

export const useEditTasks = () => {
  const queryClient = useQueryClient();
  const { mutate: editTask } = useMutation({
    mutationFn: ({ taskId, isDone }) => {
      return customFetch.patch(`/${taskId}`, { isDone });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  return { editTask };
};
export const useDeleteTasks = () => {

    const queryClient = useQueryClient();

    const { mutate: deleteTask, isLoading: deleteTaskLoading } = useMutation({
      mutationFn: (taskId) => {
        return customFetch.delete(`/${taskId}`);
      },
      onSuccess: () => {
        toast.success("Task Deleted");
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    });
 return { deleteTask, deleteTaskLoading };
};
