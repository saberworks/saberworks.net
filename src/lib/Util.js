export const dateFormat = (iso8601Date) => {
  const date = new Date(iso8601Date);

  return date.toLocaleTimeString(undefined, {
    timeZoneName: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const wantedGameOrder = [
  "Dark Forces",
  "Jedi Knight",
  "Mysteries of the Sith",
  "Jedi Outcast",
  "Jedi Academy",
];

// Sort JK series in order of release first, then any other games in
// alphabetical order.
export function byGameOrder(a, b) {
  let aSort = wantedGameOrder.indexOf(a.label);
  let bSort = wantedGameOrder.indexOf(b.label);

  if (aSort == -1) {
    aSort += 9999;
  }

  if (bSort == -1) {
    bSort += 9999;
  }

  if (aSort == bSort) {
    return a.label < b.label ? -1 : 1;
  }

  return aSort - bSort;
}
