const changeType = (component, type) => {
  const active = document.querySelector(".activeM");
  active.classList.remove("activeM");
  component.classList.add("activeM");
};
