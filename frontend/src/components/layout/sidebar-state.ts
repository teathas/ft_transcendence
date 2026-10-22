export const SIDEBAR_KEY = "sidebar";

/** Copies the saved choice onto <html> before anything is drawn. */
export const SIDEBAR_SCRIPT = `try{if(localStorage.getItem("${SIDEBAR_KEY}")==="collapsed")document.documentElement.dataset.sidebar="collapsed"}catch(e){}`;
