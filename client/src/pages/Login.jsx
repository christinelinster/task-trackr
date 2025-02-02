
export default function Login({ setIsAuthenticated }) {

  async function handleLogin(e) {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
    }else{
        const data = await response.json();
        console.log("User successfully logged in ", data);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setIsAuthenticated(true);
    }
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
        <a href="/signup">Click here to Register</a>
      </form>
    </div>
  );
}
