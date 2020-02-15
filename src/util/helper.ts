import { Pair } from "./types";

export const goPromise = async <T>(
  promise: Promise<T>
): Promise<[any, T | undefined]> => {
  try {
    const res = await promise;
    return [null, res];
  } catch (error) {
    return [error, undefined];
  }
};

export const makePair = <T>(fi: T, se: T): Pair<T> => ({ fi, se });

export const random_range = (a: number, b: number) => {
  const plus = Math.floor(Math.random() * (b - a + 1));
  return a + plus;
};
