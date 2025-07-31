import React, { useState, useRef } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';

export default function CompanyAutoComplete({ value, onChange, onOptionSelect }) {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
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

  const handleChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      // 如果是用户直接输入的字符串，直接使用
      onChange && onChange(newValue);
      setSelectedOption(null);
      onOptionSelect && onOptionSelect(null);
    } else if (newValue && newValue.value) {
      // 如果是从下拉选项中选择的，只返回公司名称
      onChange && onChange(newValue.value);
      setSelectedOption(newValue);
      onOptionSelect && onOptionSelect(newValue);
    } else {
      onChange && onChange('');
      setSelectedOption(null);
      onOptionSelect && onOptionSelect(null);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={option => {
        if (typeof option === 'string') return option;
        return option.label || option.value || '';
      }}
      inputValue={value}
      onInputChange={handleInputChange}
      onChange={handleChange}
      renderInput={params => (
        <TextField 
          {...params} 
          label="Company Name" 
          variant="outlined"
          placeholder="Type to search companies..."
        />
      )}
      filterOptions={x => x}
      renderOption={(props, option) => (
        <li {...props}>
          <div className="flex flex-col">
            <span className="font-medium">{option.label}</span>
            <span className="text-sm text-gray-500">
              Stock: {option.stockCode} | Bond: {option.bondCode}
            </span>
          </div>
        </li>
      )}
      // 确保选择选项时只填入公司名称
      isOptionEqualToValue={(option, value) => {
        if (typeof value === 'string') {
          return option.value === value;
        }
        return option.value === value.value;
      }}
      // 禁用自动完成，确保用户必须选择选项
      autoComplete={false}
    />
  );
} 