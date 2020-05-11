function parseRegex (regex) {
  let regexArray = regex.toString().split('').slice(1, -1);
  let returnString = {
    start: 'Match',
    middle: '',
    end: anchors(regexArray) || ''
  };
  let i = 0;
  let middle = [];
  while (i < regexArray.length) {
    let currentPhrase = [];
    if (regexArray[i] === '[') {
      currentPhrase.push(handleGroup(regexArray, i+1))
    }
    let quantifiers = handleQuantifiers(regexArray, i);
    if (currentPhrase.length > 0) {
      middle.push(currentPhrase.join(''))
    }
    i++
  }
  returnString.middle = middle ? middle.length > 1 ? middle.join(' followed by ') : middle : '';

  return `${returnString.start} ${returnString.middle} ${returnString.end}`
}
function handleQuantifiers(regex, index) {
  if (regex[index] === '*') {
      return ' zero or more times'
    } else if (regex[index] === '+') {
      return ' one or more times'
    } else if (regex[index] === '?') {
      return ' zero or one time'
    }
    if (regex[index] === '{') {
      if (!isNaN(regex[index + 1])) {
        if (regex[index + 2] === '}') {
          return ` ${regex[index + 1]} times`
        } else if (regex[index + 2] === ',') {
          if (regex[index + 3] === '}') {
            return ` at least ${regex[index + 1]} times`
          }
          if (!isNaN(regex[index + 3]) && regex[index + 4] === '}')
            return ` between ${regex[index + 1]} and ${regex[index + 3]} times`;

        }
      }
    }
    return '';
}
function handleGroup(regex, startingIndex) {
    let group = []
    let i = startingIndex;
    while (regex[i] !== ']') {
      group.push(regex[i]);
      i++;
    }
    let quantifiers = handleQuantifiers(regex, i+1)
    
    return`'${group.join(`' or '`)}'${quantifiers}`
}
function anchors(regex) {
  if (regex[regex.length - 1] === '$' && regex[0] === '^') {
    regex.shift();
    regex.pop();
    return `to the start and end of the line`
  } else {
    if (regex[regex.length - 1] === '$') {
      regex.pop();
      return `to the end of the line`
    }
    if (regex[0] === '^') {
      regex.shift();
      return `to the start of the line`
    }
  }
}

parseRegex(/^[what]{3,6}[123]*/)
