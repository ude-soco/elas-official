import { useState, useEffect, useCallback } from "react";

export const useAsyncPolling = (
  asyncFunction,
  pollingInterval,
  immediate = true
) => {
  const [status, setStatus] = useState("idle");
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    (taskId) => {
      setStatus("pending");
      setValue(null);
      setError(null);

      const poll = () => {
        asyncFunction(taskId)
          .then((response) => {
            setValue(response.status);
            if (response.status === "completed") {
              setStatus("success");
            } else {
              setTimeout(poll, pollingInterval);
            }
          })
          .catch((error) => {
            setError(error);
            setStatus("error");
          });
      };

      poll();
    },
    [asyncFunction, pollingInterval]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
};
