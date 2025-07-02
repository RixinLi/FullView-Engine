import { useTheme, useMediaQuery } from "@mui/material";

export default function useResponsive() {
  const theme = useTheme();
  return {
    xs: useMediaQuery(theme.breakpoints.only("xs")),
    sm: useMediaQuery(theme.breakpoints.only("sm")),
    md: useMediaQuery(theme.breakpoints.only("md")),
    lgUp: useMediaQuery(theme.breakpoints.up("lg")),
    smDown: useMediaQuery(theme.breakpoints.down("sm")),
  };
}
