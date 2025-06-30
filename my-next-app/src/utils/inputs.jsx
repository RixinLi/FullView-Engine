import * as React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";

const ariaLabel = { "aria-label": "search input" };

export default function SearchInput({ value, onChange, onSubmit }) {
  const handleFormSubmit = (e) => {
    e.preventDefault(); // 阻止表单默认提交行为
    onSubmit?.();
  };
  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      sx={{ "& > :not(style)": { m: 1 } }}
      noValidate
      autoComplete="off"
    >
      <Input
        placeholder="Search topics…"
        value={value}
        onChange={onChange}
        inputProps={ariaLabel}
        endAdornment={
          <InputAdornment position="end">
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </Box>
  );
}
