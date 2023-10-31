import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./form.css";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/apiCalls/authApiCall";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        if(email.trim() === "") return toast.error("Email is required");
        if(password.trim() === "") return toast.error("Password is required");

        dispatch(loginUser({ email, password }));
    }


    return ( 
        <div className="everything"> 
        <div class="wrapper">
                 <div class="title">
                    Login
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
                       <input type="password" 
                             className="form-input"
                             id="password"
                             placeholder="Enter your password"
                             value={password}
                             onChange={(e) => setPassword(e.target.value)} />
                       <label>Password</label>
                    </div>
                    <div class="content">
                       <div class="checkbox">
                          <input type="checkbox" id="remember-me" />
                          <label for="remember-me">Remember me</label>
                       </div>
                       <div class="pass-link">
                         <Link to="/register">Register</Link>
                       </div>
                    </div>
                    <div class="field">
                       <input type="submit" value="Login" />
                    </div>
                    <div class="signup-link">
                        Did you forgot your password?<br></br> 
                        <Link to="/forgot-password">Frogot Password</Link>
                    </div>
                 </form>
              </div>
              </div>
     );
}
 
export default Login;

/*
<div className="everything"> 
<div class="wrapper">
         <div class="title">
            Login To your Account
         </div>
         <form onSubmit={formSubmitHandler}>
            <div class="field">
               <input  type="email" 
                     className="form-input"
                     id="email"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}>
               <label>Email Address</label>
            </div>

            <div class="field">
               <input type="password" 
                     className="form-input"
                     id="password"
                     placeholder="Enter your password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}>
               <label>Password</label>
            </div>
            <div class="content">
               <div class="checkbox">
                  <input type="checkbox" id="remember-me">
                  <label for="remember-me">Remember me</label>
               </div>
               <div class="pass-link">
                 <Link to="/forgot-password">Frogot Password</Link>
               </div>
            </div>
            <div class="field">
               <input type="submit" value="Login">
            </div>
            <div class="signup-link">
                Did you forgot your password ? 
                <Link to="/forgot-password">Frogot Password</Link>
            </div>
         </form>
      </div>
      </div>

    
*/