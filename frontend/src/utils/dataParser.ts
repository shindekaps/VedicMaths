// Utility to convert the awkward Key-Value array format into a usable object
export const parseStepData = (stepArray: any) => {
  if (!Array.isArray(stepArray)) return stepArray;

  const data: any = {};
  stepArray.forEach((item) => {
    if (item && item.Key) {
        if (Array.isArray(item.Value) && item.Value.length > 0 && item.Value[0].Key) {
            data[item.Key] = parseStepData(item.Value);
        } else {
            data[item.Key] = item.Value;
        }
    }
  });
  return data;
};
