from typing import Any, Generator, Literal
from sympy import Function
from sympy.core.function import UndefinedFunction
from sympy.utilities.decorator import deprecated

def n_order(a, n) -> Literal[1]:
    ...

def primitive_root(p) -> int | None:
    ...

def is_primitive_root(a, p) -> bool:
    ...

def sqrt_mod(a, p, all_roots=...) -> list[Any | int] | Any | int | None:
    ...

def sqrt_mod_iter(a, p, domain=...) -> Generator[Any | int, Any, None]:
    ...

def is_quad_residue(a, p) -> bool:
    ...

def is_nthpow_residue(a, n, m) -> bool:
    ...

def nthroot_mod(a, n, p, all_roots=...) -> list[Any | int] | Any | int | list[Any] | list[int] | list[int | Any] | None:
    ...

def quadratic_residues(p) -> list[int]:
    ...

def legendre_symbol(a, p) -> Literal[0, 1, -1]:
    ...

def jacobi_symbol(m, n) -> int:
    ...

class mobius(Function):
    @classmethod
    def eval(cls, n) -> None:
        ...
    


def discrete_log(n, a, b, order=..., prime_order=...) -> int:
    ...

def quadratic_congruence(a, b, c, p) -> list[int] | list[Any]:
    ...

def polynomial_congruence(expr, m) -> list[Any | int] | Any | int | list[Any] | list[int] | list[int | Any] | None:
    ...
