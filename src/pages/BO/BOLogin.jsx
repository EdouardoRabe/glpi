import {useNavigate} from "react-router-dom";
import "../../css/pages/BO/BOLogin.css";

export default function BOLogin() {
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const code = formData.get("password");
        if (code === "admin") {
            sessionStorage.setItem("isLoggedIn", "true");
            navigate("/import");
        }
    };

    return (
        <div className="bo-login">
            <h1>LOGIN</h1>
            <form className="bo-login-form" onSubmit={handleLogin}>
                <div>
                    <label htmlFor="password">Code</label>
                    <input type="text" id="password" name="password" defaultValue="admin" required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}