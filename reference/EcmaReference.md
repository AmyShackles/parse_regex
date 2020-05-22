## Syntax

### Pattern

- _Disjunction_

### Disjunction

- _Alternative_
- _Alternative | Disjunction_

### Alternative

- [empty]
- _Alternative Term_

### Term

- _Assertion_
- _Atom_
- _Atom Quantifier_

### Assertion

- ^
- \$
- \b
- \B
- (?= ...)
- (?! ...)
- (?<= ...)
- (?<! ...)

### Quantifier

- _QuantifierPrefix_
- _QuantifierPrefix ?_

### Quantifier Prefix

- \*
- \+
- ?
- { 0...9 }
- { 0...9, }
- { 0...9, 0...9 }

### Atom

- _PatternCharacter_
- .
- \ _AtomEscape_
- _CharacterClass_
- ( _GroupSpecifier, Disjunction_ )
- (?: _Disjunction_)

### SyntaxCharacter

- ^
- \$
- \
- .
- \*
- \+
- ?
- (
- )
- [
- ]
- {
- }
- |

### PatternCharacter

- _SourceCharacter_ but not _SyntaxCharacter_

### AtomEscape

- _DecimalEscape_
- _CharacterClassEscape_
- _CharacterEscape_
- k _GroupName_

### CharacterEscape

- _ControlEscape_
- c _ControlLetter_
- 0 [lookahead ∉ *DecimalDigit*]
- _HexEscapeSequence_
- _RegExpUnicodeEscapeSequence_
- _IdentityEscape_

### ControlEscape

- f
- n
- r
- t
- v

### ControlLetter

- a
- b
- c
- d
- e
- f
- g
- h
- i
- j
- k
- l
- m
- n
- o
- p
- q
- r
- s
- t
- u
- v
- w
- x
- y
- z
- A
- B
- C
- D
- E
- F
- G
- H
- I
- J
- K
- L
- M
- N
- O
- P
- Q
- R
- S
- T
- U
- V
- W
- X
- Y
- Z

### GroupSpecifier

- [empty]
- ? _GroupName_

### GroupName

- < _RegExpIdentifierName_ >

### RegExpIdentifierName

- _RegExpIdentifierStart_
- _RegExpIdentifierName RegExpIdentifierPart_

### RegExpIdentifierStart

- _UnicodeIDStart_
- \$
- \_
- \ _RegExpUnicodeEscapeSequence_

### RegExpIdentifierPart

- _UnicodeIDContinue_
- \$
- \ _RegExpUnicodeEscapeSequence_
- <ZWNJ>
- <ZWJ>

### RegExpUnicodeEscapeSequence

- u _LeadSurrogate_ \u _TrailSurrogate_
- u _LeadSurrogate_
- u _TrailSurrogate_
- u _NonSurrogate_
- u _Hex4Digits_
- u{ _CodePoint_ }

### LeadSurrogate

- _Hex4Digits_ but only if the SV of _Hex4Digits_ is in the inclusive range 0xD800 to 0xDBFF

### TrailSurrogate

- _Hex4Digits_ but only if the SV of _Hex4Digits_ is in the inclusive range 0xDC00 to 0xDFFF

### NonSurrogate

- _Hex4Digits_ but only if the SV of _Hex4Digits_ is not in the inclusive range 0xD800 to 0xDFFF

### IdentityEscape

- _SyntaxCharacter_
- /
- _SourceCharacter_ but not _UnicodeIDContinue_

### DecimalEscape

- _NonZeroDigit_
- _DecimalDigits_
- [lookahead ∉ _DecimalDigit_]

### CharacterClassEscape

- d
- D
- s
- S
- w
- W
- p{ _UnicodePropertyValueExpression_ }
- P{ _UnicodePropertyValueExpression_ }

### UnicodePropertyValueExpression

- _UnicodePropertyName_ = _UnicodePropertyValue_
- _LoneUnicodePropertyNameOrValue_

### UnicodePropertyName

- _UnicodePropertyNameCharacters_

### UnicodePropertyNameCharacters

- _UnicodePropertyNameCharacter_ _UnicodePropertyNameCharacters_

### UnicodePropertyValue

- _UnicodePropertyValueCharacters_

### LoneUnicodePropertyNameOrValue:

- _UnicodePropertyValueCharacters_

### UnicodePropertyValueCharacters

- _UnicodePropertyValueCharacter_ _UnicodePropertyValueCharacters_

### UnicodePropertyValueCharacter

- _UnicodePropertyNameCharacter_
- 0
- 1
- 2
- 3
- 4
- 5
- 6
- 7
- 8
- 9

### UnicodePropertyNameCharacter

- _ControlLetter_
- \_

### CharacterClass

- [ [lookahead ∉ { ^ }] _ClassRanges_ ]

### ClassRanges

- [empty]
- _NonemptyClassRanges_

### NonemptyClassRanges

- _ClassAtom_
- _ClassAtom_ _NoemptyClassRangesNoDash_
- _ClassAtom_ \- _ClassAtom_ _ClassRanges_

### NonemptyClassRangesNoDash

- _ClassAtom_
- _ClassAtomNoDash_ _NonemptyClassRangesNoDash_
- _ClassAtomNoDash_ \- _ClassAtom_ _ClassRanges_

### ClassAtom

- \-
- _ClassAtomNoDash_

### ClassAtomNoDash

- _SourceCharacter_ but not one of \ or ] or -
- \ _ClassEscape_

### ClassEscape

- b
- \-
- _CharacterClassEscape_
- _CharacterEscape_

[View More](https://www.ecma-international.org/ecma-262/10.0/index.html#sec-regexp-regular-expression-objects)
