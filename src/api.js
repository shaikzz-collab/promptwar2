// src/api.js
const API_BASE = "";  // 👈 EMPTY ON PURPOSE
export default API_BASE;
const request = async (endpoint, options = {}) => {
  const res = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON, got: ${text.slice(0, 100)}`);
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
};

// APIs
export const getElections = () => request("/api/elections");
export const loginUser = (body) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const registerUser = (body) =>
  request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });