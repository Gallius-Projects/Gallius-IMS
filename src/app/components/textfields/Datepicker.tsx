'use client';

import * as React from 'react';
import dayjs from 'dayjs';
import {
  DatePicker as MUIDatePicker,
  DatePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControl } from '@mui/material';

// Extend the MUI DatePickerProps to include our custom props
interface CustomDatePickerProps extends DatePickerProps<dayjs.Dayjs> {
  error?: boolean;
  helperText?: React.ReactNode;
}

// Create a forwardRef wrapper to handle the ref correctly
export const DatePicker = React.forwardRef<
  HTMLInputElement,
  CustomDatePickerProps
>((props: any, ref) => {
  const { placeholder, endAdornment, error, value, onChange, ...muiProps } =
    props;

  // Convert the value to a Day.js object if it's a string
  const dateValue = dayjs(value);

  const handleChange = (newValue: dayjs.Dayjs | null) => {
    if (onChange) {
      console.log(newValue);

      // Call the original onChange with the correct type
      // If the original expects a Date object, convert it
      onChange(newValue as any);
    }
  };

  return (
    <FormControl error={error} fullWidth>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* MUI DatePicker integrated with a Popover for custom trigger */}
        <MUIDatePicker
          {...muiProps}
          value={dateValue}
          onChange={handleChange}
          slotProps={{
            textField: {
              placeholder: `${placeholder}`,
              variant: 'outlined',
              // endAdornment: { endAdornment },
              size: 'small',
              error: error || false,
              className:
                'mr-0 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 ' +
                'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ' +
                'dark:border-slate-800 dark:bg-slate-950 dark:text-white',
              sx: {
                // Actual MUI input
                '& .MuiInputBase-input': {
                  //   color: '#0f172a',
                  color: 'yellow',
                },

                // Actual MUI outline
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e2e8f0',
                  color: 'yellow',
                },

                // Hover
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cbd5e1',
                  color: 'yellow',
                },

                // Dark mode
                '.dark & .MuiInputBase-input': {
                  color: 'yellow',
                },

                '.dark & .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1e293b',
                  color: 'yellow',
                },

                '.dark &:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#334155',
                  color: 'yellow',
                },
              },
            },
          }}

          endAdornment={
            <button
              type="button"
              className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear location"
            >
              ✕
            </button>
          }
          // Prevent the popover from closing immediately on selection
          // You might need to adjust this based on your specific popover implementation
          // The default behavior usually works fine with the Popover component
        />
      </LocalizationProvider>
    </FormControl>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
