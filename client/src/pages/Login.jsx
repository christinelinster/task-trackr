export default function Login({ setIsAuthenticated}) {

  async function handleLogin(e) {
    e.preventDefault();

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const username = e.target.username.value;
    const password = e.target.password.value;

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
