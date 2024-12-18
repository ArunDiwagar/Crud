import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
    taskList: [],
    selectedList: {}, 
    isLoading: false,
    error: ''
};

// Base URL for API
const BASE_URL = 'http://localhost:3000/tasks';


// GET: Fetch tasks from the server
export const getTaskFromServer = createAsyncThunk(
    "task/getTaskFromServer",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(BASE_URL);
            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse;
            } else {
                return rejectWithValue({ error: 'No tasks found' });
            }
        } catch (error) {
            return rejectWithValue({ error: 'Network error: Unable to fetch tasks' });
        }
    }
);

// POST: Add a new task to the server
export const addTaskToServer = createAsyncThunk(
    "tasks/addTaskToServer",
    async (task, { rejectWithValue }) => {
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify(task),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            };
            const response = await fetch(BASE_URL, options);
            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse;
            } else {
                return rejectWithValue({ error: 'Task not added' });
            }
        } catch (error) {
            return rejectWithValue({ error: 'Network error: Unable to add task' });
        }
    }
);

// PATCH: Update an existing task on the server
export const updateTaskInServer = createAsyncThunk(
    "task/updateTaskInServer",
    async (task, { rejectWithValue }) => {
        try {
            const options = {
                method: 'PATCH',
                body: JSON.stringify(task),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            };
            const response = await fetch(`${BASE_URL}/${task.id}`, options);

            if (!response.ok) {
                const errorResponse = await response.json();
                return rejectWithValue({ error: errorResponse.message || 'Task not updated' });
            }

            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            return rejectWithValue({ error: 'Network error: Unable to update task' });
        }
    }
);

// DELETE: Remove a task from the server
export const deleteTaskFromServer = createAsyncThunk(
    "task/deleteTaskFromServer",
    async (task, { rejectWithValue }) => {
        try {
            const options = {
                method: 'DELETE',
            };
            const response = await fetch(`${BASE_URL}/${task.id}`, options);
            if (response.ok) {
                return task;  // Return task to be removed locally
            } else {
                return rejectWithValue({ error: 'Task not deleted', status: response.status });
            }
        } catch (error) {
            return rejectWithValue({ error: 'Network error: Unable to delete task' });
        }
    }
);

// Create the tasks slice
const tasksSlice = createSlice({
    name: 'taskSlices',
    initialState,
    reducers: {
        // Reducer to remove a task from the list
        removeTaskFromList: (state, action) => {
            state.taskList = state.taskList.filter(task => task.id !== action.payload.id);
        },
        // Reducer to select a task for editing or viewing
        setSelectedTask: (state, action) => {
            state.selectedList = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle GET requests
            .addCase(getTaskFromServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTaskFromServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.taskList = action.payload;
            })
            .addCase(getTaskFromServer.rejected, (state, action) => {
                state.error = action.payload?.error || 'Unable to fetch tasks';
                state.isLoading = false;
                state.taskList = [];
            })

            // Handle POST requests
            .addCase(addTaskToServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addTaskToServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.taskList.push(action.payload);
            })
            .addCase(addTaskToServer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.error || 'An error occurred while adding the task.';
            })

            // Handle PATCH requests
            .addCase(updateTaskInServer.pending, (state) => {
                state.isLoading = true;
                state.error = null; // Reset error state
            })
            .addCase(updateTaskInServer.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedTask = action.payload;
                state.taskList = state.taskList.map(task =>
                    task.id === updatedTask.id ? updatedTask : task
                );
            })
            .addCase(updateTaskInServer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.error; // Set the error message
            })

            // Handle DELETE requests
            .addCase(deleteTaskFromServer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTaskFromServer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.taskList = state.taskList.filter(task => task.id !== action.payload.id);
            })
            .addCase(deleteTaskFromServer.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.error || 'An error occurred while deleting the task.';
            });
    }
});

// Export actions and reducer
export const { removeTaskFromList, setSelectedTask } = tasksSlice.actions;
export default tasksSlice.reducer;
