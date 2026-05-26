async function signup(){

  const name =
    document.getElementById("name").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const emprole =
    document.getElementById("emprole").value.trim();

  const password =
    document.getElementById("password").value.trim();

  const confirm =
    document.getElementById("confirm").value.trim();


  // EMPTY VALIDATION
  if(!name){

    alert("Name is required");
    return;
  }

  if(!email){

    alert("Email is required");
    return;
  }

  if(!emprole){

    alert("Employee Role is required");
    return;
  }

  if(!password){

    alert("Password is required");
    return;
  }

  if(!confirm){

    alert("Confirm Password is required");
    return;
  }


  // PASSWORD LENGTH
  if(password.length < 8){

    alert(
      "Password must be at least 8 characters"
    );

    return;
  }


  // PASSWORD MATCH
  if(password !== confirm){

    alert("Passwords do not match");

    return;
  }


  const response = await fetch(
    "http://127.0.0.1:5000/signup",
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        name,
        email,
        password,
        EmpRole:emprole
      })
    }
  );

  const data = await response.json();


  if(data.success){

    alert("Account created");

    window.location.href =
      "login.html";

  }else{

    alert(data.message);

  }

}