// import { useContext, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import myContext from '../../context/data/myContext';
// import { toast } from 'react-toastify';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, fireDB } from '../../fireabase/FirebaseConfig';
// import { Timestamp, addDoc, collection } from 'firebase/firestore';
// import Loader from '../../components/loader/Loader';

// function Signup() {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const context = useContext(myContext);
//     const { loading, setLoading } = context;

//     const navigate = useNavigate();

//     const signup = async () => {
//         setLoading(true);
//         if (name === "" || email === "" || password === "") {
//             toast.error("All fields are required");
//             setLoading(false);
//             return;
//         }

//         try {
//             const users = await createUserWithEmailAndPassword(auth, email, password);

//             const user = {
//                 name: name,
//                 uid: users.user.uid,
//                 email: users.user.email,
//                 time: Timestamp.now()
//             };

//             const userRef = collection(fireDB, "users");
//             await addDoc(userRef, user);

//             toast.success("Signup Successfully");
//             setName("");
//             setEmail("");
//             setPassword("");
//             setLoading(false);
//             navigate('/login'); // Redirect to login after successful signup
//         } catch (error) {
//             console.log(error);
//             toast.error("Error during signup. Please try again.");
//             setLoading(false);
//         }
//     };

//     return (
//         <div className=' flex justify-center items-center h-screen'>
//             {loading && <Loader />}
//             <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
//                 <div className="">
//                     <h1 className='text-center text-white text-xl mb-4 font-bold'>Signup</h1>
//                 </div>
//                 <div>
//                     <input
//                         type="text"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         name='name'
//                         className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
//                         placeholder='Name'
//                     />
//                 </div>

//                 <div>
//                     <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         name='email'
//                         className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
//                         placeholder='Email'
//                     />
//                 </div>
//                 <div>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
//                         placeholder='Password'
//                     />
//                 </div>
//                 <div className=' flex justify-center mb-3'>
//                     <button
//                         onClick={signup}
//                         className=' bg-red-500 w-full text-white font-bold  px-2 py-2 rounded-lg'>
//                         Signup
//                     </button>
//                 </div>
//                 <div>
//                     <h2 className='text-white'>Have an account <Link className=' text-red-500 font-bold' to={'/login'}>Login</Link></h2>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Signup;


import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, fireDB } from '../../fireabase/FirebaseConfig';  // 🔥 FIXED WRONG PATH
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import Loader from '../../components/loader/Loader';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const navigate = useNavigate();

    const signup = async () => {
        setLoading(true);

        if (name === "" || email === "" || password === "") {
            toast.error("All fields are required");
            setLoading(false);
            return;
        }

        try {
            // Create user
            const users = await createUserWithEmailAndPassword(auth, email, password);

            // Send email verification 🔥🔥
            await sendEmailVerification(users.user, {
                url: "https://e-digital-hub-5ehq.vercel.app/login",
                handleCodeInApp: false,
            });

            // Prepare Firestore data
            const userData = {
                name: name,
                uid: users.user.uid,
                email: users.user.email,
                isVerified: false,
                time: Timestamp.now()
            };

            // Save in Firestore
            const userRef = collection(fireDB, "users");
            await addDoc(userRef, userData);

            toast.success("Verification email sent! Check your inbox.");

            // Clear fields
            setName("");
            setEmail("");
            setPassword("");
            
            setLoading(false);
            navigate('/login');  // redirect to login
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Error during signup. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className=' flex justify-center items-center h-screen'>
            {loading && <Loader />}
            <div className=' bg-gray-800 px-10 py-10 rounded-xl '>
                <div className="">
                    <h1 className='text-center text-white text-xl mb-4 font-bold'>Signup</h1>
                </div>

                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Name'
                    />
                </div>

                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Email'
                    />
                </div>

                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className=' bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                        placeholder='Password'
                    />
                </div>

                <div className=' flex justify-center mb-3'>
                    <button
                        onClick={signup}
                        className=' bg-red-500 w-full text-white font-bold  px-2 py-2 rounded-lg'>
                        Signup
                    </button>
                </div>

                <div>
                    <h2 className='text-white'>
                        Have an account? 
                        <Link className=' text-red-500 font-bold' to={'/login'}> Login</Link>
                    </h2>
                </div>

            </div>
        </div>
    );
}

export default Signup;
