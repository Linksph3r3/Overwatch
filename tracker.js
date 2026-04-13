(function () {
  const API_URL = "http://localhost:3000/track";

  function getVisitorId() {
    let id = localStorage.getItem("visitor_id");
    if (!id) {
      id = "v_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("visitor_id", id);
    }
    return id;
  }

  const visitorId = getVisitorId();

  function sendEvent(type, data = {}) {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type,
        visitorId,
        url: window.location.pathname,
        timestamp: Date.now(),
        ...data
      })
    });
  }

  // Page visit
  sendEvent("pageview");

  // Click tracking
  document.addEventListener("click", (e) => {
    const target = e.target;
    sendEvent("click", {
      tag: target.tagName,
      text: target.innerText,
      id: target.id
    });
  });

  // Scroll tracking
  let scrollTracked = false;
  window.addEventListener("scroll", () => {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
    if (scrollPercent > 0.5 && !scrollTracked) {
      sendEvent("scroll", { depth: "50%" });
      scrollTracked = true;
    }
  });

})();
