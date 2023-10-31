import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./form.css";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/apiCalls/authApiCall";
import swal from "sweetalert";

const Register = () => {
    const dispatch = useDispatch();
    const { registerMessage } = useSelector(state => state.auth);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        if(username.trim() === "") return toast.error("Username is required");
        if(email.trim() === "") return toast.error("Email is required");
        if(password.trim() === "") return toast.error("Password is required");

        dispatch(registerUser({ username, email, password }))
    }

    const navigate = useNavigate();
    
    //  beautiful swal
    if(registerMessage) {
        swal({
            title: registerMessage,
            icon: "success"
        }).then(isOk => {
            if(isOk) {
               navigate("/login");
            }
        })
    }


    return ( 
    <div className="everything">
    <div class="wrapper" >
        <div class="title">
           Register
        </div>
        <form onSubmit={formSubmitHandler}>
           <div class="field">
              <input  type="email" 
                    className="form-input"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
              <label>Email Address</label>
           </div>
            <div class="field">
              <input type="text" 
                    className="form-input"
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
              <label>Username</label>
           </div>
           <div class="field">
              <input type="password" 
                    className="form-input"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
              <label>Password</label>
           </div>
           <div class="content">
              <div class="checkbox">
                 <input type="checkbox" id="remember-me"/>
                 <label for="remember-me">Remember me</label>
              </div>
           </div>
           <div class="field">
              <input type="submit" value="Register"/>
           </div>
           <div class="signup-link">
               Already have an account? <Link to="/login">Login</Link>
           </div>
        </form>
     </div>
     </div>
     );
}
 
export default Register;