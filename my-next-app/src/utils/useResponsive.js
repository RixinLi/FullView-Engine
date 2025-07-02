// hooks/useResponsiveLayout.tsx
import { useTheme, useMediaQuery } from "@mui/material";
import { useEffect } from "react";

export default function useResponsiveLayout() {
  const theme = useTheme();

  // 宽度断点
  const xs = useMediaQuery(theme.breakpoints.only("xs"));
  const sm = useMediaQuery(theme.breakpoints.only("sm"));
  const md = useMediaQuery(theme.breakpoints.only("md"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));

  // 高度断点
  const shortHeight = useMediaQuery("(max-height: 600px)");

  // 设置 --vh 变量（修复 mobile 100vh 问题）
  useEffect(() => {
    const updateVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    updateVh();
    window.addEventListener("resize", updateVh);
    return () => window.removeEventListener("resize", updateVh);
  }, []);

  return {
    xs,
    sm,
    md,
    lgUp,
    smDown,
    shortHeight,
  };
}
