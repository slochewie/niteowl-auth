import { useState } from "react";
import { authClient } from "./auth-client";
export default function App(){
 const {data:session,isPending}=authClient.useSession();
 const [message,setMessage]=useState("");
 async function signUp(formData:FormData){const r=await authClient.signUp.email({name:String(formData.get("name")),email:String(formData.get("email")),password:String(formData.get("password"))});setMessage(r.error?.message??"Account created.");}
 async function signIn(formData:FormData){const r=await authClient.signIn.email({email:String(formData.get("email")),password:String(formData.get("password"))});setMessage(r.error?.message??"Signed in.");}
 if(isPending)return <main className="shell"><p>Loading…</p></main>;
 return <main className="shell"><section className="card"><p className="eyebrow">NiteOwl.dev</p><h1>Better Stack + Better Auth</h1>{session?<div><p>Signed in as <strong>{session.user.email}</strong></p><button onClick={()=>authClient.signOut()}>Sign out</button></div>:<div className="forms"><form action={signUp}><h2>Create account</h2><input name="name" placeholder="Name" required/><input name="email" type="email" placeholder="Email" required/><input name="password" type="password" placeholder="Password" minLength={8} required/><button type="submit">Create account</button></form><form action={signIn}><h2>Sign in</h2><input name="email" type="email" placeholder="Email" required/><input name="password" type="password" placeholder="Password" required/><button type="submit">Sign in</button></form></div>}{message&&<p>{message}</p>}</section></main>;
}
