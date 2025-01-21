
export default function Login({ setIsAuthenticated }) {

  async function handleLogin(e) {
    e.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });

    if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
    }else{
        const data = await response.json();
        console.log("User successfully logged in ", data);
        setIsAuthenticated(true);
    }
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
        <a href="/signup">Click here to Register</a>
      </form>
    </div>
  );
}
