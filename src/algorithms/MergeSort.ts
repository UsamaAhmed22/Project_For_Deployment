export const mergeSort = async (
  arr: number[],
  swap: (arr: number[], i: number, j: number, elemets: any) => void,
  speed: number
): Promise<void> => {
  const arrayBars = document.getElementsByClassName("array-bar");

  const mergeSortHelper = async (arr: number[]): Promise<number[]> => {
    if (arr.length <= 1) return arr;

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(await mergeSortHelper(left), await mergeSortHelper(right));
  };

  const merge = async (left: number[], right: number[]): Promise<number[]> => {
    let result: number[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    return result.concat(i < left.length ? left.slice(i) : right.slice(j));
  };

  const sortedArray = await mergeSortHelper(arr);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = sortedArray[i];
    await new Promise((resolve) => setTimeout(resolve, speed));
    swap(arr, i, i, arrayBars);
  }
};
