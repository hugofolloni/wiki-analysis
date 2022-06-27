import { math } from 'mathjs'

export const norm = (x) => {
    return Math.sqrt(math.multiply(math.transpose(x), x))
}

export const distance = (x, y) => {
    return norm(math.subtract(x, y))
}

export const normalize = (x) => {
    return math.divide(x, norm(x))
}

export const lambda = (x, y) => {
    return math.multiply(math.transpose(y), normalize(x))
}

export const projection = (x, y) => {
    return math.multiply(lambda(x, y), normalize(x))
}

export const cosine = (x, y) => {
    return math.divide(lambda(x, y), norm(y))
}

