import { array, NDArray } from 'vectorious';

export const norm = (x: NDArray) => {
    const transpose: NDArray = x.transpose()
    const multiply = transpose.dot(x)
    return Math.sqrt(multiply) as number
}

export const distance = (x: number[], y: number[]) => {
    const arrayX: NDArray = array(x)
    const arrayY: NDArray = array(y)
    const vectorDistance = norm(arrayX.subtract(arrayY))
    return vectorDistance as number
}

export const normalize = (x: number[]) => {
    const arrayX: NDArray = array(x)
    return arrayX.normalize()
}

export const lambda = (x: number[], y: number[]) => {
    const arrayY: NDArray = array(y)
    const lambda = normalize(x).dot(arrayY.transpose())
    return lambda as number
}

export const projection = (x: number[], y: number[]) => {
    return normalize(x).scale(lambda(x, y)) as NDArray
}

export const cosine = (x: number[], y: number[]) => {
    const arrayX: NDArray = array(x)
    const arrayY: NDArray = array(y)
    return lambda(x, y) / (norm(arrayX) * norm(arrayY))
}

