import { useNavigate } from "react-router-dom";


export default function Signup() {

    const navigate = useNavigate();

  async function handleRegister(e) {
    try {
      e.preventDefault();
        const response = await fetch("/api/register", {
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
        } else {
            const data = await response.json();
            console.log("User successfully registered ", data);
            navigate("/registered");
        }
    } catch (err) {
      console.error("Error signing up:", err);
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleRegister}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <button type="submit">Sign Up</button>
        <p>Already have an account?</p>
        <a href="/login">Login</a>
      </form>
    </div>
  );
}
