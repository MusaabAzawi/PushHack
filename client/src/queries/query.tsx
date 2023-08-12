import{
    HOST_USERS,
    HOST_USER,
    HOST_CREATE_USER,
    HEADERS,
} from "../common/constants";


export async function listUsers() {
    try{
      return await fetch(HOST_USERS, {
        method: "GET",
        mode: "cors",
        headers: HEADERS,
      })
      .then((response) => response.json())
      .then((data) => console.log(data));
    } catch (error) {
      alert("Something went wrong")
    }
  }

  export async function loginUser(email: string) {
    try {
      const response = await fetch(HOST_USER + email, {
        method: "GET",
        mode: "cors",
        headers: HEADERS,
      })
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("User not found");
  
      } 
    } catch (error) {
      alert("User not found");
      window.location.reload();
    }
  }

// create a new user 
export async function registerUser(firstname:string, lastname: string, email: string, password: string) {

  const data = {
    first_name: firstname,
    last_name: lastname,
    email: email,
    password: password,
    channels: "test-channel",
  };

  return fetch(HOST_CREATE_USER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
