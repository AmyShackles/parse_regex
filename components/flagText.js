const flagOptions = {
  i: "case-insensitive",
  g: "global",
  m: "multiline",
  y: "sticky",
  u: "unicode",
  s: "dotall (allowing '.' to match newlines)",
};

function getFlagText(flags) {
  if (!flags || flags.length === 0) {
    return "";
  }
  if (flags.length === 1) {
    return ` using ${flagOptions[flags]} search`;
  } else {
    let flagString = [];
    for (let i = 0; i < flags.length; i++) {
      flagString.push(flagOptions[flags[i]]);
    }
    if (flagString.length === 2) {
      return ` using ${flagString.join(" and ")} search`;
    } else {
      let beforeComma = flagString.slice(0, -1);
      return ` using ${beforeComma.join(", ")}, and ${
        flagString[flagString.length - 1]
      } search`;
    }
  }
}

module.exports = { getFlagText };
