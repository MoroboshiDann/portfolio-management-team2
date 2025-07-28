import React, { useState, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';

export default function CompanyAutoComplete({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const debounceTimer = useRef(null);

  const handleInputChange = (event, inputValue, reason) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (inputValue && reason === 'input') {
      debounceTimer.current = setTimeout(async () => {
        try {
          const res = await axios.get(`/api/company-codes?query=${encodeURIComponent(inputValue)}`);
          setOptions(res.data);
        } catch (e) {
          setOptions([]);
        }
      }, 300);
    } else {
      setOptions([]);
    }
    onChange && onChange(inputValue);
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={option =>
        typeof option === 'string' ? option : option.label || ''
      }
      inputValue={value}
      onInputChange={handleInputChange}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          onChange && onChange(newValue);
        } else if (newValue && newValue.value) {
          onChange && onChange(newValue.value);
        } else {
          onChange && onChange('');
        }
      }}
      renderInput={params => (
        <TextField {...params} label="CompanyName/StockName/BondsName" variant="outlined" />
      )}
      filterOptions={x => x}
    />
  );
} 