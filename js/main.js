///////////////////////////////////////////////////////////////////show posts
let card = document.getElementById("card1");
const paseUrl="https://tarmeezacademy.com/api/v1";
 let currentPage=1;
 let lastPage=1;
 let isLoading = false;

window.addEventListener("scroll",function(){
  
  // console.log("scroll")
  const endPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100;  
  // const endPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

  if(endPage&& currentPage < lastPage && !isLoading){
    isLoading = true;
    currentPage+=1
    getPosts(false,currentPage)
    
  }
})

function getPosts(reload=true , page=1){
  axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`)
  .then(function (response) {
    lastPage=response.data.meta.last_page;
    isLoading = false;
    // console.log(lastPage)
    let posts = response.data.data;
    // console.log(posts)

    posts = posts.filter(post => {
      const username = post.author.username;
      return username !== "naser" && username !== "naser300";
    });

    if(reload){
      card.innerHTML =""
    }
    
    for (let post of posts) {
      // console.log(post.tags)
      // console.log(response.data)
      //  let USER=post.author.username;
      //  console.log(USER)
      
      // if(USER=="")
      let postTitle=""
      if(post.title!=null){
        postTitle=post.title
      }
      let authorImage = "imgs/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"; // default

      if (post.author && typeof post.author.profile_image === "string" && post.author.profile_image.trim() !== "") {
       authorImage = post.author.profile_image;
        }

       let Id=post.author.id;
      let content = `
        <div class="card shadow mb-3" onclick="commentsWeb(${Id})">
          <div class="card-header">
            <img src="${authorImage}" class="rounded-circle border border-3" alt="" style="width: 40px;height: 40px;" >
            <b>@${post.author.username}</b>
          </div>
          <div class="card-body">
            <img src="${post.image}"  alt="" style="width: 100%; height:auto; object-fit: cover;" >
            <p style="color: rgb(133, 130, 130);">${post.created_at}</p>
            <h4>${postTitle}</h4>
            <p>${post.body}</p>
            <hr> 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
              <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
            </svg>
            <span>(${post.comments_count}) Comments
            <span id="tags-${post.id}" ><button class="btn btn-sm rounded-5" style="background-color: gray;color: #fff;">policy</button></span>
            </span>
          </div>
        </div>`
      
      // console.log(post.author)
      card.innerHTML += content;
  //     const tagsContainer = document.getElementById(tags-${post.id});
  //     console.log(tagsContainer); 

  //    if (post.tags && post.tags.length > 0) {
  //   for (let tag of post.tags) {
  //      console.log( tag.name); 
  //      let tagContent = 
  //      <button class="btn btn-sm rounded-5" style="background-color: gray;color: #fff;">${tag.name}</button>
  //      
  //      tagsContainer.innerHTML +=tagContent;
  //   }
  //  }
      
    }

  })

}

  //###################################################################################################SHOW POSTS
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////btnlogin

  function btncllick(){
    const Username=document.getElementById("user-name").value.trim();
    const Password=document.getElementById("password").value.trim();

    if (!Username || !Password) {
      alert("Please enter both username and password.");
      return;
    }
    axios.post("https://tarmeezacademy.com/api/v1/login" ,{
      username :Username ,
      password : Password
  })
  .then(response=>{
    // console.log(response.data)
    // return
    const token = response.data.token;
    const user = response.data.user;
    localStorage.setItem("token", token); 
    localStorage.setItem("user", JSON.stringify(user)); 
    const modal=document.getElementById("login-model");
    const modalInstanc=bootstrap.Modal.getInstance(modal);
    modalInstanc.hide()
    showAlert("loged in succefully");
    setupUi();

  })
  .catch(error => {
    console.error("Login failed", error);
    
    const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
    
    alert("Login failed: " + errorMessage);
  });
  
  }

  //###########################################################################################btnlogin####
  
  ////////////////////////////////////////////////////////////////////////////////////////////// btnregister
  function registerBtnCllick(){
    const Name=document.getElementById("register-Name").value.trim();
    const Username=document.getElementById("register-user-name").value.trim();
    const Password=document.getElementById("register-password").value.trim();
    const Image=document.getElementById("register-image").files[0];
    
    console.log(Name,Username,Password)
    console.log(Image)
     //return
    const formData=new FormData
    formData.append("username",Username)
    formData.append("password",Password)
    formData.append("name",Name)
    formData.append("image",Image)
    const header={
      "Content-Type":"multipart/form-data",
    }

    axios.post("https://tarmeezacademy.com/api/v1/register" ,formData,{
      headers:header
    })
  .then(response=>{
    // console.log(response.data)
    const token = response.data.token;
    const user = response.data.user;
    localStorage.setItem("token", token); 
    localStorage.setItem("user", JSON.stringify(user)); 
    const modal=document.getElementById("register-model");
    const modalInstanc=bootstrap.Modal.getInstance(modal);
    modalInstanc.hide()
    showAlert("added new user successfully");
    setupUi();

  })
  .catch(error => {
    const modal=document.getElementById("register-model");
    const modalInstanc=bootstrap.Modal.getInstance(modal);
    modalInstanc.hide()
    const message=error.response.data.message;
    showAlert(message,"danger")
    
  });

  }


  // #########################################################################################btnregister####
  
  // ///////////////////////////////////////////////////////////////////////////////////////////////logout 
  function deletedToken(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setupUi();
    showAlert("logedout successfuly")
  }
  // #################################################################################################logout###
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////updats btns
  function setupUi(){
    const token = localStorage.getItem("token");
    const login_Div=document.getElementById("loginDiv")
    const logout_Div=document.getElementById("logoutDiv")
    const newPost=document.getElementById("addPost")

    if(token==null){
        if(newPost != null){
            newPost.style.setProperty("display","none","important")
        }
      login_Div.style.setProperty("display","flex","important")
      logout_Div.style.setProperty("display","none","important")
      
    }else{ 
        if(newPost != null){
            newPost.style.setProperty("display","block","important")

        } 
      login_Div.style.setProperty("display","none","important")
      logout_Div.style.setProperty("display","flex","important")
     
      let user=getUserName();
      document.getElementById("nav-userName").innerHTML=user.username;
      document.getElementById("nav-image").src=user.profile_image

    }

  }
  
  
   //###################################################################################################updats btns###


  //////////////////////////////////////////////////////////////////////////////////////////////////////  add new post
  function addPost(){
    const title=document.getElementById("addTitle").value;
    const body=document.getElementById("Message").value;
    const image=document.getElementById("addImg").files[0];
    const token =localStorage.getItem("token")
      const formData =new FormData;
      formData.append("title",title)
      formData.append("body",body)
      formData.append("image",image)
      
      const header={
        "Content-Type":"multipart/form-data",
        "authorization":`Bearer ${token}`
      }
    axios.post("https://tarmeezacademy.com/api/v1/posts" ,formData
      ,{
        headers:header
      }
  )
  .then(response=>{
    // console.log(response.data)
    const modal=document.getElementById("addPostBtn");
    const modalInstanc=bootstrap.Modal.getInstance(modal);
    modalInstanc.hide();
    showAlert("Added new post succefully");
    getPosts();

  })
  .catch(error => {
    const message=error.response.data.message;
    showAlert(message,"danger")
    
    
  });
  }
  //################################################################################add new post###########


  /////////////////////////////////////////////////////////////////////////////////////  show alert message

  function showAlert(myMessage, Type = "success") {
    const alertPlaceholder = document.getElementById('Alert');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-${Type} alert-dismissible fade show" role="alert">`,
      `<div>${myMessage}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('');
  
    alertPlaceholder.append(wrapper);
  
    setTimeout(() => {
      if (wrapper) {
        wrapper.remove();
      }
    }, 1500);
  }
//  ##################################################################################show alert message###

// /////////////////////////////////////////////////////////////////////////////////////show post
let card2=document.getElementById("card2")
const Idparams=new URLSearchParams(window.location.search)
const id=Idparams.get("postId");
// console.log(id);
function commentsWeb(postId){
    window.location=`index2.html?postId=${postId}`
    // console.log(id)
    
}
getPost()

function getPost(){
    console.log(id)
    axios.get(`${paseUrl}/posts/${id}`)
    .then(function (response) {
        console.log(response.data) 
       
        let post =response.data.data
        let author =post.author
        if(author.username!=null){
            console.log(author.username)
            document.getElementById("User_span").innerHTML=author.username;
        }
       
        



    })
  
  }


// #####################################################################################show post
////////////////////////////////////////////////// getUserName
function getUserName(){
  let user=null;
  let storeUserName=localStorage.getItem("user")
  if(storeUserName!=null){
    user=JSON.parse(storeUserName);
  }
  return user;
}
//############################################### getUserName
window.onload = function() {
  setupUi();
  getPosts();
  
}

