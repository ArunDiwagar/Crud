import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    taskList: [],
    selectedList: {}, 
    isLoading: false,
    error: ''
};

const BASE_URL = 'http://localhost:3000/tasks';

// GET
export const getTaskFromServer = createAsyncThunk(
    "task/getTaskFromServer",
    async (_, { rejectWithValue }) => {
        const response = await fetch(BASE_URL);
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            return rejectWithValue({ error: 'No task found' });
        }
    }
);

// POST
export const addTaskToServer = createAsyncThunk(
    "tasks/addTaskToServer",
    async (task,{rejectWithValue}) => {
        const options = {
            method:'POST',
            body: JSON.stringify(task),
            headers: {
                "Content-type":"application/json; charset=UTF-8"
            }
        }
        const response = await fetch(BASE_URL,options)
        if (response.ok) {
            const jsonResponse = await response.json()
            return jsonResponse
        } else {
            return rejectWithValue({error:'Task Not Added'})
        }
    }
)
// PATCH
export const updateTaskInServer = createAsyncThunk(
    "task/updateTaskInServer",
    async (task, { rejectWithValue }) => {
        const options = {
            method: 'PATCH',
            body: JSON.stringify(task),
            headers: {
                "content-type": "application/json; charset=UTF-8"
            }
        };
        const response = await fetch(BASE_URL+'/'+task.id, options);
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            return rejectWithValue({ error: 'Task not updated' });
        }
    }
);

// DELETE
export const deleteTaskFromServer = createAsyncThunk(
    "task/deleteTaskFromServer",
    async (task, { rejectWithValue }) => {
        try {
            const options = {
                method: 'DELETE',
            };
            const response = await fetch(BASE_URL+'/'+task.id, options);
            if (response.ok) {
                // Returning the task to use it in removeTaskFromList
                return task;
            } else {
                // Server responded with a non-200 status code
                return rejectWithValue({ error: 'Task not deleted', status: response.status });
            }
        } catch (error) {
            // Network error or other unexpected error
            return rejectWithValue({ error: error.message });
        }
    }
);


const tasksSlice = createSlice({
    name: 'taskSlices',
    initialState,
    reducers: {
        removeTaskFromList: (state, action) => {
            state.taskList = state.taskList.filter((task) => task.id !== action.payload.id);
        },
        setSelectedTask: (state, action) => {
            state.selectedList = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTaskFromServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTaskFromServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.taskList = action.payload;
            })
            .addCase(getTaskFromServer.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
                state.taskList = [];
            })
            .addCase(addTaskToServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addTaskToServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.taskList.push(action.payload);
            })
            .addCase(addTaskToServer.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
            })
            .addCase(updateTaskInServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTaskInServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.taskList = state.taskList.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                );
            })
            .addCase(updateTaskInServer.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
            })
            .addCase(deleteTaskFromServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTaskFromServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
           
            })
            .addCase(deleteTaskFromServer.rejected, (state, action) => {
                state.error = action.payload.error;
                state.isLoading = false;
            });
    }
});

export const {
    removeTaskFromList,
    setSelectedTask,
} = tasksSlice.actions;
export default tasksSlice.reducer;
