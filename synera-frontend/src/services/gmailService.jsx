import axios from "../api"; // your existing API helper

export const connectGmail = () => {
  // Opens OAuth in a new tab
  window.open(`${axios.defaults.baseURL}/gmail-auth/`, "_blank");
};

export const fetchGmailEmails = async () => {
  const res = await axios.get("/api/gmail-conversations/");
  return res.data.messages;
};
