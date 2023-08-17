import React, { useEffect, useState } from "react";
import { Checkbox, useTheme } from "@material-ui/core";

const CustomCheckbox = ({ reset, timeData, handleFilterSchedule }) => {
  const [state, setState] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setState(false);
  }, [reset]);

  return (
    <>
      <Checkbox
        checked={state}
        checkedIcon={
          <span
            style={{
              borderRadius: 3,
              width: 24,
              height: 24,
              backgroundColor: theme.palette.primary.main,
              "hover ~ &": {
                backgroundColor: theme.palette.primary.light,
              },
            }}
          />
        }
        icon={
          <span
            style={{
              borderRadius: 3,
              width: 24,
              height: 24,
              boxShadow:
                "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
              backgroundColor: "#f5f8fa",
              "hover ~ &": {
                backgroundColor: "#ebf1f5",
              },
              "disabled ~ &": {
                boxShadow: "none",
                background: "rgba(206,217,224,.5)",
              },
            }}
          />
        }
        onChange={() => {
          setState((prevState) => !prevState);
          handleFilterSchedule(timeData);
        }}
      />
    </>
  );
};

export default CustomCheckbox;
