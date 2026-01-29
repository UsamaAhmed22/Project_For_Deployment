import React, { useState, useEffect } from "react";
import "./SortingVisualizer.css";
import {
  bubbleSort,
  insertionSort,
  quickSort,
  mergeSort,
  heapSort,
  selectionSort,
} from "./algorithms";
import { colors } from "./constants";

const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(0);
  const [arraySize, setArraySize] = useState<number>(50);

  const algos = [
    "Bubble Sort",
    "Insertion Sort",
    "Quick Sort",
    "Merge Sort",
    "Heap Sort",
    "Selection Sort",
  ];

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  const resetArray = () => {
    const newArray: number[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(randomIntFromInterval(5, 500));
    }
    setArray(newArray);
  };

  const randomIntFromInterval = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const swap = (arr: number[], idx1: number, idx2: number, elements: any) => {
    const temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;

    // Update the elements colors besed on the current process index for speed time the revert to original color
    elements[idx1].style.backgroundColor = colors.pivot;
    elements[idx2].style.backgroundColor = colors.swap;

    setTimeout(() => {
      elements[idx1].style.backgroundColor = colors.default;
      elements[idx2].style.backgroundColor = colors.default;
    }, speed);

    setArray([...arr]);
  };

  const handleSort = async (algo: string) => {
    if (!isSorting) {
      setIsSorting(true);

      await handleSortFunction(algo);
      setIsSorting(false);
    }
  };

  const handleSortFunction = (algo: string) => {
    switch (algo) {
      case "Bubble Sort":
        return bubbleSort(array, swap, speed);
      case "Insertion Sort":
        return insertionSort(array, swap, speed);
      case "Quick Sort":
        return quickSort(array, swap, speed);
      case "Merge Sort":
        return mergeSort(array, swap, speed);
      case "Heap Sort":
        return heapSort(array, swap, speed);
      case "Selection Sort":
        return selectionSort(array, swap, speed);
      default:
        throw new Error("Invalid algorithm");
    }
  };

  return (
    <div className="sorting-visualizer bg-primary flex flex-col justify-between">
      <div className="controls gap-2 mt-9">
        {algos.map((algo) => (
          <button
            key={algo}
            disabled={isSorting}
            className="p-2 border rounded"
            onClick={() => handleSort(algo)}
          >
            {algo}
          </button>
        ))}

        <button
          disabled={isSorting}
          className="p-2 border rounded"
          onClick={resetArray}
        >
          Reset Array
        </button>

        <div>
          <label>Array Size: </label>
          <input
            type="range"
            disabled={isSorting}
            min="5"
            step={5}
            max="70"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
          />
        </div>

        <div className="flex items-center">
          <label>Speed: </label>
          <input
            type="range"
            disabled={isSorting}
            min="0"
            max="500"
            step="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="array-container min-h-[70vh] overflow-hidden overflow-x-scroll">
        {array.map((value, idx) => (
          <div
            key={idx}
            className={`array-bar text-xs font-bold text-red-600 bg-secondary tracking-wider select-none flex items-center justify-center`}
            style={{ height: `${value}px` }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;
