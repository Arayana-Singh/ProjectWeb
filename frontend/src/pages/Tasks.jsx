import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Fab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import {
  getProjectTasks,
  createTask,
  updateTaskStatus,
  createLog,
} from "../services/api";

const taskStatuses = ["Todo", "In Progress", "Review", "Done"];

const Tasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project: projectId,
    status: "Todo",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await getProjectTasks(projectId);
      setTasks(response.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTask({
      title: "",
      description: "",
      project: projectId,
      status: "Todo",
    });
  };

  const handleChange = (e) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const task = await createTask(newTask);
      await createLog({
        action: "Task Created",
        description: `Created task: ${newTask.title}`,
        user: JSON.parse(localStorage.getItem("user")).id,
        project: projectId,
      });
      handleClose();
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      await createLog({
        action: "Task Status Updated",
        description: `Updated task status to: ${newStatus}`,
        user: JSON.parse(localStorage.getItem("user")).id,
        project: projectId,
      });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Todo":
        return "#ff9800";
      case "In Progress":
        return "#2196f3";
      case "Review":
        return "#9c27b0";
      case "Done":
        return "#4caf50";
      default:
        return "#000000";
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {task.description}
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }
                    sx={{
                      color: getStatusColor(task.status),
                      "& .MuiSelect-select": {
                        color: getStatusColor(task.status),
                      },
                    }}
                  >
                    {taskStatuses.map((status) => (
                      <MenuItem
                        key={status}
                        value={status}
                        sx={{
                          color: getStatusColor(status),
                        }}
                      >
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newTask.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newTask.description}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newTask.status}
              onChange={handleChange}
              label="Status"
            >
              {taskStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
