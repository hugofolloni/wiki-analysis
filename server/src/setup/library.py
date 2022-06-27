import numpy as np
import math

def internalProduct(x, y):
    return np.inner(x, y)

def norm(x):
    escalar = internalProduct(x, x)
    return math.sqrt(escalar)
    
def distVector(x, y):
    return np.subtract(x, y)
    
def distance(x, y):
    return norm(distVector(x, y))

def normalize(x):
    return np.divide(x, norm(x))

def findLambda(x, y):
    return np.inner(y, normalize(x))
    
def project(x, y):
    return np.multiply(findLambda(x, y), normalize(x))

def distanceToProjection(x, y):
    return norm(distVector(x, project(x, y)))

def cosine(x, y):
    return internalProduct(x, y) / (norm(x) * norm(y))
    
def isOrtogonalCosine(x, y):
    if cosine(x, y) == 0:
        return True
    else:
        return False

def isOrtogonalInner(x, y):
    if internalProduct(x, y) == 0:
        return True
    else:
        return False

def isColinear(x, y):
    if cosine(x, y) == 1:
        return True
    else:
        return False

# achar ortogonal (passando array com vetores que a resposta deve ser ortogonal aos dois)

# projecao no plano (passando x e os dois vetores do plano) 
    ## achar ortogonal, projetar v1 no ortogonal e fazer diferenca entre v1 e sua projecao no ortogonal
