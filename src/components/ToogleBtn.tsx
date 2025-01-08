import { useDispatch, useSelector } from "react-redux";
import { switchMode } from "../store"; // Adjust the import based on your structure
import { useEffect } from "react";
import { RootState } from "../store"; // Import RootState type
import { Button } from "react-bootstrap";

export const ToggleButton = () => {
  const dispatch = useDispatch();
  const currentMode = useSelector((state: RootState) => state.mode.mode); // Get the current mode from the Redux store

  // Effect to apply the current mode to the document body
  useEffect(() => {
    document.body.setAttribute("data-bs-theme", currentMode);
  }, [currentMode]); // Dependency on currentMode

  // Function to toggle mode
  const toggleMode = () => {
    dispatch(switchMode());
  };

  return (
    <Button onClick={toggleMode} variant={currentMode}>
      <i className={currentMode === "light" ? "fa fa-sun " : "fa fa-moon"}></i>
    </Button>
  );
};
