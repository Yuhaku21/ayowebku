  const sidebar = document.getElementById("mobileSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const openBtn = document.getElementById("openSidebar");
  const closeBtn = document.getElementById("closeSidebar");

  openBtn.onclick = () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  };

  closeBtn.onclick = () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  };

  overlay.onclick = () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  };