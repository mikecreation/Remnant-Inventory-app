import React, { useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  IconButton,
  Snackbar,
  Switch,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@material-ui/core";
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import GetAppIcon from "@material-ui/icons/GetApp";
import Alert from "@material-ui/lab/Alert";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ShapeVisualizer from "./ShapeVisualizer";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  content: {
    marginTop: theme.spacing(4),
  },
  card: {
    marginTop: theme.spacing(2),
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  shapeButton: {
    width: "100%",
    height: "100px",
    fontSize: "1.2rem",
    margin: theme.spacing(1),
  },
}));

const initialMaterialState = {
  name: "",
  shape: "",
  dimensions: {},
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: darkMode ? "#f48fb1" : "#dc004e",
      },
    },
  });

  const classes = useStyles();
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState(initialMaterialState);
  const [editIndex, setEditIndex] = useState(-1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputStep, setInputStep] = useState(0);
  const [dimensionDialogOpen, setDimensionDialogOpen] = useState(false);
  const [activeDimension, setActiveDimension] = useState("");

  useEffect(() => {
    const storedMaterials = localStorage.getItem("materials");
    if (storedMaterials) {
      setMaterials(JSON.parse(storedMaterials));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("materials", JSON.stringify(materials));
  }, [materials]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewMaterial((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleDimensionChange = useCallback((dimension, value) => {
    if (value <= 0) return;
    setNewMaterial((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: Number(value),
      },
    }));
  }, []);

  const addMaterial = useCallback(() => {
    if (!newMaterial.name.trim()) {
      setSnackbar({
        open: true,
        message: "Material name cannot be empty",
        severity: "error",
      });
      return;
    }
    if (editIndex === -1) {
      setMaterials((prev) => [...prev, newMaterial]);
      setSnackbar({
        open: true,
        message: "Material added successfully",
        severity: "success",
      });
    } else {
      setMaterials((prev) => {
        const updated = [...prev];
        updated[editIndex] = newMaterial;
        return updated;
      });
      setSnackbar({
        open: true,
        message: "Material updated successfully",
        severity: "success",
      });
      setEditIndex(-1);
    }
    setNewMaterial(initialMaterialState);
    setInputStep(0);
  }, [newMaterial, editIndex]);

  const editMaterial = useCallback(
    (index) => {
      setNewMaterial(materials[index]);
      setEditIndex(index);
      setInputStep(0);
    },
    [materials]
  );

  const deleteMaterial = useCallback(() => {
    setMaterials((prev) => prev.filter((_, i) => i !== deleteIndex));
    setSnackbar({
      open: true,
      message: "Material deleted successfully",
      severity: "success",
    });
    setDeleteDialogOpen(false);
  }, [deleteIndex]);

  const handleDeleteClick = useCallback((index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  }, []);

  const exportMaterials = useCallback(() => {
    const dataStr = JSON.stringify(materials, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "materials.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [materials]);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      const reorderedMaterials = Array.from(materials);
      const [reorderedItem] = reorderedMaterials.splice(result.source.index, 1);
      reorderedMaterials.splice(result.destination.index, 0, reorderedItem);

      setMaterials(reorderedMaterials);
    },
    [materials]
  );

  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.shape.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShapeSelect = useCallback((shape) => {
    let defaultDimensions;
    switch (shape) {
      case "rectangle":
        defaultDimensions = { width: 40, length: 25 };
        break;
      case "L-shape":
        defaultDimensions = {
          width1: 25,
          length1: 60,
          width2: 40,
          length2: 25,
        };
        break;
      case "U-shape":
        defaultDimensions = {
          width1: 25,
          length1: 60,
          width2: 40,
          length2: 25,
          width3: 25,
          length3: 60,
        };
        break;
      default:
        defaultDimensions = {};
    }

    setNewMaterial((prev) => ({
      ...prev,
      shape: shape,
      dimensions: defaultDimensions,
    }));
    setInputStep(2);
  }, []);

  const handleSideClick = useCallback((dimension) => {
    setActiveDimension(dimension);
    setDimensionDialogOpen(true);
  }, []);

  const handleBack = useCallback(() => {
    setInputStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const renderInputStep = useCallback(() => {
    switch (inputStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6">Enter Material Name</Typography>
            <TextField
              fullWidth
              label="Material Name"
              name="name"
              value={newMaterial.name}
              onChange={handleInputChange}
              margin="normal"
            />
            <Box mt={2} display="flex" justifyContent="space-between">
              {editIndex !== -1 && (
                <Button variant="contained" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => setInputStep(1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6">Select Material Shape</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button
                  className={classes.shapeButton}
                  variant="outlined"
                  onClick={() => handleShapeSelect("rectangle")}
                >
                  Rectangle
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  className={classes.shapeButton}
                  variant="outlined"
                  onClick={() => handleShapeSelect("L-shape")}
                >
                  L-shape
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  className={classes.shapeButton}
                  variant="outlined"
                  onClick={() => handleShapeSelect("U-shape")}
                >
                  U-shape
                </Button>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Button variant="contained" onClick={handleBack}>
                Back
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6">Adjust Dimensions</Typography>
            <Typography variant="subtitle1">
              Click on the sides to change dimensions
            </Typography>
            <ShapeVisualizer
              shape={newMaterial.shape}
              dimensions={newMaterial.dimensions}
              onSideClick={handleSideClick}
            />
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button variant="contained" onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={addMaterial}>
                {editIndex === -1 ? "Add Material" : "Update Material"}
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  }, [
    inputStep,
    newMaterial,
    handleInputChange,
    handleShapeSelect,
    handleSideClick,
    addMaterial,
    handleBack,
    editIndex,
  ]);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Material Input
            </Typography>
            <Tooltip title="Toggle dark mode">
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                color="default"
              />
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Container className={classes.content}>
          <Paper
            elevation={3}
            style={{ padding: "20px", marginBottom: "20px" }}
          >
            {renderInputStep()}
          </Paper>
          <Box mt={4}>
            <Typography variant="h5">Materials List</Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                label="Search materials"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<GetAppIcon />}
                onClick={exportMaterials}
                style={{ marginLeft: "10px" }}
              >
                Export
              </Button>
            </Box>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="materials">
                {(provided) => (
                  <Grid
                    container
                    spacing={2}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {filteredMaterials.map((material, index) => (
                      <Draggable
                        key={index}
                        draggableId={`material-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card className={classes.card}>
                              <CardContent>
                                <Typography variant="h6">
                                  {material.name}
                                </Typography>
                                <Typography>Shape: {material.shape}</Typography>
                                <ShapeVisualizer
                                  shape={material.shape}
                                  dimensions={material.dimensions}
                                  onSideClick={handleSideClick}
                                />
                                <Box display="flex" justifyContent="flex-end">
                                  <IconButton
                                    onClick={() => editMaterial(index)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleDeleteClick(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </Container>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Dialog
          open={dimensionDialogOpen}
          onClose={() => setDimensionDialogOpen(false)}
        >
          <DialogTitle>Change Dimension</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New Dimension"
              type="number"
              fullWidth
              value={newMaterial.dimensions[activeDimension] || ""}
              onChange={(e) =>
                handleDimensionChange(activeDimension, e.target.value)
              }
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDimensionDialogOpen(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setDimensionDialogOpen(false)}
              color="primary"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default App;
