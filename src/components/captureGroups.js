function extractCaptures(string) {
  let captureRegex = /(?<non_capture_group>\(\?:.+?\))|(?<named_capture_group>\(\?<(?<name>.+?)>.+?\))|(?<capture_group>\([^\?].*?\))/g;

  let regular_expression = {};
  let capture_group = [],
    non_capture_group = [],
    named_capture_group = [];

  const group = [...string.matchAll(captureRegex)].forEach((regex) => {
    let key = regex.groups.capture_group
      ? "capture_group"
      : regex.groups.non_capture_group
      ? "non_capture_group"
      : regex.groups.named_capture_group
      ? "named_capture_group"
      : "";

    const { groups } = regex;
    const startingIndex = regex.index;
    const endingIndex = startingIndex + groups[key].length;

    switch (key) {
      case "capture_group":
        regular_expression[startingIndex] = {
          "capture group": {
            startingIndex,
            endingIndex,
            group: regex.groups.capture_group.slice(1, -1),
          },
        };
        break;
      case "non_capture_group":
        regular_expression[startingIndex] = {
          "non-capture group": {
            startingIndex,
            endingIndex,
            group: regex.groups.non_capture_group.slice(3, -1),
          },
        };
        break;
      case "named_capture_group":
        regular_expression[startingIndex] = {
          "named capture group": {
            startingIndex,
            endingIndex,
            name: regex.groups.name,
            group: regex.groups.named_capture_group.slice(
              regex.groups.name.length + 4,
              -1
            ),
          },
        };
        break;
      default:
        break;
    }
  });
  return regular_expression;
}

module.exports = { extractCaptures };
