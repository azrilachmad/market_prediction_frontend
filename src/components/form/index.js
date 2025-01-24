/* eslint-disable no-unused-vars */
import { validateRegex } from '@/helpers'
import { Button, CircularProgress, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField, capitalize } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import React, { useState } from 'react'
import { Close } from '@mui/icons-material'
import { DatePicker, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


export const MuiInput = ({
  className,
  fullwidth,
  label,
  placeholder,
  variant,
  errorMessage,
  inputProps,
  validate,
  type,
  notched,
  shrink,
  name,
  ...props
}) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control || ''}
      // defaultValue={''}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { invalid, error }
      }) => (
        <TextField
          color="primary"
          id="outlined-basic"
          className={`rounded-lg + ${className || null} `}
          fullWidth={fullwidth === true}
          label={label || null}
          inputProps={inputProps || {}}
          placeholder={placeholder || undefined}
          variant={variant || 'outlined'}
          error={!!invalid}
          helperText={invalid ? error?.message : null}
          type={type || 'text'}
          notched={notched ? 'true' : 'false'}
          shrink={shrink ? 'true' : 'false'}
          value={value || null}
          onChange={onChange}
          {...props}
        />
      )}
    />
  )
}

export const MuiButton = ({
  className,
  loading,
  label,
  icon,
  loaderSize,
  disabled,
  variant,
  style,
  ...props
}) => {
  return (
    <Button
      className={`shadow-none text-white font-smbold rounded-md + ${className || null} `}
      variant={variant || 'contained'}
      startIcon={
        icon && loading
          ? <CircularProgress color="inherit" size={loaderSize || 15} />
          : icon || undefined
      }
      disabled={!!(loading || disabled)}
      {...props}
      style={style || {}}
    >
      {label}
    </Button>
  )
}

export const MButton = ({
  className,
  loading,
  label,
  icon,
  loaderSize,
  disabled,
  variant,
  style,
  ...props
}) => {
  return (
    <Button
      className={`shadow-none text-white font-smbold rounded-md + ${className ? className : null} `}
      variant={variant ? variant : "contained"}
      startIcon={
        icon && loading ?
          <CircularProgress color="inherit" size={loaderSize ? loaderSize : 15} /> :
          icon ?
            icon :
            undefined
      }
      disabled={loading || disabled ? true : false}
      {...props}
      style={style ? style : {}}
    >
      {label}
    </Button>
  );
};

export const ModalTitle = ({ title, onClose, ...props }) => {
  return (
    <DialogTitle style={{
      color: '#000000',
      fontSize: 20,
      fontWeight: 600,
    }}
      {...props}
    >
      {title}
      <IconButton
        aria-label="close"
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
          color: '#656464',
        }}
        onClick={onClose}
      >
        <Close />
      </IconButton>
    </DialogTitle>
  );
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const MSelect = ({fullWidth, shrink, className, error, keyPair, options, variant, loading, required, ...props }) => {
  const renderOptions = (options) => {
    return options.map((value) => {
      // destructure the data row based on keyPair array value
      // eg: keyPair = ['id', 'name'] will take (id => name) from the data row
      const { [keyPair[0]]: id, [keyPair[1]]: text } = value;
      return <MenuItem key={id} value={id}>{text}</MenuItem>;
    });
  };

  return (
    <FormControl
      variant={variant ? variant : 'outlined'}
      fullWidth={fullWidth === false ? false : true}
      className={className ? className : 'w-full'}
    >
      <InputLabel
        shrink={shrink ? shrink : undefined}
      >{props.label}</InputLabel>
      <Select
        error={error ? true : false}
        variant={variant ? variant : 'outlined'}
        IconComponent={loading ? () => <CircularProgress color="inherit" size={15} style={{ marginRight: 15 }} /> : undefined}
        required={required ? true : false}
        MenuProps={MenuProps}
        {...props}
      >
        {renderOptions(options)}
      </Select>
      {error ? (<FormHelperText style={{ color: '#d32f2f' }}>{error}</FormHelperText>) : ''}
    </FormControl>
  );
};

export const MInput = ({
  className,
  fullwidth,
  label,
  placeholder,
  variant,
  errorMessage,
  onBlur,
  inputProps,
  validate,
  type,
  removeTrailing,
  notched,
  shrink,
  ...props
}) => {
  const handleBlur = (event) => {
    // onChange cause performance hit, so alternative is onBlur
    // dont validate onBlur if component has validate={false} prop
    if (validate !== false) event.target.value = validateRegex(event.target.value, type, true);
    return onBlur(event);
  };
  return (
    <div>
      <TextField
        id="outlined-basic"
        className={`rounded-lg + ${className ? className : null} `}
        fullWidth={fullwidth === true ? true : false}
        label={label ? label : null}
        inputProps={inputProps ? inputProps : {}}
        placeholder={placeholder ? placeholder : undefined}
        variant={variant ? variant : "outlined"}
        error={errorMessage ? true : false}
        helperText={errorMessage ? errorMessage : null}
        onBlur={onBlur ? handleBlur : onBlur} // dont validate onBlur if component has validate={false} prop
        type={type ? type : 'text'}
        notched={notched ? 'true' : 'false'}
        shrink={shrink ? 'true' : 'false'}
        onWheel={(e) => type === 'number' ? e.target.blur() : null}
        {...props}
      />
    </div>
  );
};

export const YMDatePicker = ({
  className,
  label,
  value,
  inputFormat,
  onChange,
  openTo,
  errorMessage,
  views,
  ...props
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        openTo={openTo ? openTo : 'day'}
        className={`${className ? className : null} `}
        inputFormat={inputFormat ? inputFormat : 'DD-MM-YYYY'}
        onChange={(newValue) => onChange(newValue)}
        views={views ? views : ['day', 'month', 'year']}
        label={label ? label : 'Date'}
        value={value ? value : null}
        renderInput={(params) => <TextField

          {...params} sx={{ width: "100%" }}
          error={errorMessage ? true : true}
          helperText={errorMessage ? errorMessage : null}
        />}
        slotProps={{
          textField: {
            error: errorMessage ? true : false,
            helperText: errorMessage ? errorMessage : null
          }
        }}
        {...props}
      />
    </LocalizationProvider>
  );
};


