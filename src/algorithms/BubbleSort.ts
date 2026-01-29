export const bubbleSort = async (
  arr: number[],
  swap: (arr: number[], i: number, j: number, elemets: any) => void,
  speed: number
): Promise<void> => {
  const n = arr.length;

  const arrayBars = document.getElementsByClassName("array-bar");

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1, arrayBars);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }
    }
  }
};
