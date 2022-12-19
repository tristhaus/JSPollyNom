# JSPollyNom - a math teaching tool pretending to be a game with levels 

Copyright tristhaus 2022 and later.

## For Users

JSPollyNom is a game wherein you attempt to hit as many good dots as possible without hitting any bad dots. Scoring is simple: the more good dots (blue) your function hits, the higher the score. If you hit a bad dot (red), your score becomes negative. Whereas the cousins [PollyNom](https://github.com/tristhaus/PollyNom) and [QtPollyNom](https://github.com/tristhaus/QtPollyNom) used random dot placement, JSPollyNom will use hand-made, curated levels. The UI design will be changed eventually.
 
Currently supported functions/operations are:
| Name  | Code  |
|---|---|
| Independent variable | `x` | 
| Basic arithmetic | `+ - * \` |
| Power | `^` |
| Grouping |  `()` |
| Absolute value | `abs` |
| Sine | `sin` |
| Cosine | `cos` |
| Tangent | `tan` |
| Exponential function to base *e* | `exp` |
| Natural logarithm, base *e* | `ln` |
| Square root | `sqrt` |

The named functions require that the argument be placed in parentheses. A valid function is thus:

    abs(x^2.3 + x*(sin(x)))

If deployed, JSPollyNom is at [jspollynom.fly.dev](https://jspollynom.fly.dev).

## For Developers

`npm install` should suffice. I am not yet looking for collaborators on this project.

## License

All source code licensed under the MIT license (see LICENSE for terms).
