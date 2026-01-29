export const heapSort = async (
  arr: number[],
  swap: (arr: number[], i: number, j: number, elemets: any) => void,
  speed: number
): Promise<void> => {
  const arrayBars = document.getElementsByClassName("array-bar");

  const heapify = async (
    arr: number[],
    n: number,
    i: number
  ): Promise<void> => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      swap(arr, i, largest, arrayBars);
      await new Promise((resolve) => setTimeout(resolve, speed));
      await heapify(arr, n, largest);
    }
  };

  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    await heapify(arr, arr.length, i);
  }

  for (let i = arr.length - 1; i > 0; i--) {
    swap(arr, 0, i, arrayBars);
    await new Promise((resolve) => setTimeout(resolve, speed));
    await heapify(arr, i, 0);
  }
};
