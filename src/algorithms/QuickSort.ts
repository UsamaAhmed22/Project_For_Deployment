export const quickSort = async (
  arr: number[],
  swap: (arr: number[], i: number, j: number, elemets: any) => void,
  speed: number
): Promise<void> => {
  const arrayBars = document.getElementsByClassName("array-bar");

  const quickSortHelper = async (
    arr: number[],
    start: number,
    end: number
  ): Promise<void> => {
    if (start >= end) return;

    const pivot = await partition(arr, start, end);
    await quickSortHelper(arr, start, pivot - 1);
    await quickSortHelper(arr, pivot + 1, end);
  };

  const partition = async (
    arr: number[],
    start: number,
    end: number
  ): Promise<number> => {
    const pivot = arr[end];
    let i = start - 1;

    for (let j = start; j < end; j++) {
      if (arr[j] < pivot) {
        i++;
        swap(arr, i, j, arrayBars);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }
    }

    swap(arr, i + 1, end, arrayBars);
    return i + 1;
  };

  await quickSortHelper(arr, 0, arr.length - 1);
};
