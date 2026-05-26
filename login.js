async function login(){

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value.trim();


  // EMPTY CHECK
  if(!email){

    alert("Email is required");

    return;
  }

  if(!password){

    alert("Password is required");

    return;
  }


  const response = await fetch(
    "http://127.0.0.1:5000/login",
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await response.json();


  if(data.success){

    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );

    window.location.href =
      "settings.html";

  }else{

    alert(data.message);

  }

}