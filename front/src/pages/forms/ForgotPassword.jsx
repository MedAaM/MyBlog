import { useState } from "react";
import { toast } from "react-toastify";
import "./form.css";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../redux/apiCalls/passwordApiCall";

const FrogotPassword = () => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        if(email.trim() === "") return toast.error("Email is required");

        dispatch(forgotPassword(email));
    }


    return ( 
        
        <div className="everything" style={{marginBottom:'173px', marginTop:'20px'}}> 
        <div class="wrapper" >
                 <div class="title">
                    Reset Password
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
                       <input type="submit" value="Reset" />
                    </div>
                </form>
              </div>
              </div>
     );
}
 
export default FrogotPassword;

/*
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
                       <input type="submit" value="Login" />
                    </div>
                </form>
              </div>
              </div>

 */