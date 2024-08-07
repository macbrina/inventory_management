import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { DayPicker } from "react-day-picker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useEffect, useState } from "react";
import "react-day-picker/style.css";
import { format, isValid } from "date-fns";

function CustomDatePicker({ label, value, onChange, name, loading }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );

  useEffect(() => {
    if (value && isValid(new Date(value))) {
      setSelectedDate(new Date(value));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleDayClick = (day) => {
    const date = new Date(day);
    date.setHours(0, 0, 0, 0);

    const formattedDate = format(date, "yyyy-MM-dd");

    setSelectedDate(date);
    onChange({ target: { name, value: formattedDate } });
    setOpen(false);
  };

  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  return (
    <>
      <TextField
        label={label}
        variant="outlined"
        fullWidth
        disabled={loading}
        value={formattedDate}
        onClick={() => setOpen(true)}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <Tooltip title="Select Date">
              <IconButton onClick={() => setOpen(true)} edge="end">
                <CalendarTodayIcon />
              </IconButton>
            </Tooltip>
          ),
        }}
      />
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Select Date</DialogTitle>
        <DialogContent>
          <DayPicker
            selected={selectedDate}
            onDayClick={handleDayClick}
            mode="single"
            disabled={{ before: new Date() }}
            captionLayout="dropdown"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CustomDatePicker;
