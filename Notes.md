### Handling of Hexadecimals

- Hex values must begin with `\x` and be followed by two values between 0 and f.
- If hex value begins with `\x` and is followed by only one value, both are evaluated literally (e.g.: `\x1` will match `x1`)
- If hex value begins with `\x` and is followed by one or more values larger than f, all parts are evaluated literally (e.g., `\xfg` matches `xfg`)
