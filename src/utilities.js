export const q = (target) => {
  const nlToArr = (els) => Array.prototype.slice.call(els);
  const node = document.querySelector.bind(document);
  const nodeList = document.querySelectorAll.bind(document);
  const qs = (target) => node(target);
  const qsAll = (target) => nlToArr(nodeList(target));

  let els;
  els = qsAll(target);
  if (els.length <= 1) {
    els = qs(target);
  }
  return els;
}

export function setActiveDayClass(id, todayId) {
  if (id === todayId) {
    return 'active';
  }
}
