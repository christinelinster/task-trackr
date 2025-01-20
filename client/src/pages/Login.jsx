export default function Login() {


    return (
        <div>
            <h2>Login</h2>
            <form>
                <label>
                    Email:
                    <input type="text" name="email" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <button>Login</button>
                <p>Don&apos;t have an account?</p>
                <a href="/signup">Click here to Register</a>
            </form>
        </div>
    );

}
