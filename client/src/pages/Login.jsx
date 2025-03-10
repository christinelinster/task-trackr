export default function Login({ setIsAuthenticated }) {
  async function handleLogin(e) {
    e.preventDefault();

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const username = e.target.username.value;
    const password = e.target.password.value;
    console.log(API_URL, username, password);

    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    console.log("Response received: ", response);

    if (!response) {
      console.log("did not get");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("User successfully logged in ", data);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setIsAuthenticated(true);
  }

  // const fetchWithAuth = async (url, options = {}) => {
  //   let accessToken = localStorage.getItem("accessToken");
  //   if (!accessToken) {
  //     accessToken = await refreshAccessToken();
  //   }

  //   const response = await fetch(url, {
  //     ...options,
  //     headers: {
  //       ...options.headers,
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });

  //   if (response.status === 401) {
  //     accessToken = await refreshAccessToken();
  //     return fetch(url, {
  //       ...options,
  //       headers: {
  //         ...options.headers,
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //   }

  //   return response;
  // };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
        <p>Don&apos;t have an account?</p>
        <a href="/signup">Click here to register</a>
      </form>
    </div>
  );
}
