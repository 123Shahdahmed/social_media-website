///////////////////////////////////////////////////////////////////show posts
let card = document.getElementById("card1");
const paseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;
let isLoading = false;

window.addEventListener("scroll", function () {
  // console.log("scroll")
  const endPage =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100;
  // const endPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

  if (endPage && currentPage < lastPage && !isLoading) {
    isLoading = true;
    currentPage += 1;
    getPosts(false, currentPage);
  }
});

function getPosts(reload = true, page = 1) {
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=10&page=${page}`)
    .then(function (response) {
      lastPage = response.data.meta.last_page;
      isLoading = false;
      // console.log(lastPage)
      let posts = response.data.data;
      console.log(posts)

      posts = posts.filter((post) => {
        const username = post.author.username;
        return username !== "naser" && username !== "naser300";
      });

      if (reload) {
        card.innerHTML = "";
      }

      for (let post of posts) {
        // console.log(post.tags)
        // console.log(response.data)
        //  let USER=post.author.username;
        //  console.log(USER)

        // if(USER=="")
        let postTitle = "";
        if (post.title != null) {
          postTitle = post.title;
        }
        let authorImage =
          "imgs/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"; // default

        if (
          post.author &&
          typeof post.author.profile_image === "string" &&
          post.author.profile_image.trim() !== ""
        ) {
          authorImage = post.author.profile_image;
        }
        let update=``;
        let Delete=``;

        let User=getUserName();
        console.log(User)
        let isAuth=User!=null&& post.author.id==User.id;
        console.log(isAuth)
        if(isAuth){
          update=`<button type="button" class="btn btn-secondary" style=" float:right" onclick="btnEditClick('${encodeURIComponent(JSON.stringify(post))}')">Edit</button> `
          Delete=`<button type="button" class="btn btn-danger" style=" float:right ;margin-right:10px" onclick="btnDeleteClick('${post.id}')">Delete</button> `
        }

         Id = post.id;
        let content = `
        <div class="card shadow mb-3" >
          <div class="card-header">
            <img src="${authorImage}" class="rounded-circle border border-3" alt="" style="width: 40px;height: 40px;" >
            <b>@${post.author.username}</b>
             ${update}
             ${Delete}
          </div >
          <div class="card-body" onclick="commentsWeb(${Id})">
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
        </div>`;

        // console.log(post.author)
        card.innerHTML += content;
        // const tagsContainer = document.getElementById(tags-${post.id});
        // console.log(tagsContainer);

        //    if (post.tags && post.tags.length > 0) {
        //   for (let tag of post.tags) {
        //      console.log( tag.name);
        //      let tagContent =
        //      <button class="btn btn-sm rounded-5" style="background-color: gray;color: #fff;">${tag.name}</button>
        
        //      tagsContainer.innerHTML +=tagContent;
        //   }
        //  }
      }
    });
}

//###################################################################################################SHOW POSTS

/////////////////////////////////////////////////////////////////////////////////////////////////////btnlogin

function btncllick() {
  const Username = document.getElementById("user-name").value.trim();
  const Password = document.getElementById("password").value.trim();

  if (!Username || !Password) {
    alert("Please enter both username and password.");
    return;
  }
  axios
    .post("https://tarmeezacademy.com/api/v1/login", {
      username: Username,
      password: Password,
    })
    .then((response) => {
      // console.log(response.data)
      // return
      const token = response.data.token;
      const user = response.data.user;
      console.log(user)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      const modal = document.getElementById("login-model");
      const modalInstanc = bootstrap.Modal.getInstance(modal);
      modalInstanc.hide();
      showAlert("loged in succefully");
      setupUi();
    })
    .catch((error) => {
      // console.error("Login failed", error);

      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      alert("Login failed: " + errorMessage);
    });
}

//###########################################################################################btnlogin####

////////////////////////////////////////////////////////////////////////////////////////////// btnregister
function registerBtnCllick() {
  const Name = document.getElementById("register-Name").value.trim();
  const Username = document.getElementById("register-user-name").value.trim();
  const Password = document.getElementById("register-password").value.trim();
  const Image = document.getElementById("register-image").files[0];

  console.log(Name, Username, Password);
  console.log(Image);
  //return
  const formData = new FormData();
  formData.append("username", Username);
  formData.append("password", Password);
  formData.append("name", Name);
  formData.append("image", Image);
  const header = {
    "Content-Type": "multipart/form-data",
  };

  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData, {
      headers: header,
    })
    .then((response) => {
      // console.log(response.data)
      const token = response.data.token;
      const user = response.data.user;
      //console.log(user)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // let savedUser = JSON.parse(localStorage.getItem("user"));
      // console.log("User after saving:", savedUser);
      const modal = document.getElementById("register-model");
      const modalInstanc = bootstrap.Modal.getInstance(modal);
      modalInstanc.hide();
      showAlert("added new user successfully");
      setupUi();
    })
    .catch((error) => {
      const modal = document.getElementById("register-model");
      const modalInstanc = bootstrap.Modal.getInstance(modal);
      modalInstanc.hide();
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}

// #########################################################################################btnregister####

// ///////////////////////////////////////////////////////////////////////////////////////////////logout
function deletedToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUi();
  showAlert("logedout successfuly");
}
// #################################################################################################logout###

/////////////////////////////////////////////////////////////////////////////////////////////////////updats btns
function setupUi() {
  const token = localStorage.getItem("token");
  const login_Div = document.getElementById("loginDiv");
  const logout_Div = document.getElementById("logoutDiv");
  const newPost = document.getElementById("addPost");
  // const user=localStorage.getItem("user")

  if (token == null) {
    if (newPost != null) {
      newPost.style.setProperty("display", "none", "important");
    }
    login_Div.style.setProperty("display", "flex", "important");
    logout_Div.style.setProperty("display", "none", "important");
  } else {
    if (newPost != null) {
      newPost.style.setProperty("display", "block", "important");
    }
    login_Div.style.setProperty("display", "none", "important");
    logout_Div.style.setProperty("display", "flex", "important");

    let user = getUserName();
    // console.log("llll"+user.profile_image)
    document.getElementById("nav-userName").innerHTML = user.username;
    //let defaultImg = "imgs/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg";
    document.getElementById("nav-image").src = user.profile_image
  }
}

//###################################################################################################updats btns###

//////////////////////////////////////////////////////////////////////////////////////////////////////  add new post
function addPost() {
  let id=document.getElementById("postIdInput").value;
  let isCreate=  id==null || id =="";
  //alert(isCreate)
  //alert(id);

  const title = document.getElementById("addTitle").value;
  const body = document.getElementById("Message").value;
  const image = document.getElementById("addImg").files[0];
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  const header = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  if(isCreate){
    axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: header,
    })
    .then((response) => {
      // console.log(response.data)
      const modal = document.getElementById("addPostBtn");
      const modalInstanc = bootstrap.Modal.getOrCreateInstance(modal);
      modalInstanc.hide();
      document.body.classList.remove("modal-open");
      let backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());

      showAlert("Added new post succefully");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });

  }
  else{
    formData.append("_method","put");
    axios
    .post(`https://tarmeezacademy.com/api/v1/posts/${id}`, formData, {
      headers: header,
    })
    .then((response) => {
      // console.log(response.data)
      const modal = document.getElementById("addPostBtn");
      const modalInstanc = bootstrap.Modal.getOrCreateInstance(modal);
      modalInstanc.hide();
      document.body.classList.remove("modal-open");
      let backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      showAlert("Updated succefully");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
  }
  
}
//################################################################################add new post###########

/////////////////////////////////////////////////////////////////////////////////////  show alert message

function showAlert(myMessage, Type = "success") {
  const alertPlaceholder = document.getElementById("Alert");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${Type} alert-dismissible fade show" role="alert">`,
    `<div>${myMessage}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);

  setTimeout(() => {
    if (wrapper) {
      wrapper.remove();
    }
  }, 1500);
}
//  ##################################################################################show alert message###

// /////////////////////////////////////////////////////////////////////////////////////show post

const Idparams = new URLSearchParams(window.location.search);
const id = Idparams.get("postId");
// console.log(id);
function commentsWeb(postId) {
  window.location = `index2.html?postId=${postId}`;
  // console.log(id)
}
getPost();

function getPost() {
  console.log(id);
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then(function (response) {
      let post = response.data.data;
      console.log(post);
      let author = post.author;
      console.log(post.comments_count);
      if (author && author.username) {
        let card2 = document.getElementById("card2");
         let authorImage =
          "imgs/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"; // default

        if (
          post.author &&
          typeof post.author.profile_image === "string" &&
          post.author.profile_image.trim() !== ""
        ) {
          authorImage = post.author.profile_image;
        }
       
        //   if (reload) {
        //   card2.innerHTML = "";
        // }
        document.getElementById("User_span").innerHTML = `@${author.username}`;
        card2.innerHTML = "";
      let tagsHtml = "";
      for (let tag of post.tags) {
        tagsHtml += `<button class="btn btn-sm rounded-5 me-1" style="background-color: gray; color: white;">${tag[0].name}</button>`;
      }
      let commentsHtml = "";
      for (let comment of post.comments) {
        commentsHtml += `
        <div style="margin:15px 0;background-color:rgb(187,187,187);border-radius:7px" class="p-3">
        <img src="${comment.author.profile_image}" alt=""no class="rounded-circle border border-3" alt="" style="width: 40px;height: 40px;"><img/>
         <b class="p-3 my-4">@${comment.author.username} :</b> <div >${comment.body}</div>
         
         </div>

         
       `;
      }
        let content = `
        <div class="post p-0" id="post">
                <h2 class="mt-4">
                    <span class="user" id="User_span">@${author.username}</span>
                </h2>
          <div class="card2 shadow mb-3 p-2">
            <div class="card-header">
              <img src="${authorImage}" class="rounded-circle border border-3" alt="" style="width: 40px;height: 40px;" >
              <b>@${author.username}</b>
            </div>
            <div class="card-body">
              <img src="${post.image}"  alt=""  style="width: 100%; height:auto; object-fit: cover; margin-top:20px">
              <p style="color: rgb(133, 130, 130);">${post.created_at}</p>
              <h4>${post.title}</h4>
              <p class="body">${post.body}</p>
              <hr>
              <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-pen"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                      />
                    </svg>
              <span>(${post.comments.length}) Comments</span>
            
              <div class="btn btn-sm rounded-5 me-1" style="background-color: gray; color: white;">${tagsHtml}
              
              
            </div>

            <div style="width:100%;marginauto;background-color:white ;hight:"100% :border-radius:10px"style="margin:15px 0;background-color:rgb(187,187,187)" class="p-3">${commentsHtml}
           <div class="input-group mb-3">
           <input type="text" placeholder="add your comment"  class="form-control" id="input-content">
           <button class="btn btn-primary" onclick="addBtnComment(${id})">Add</button></div></div>
          </div>
          </div>`;

        card2.innerHTML += content;
      }
    });
}

// #####################################################################################show post
////////////////////////////////////////////////// getUserName
function getUserName() {
  let user = null;
  let storeUserName = localStorage.getItem("user");
  if (storeUserName != null) {
    user = JSON.parse(storeUserName);
  }
  return user;
}
//############################################### getUserName

//functino adding comments-------------------

function addBtnComment(postId){
  let commentInput=document.getElementById("input-content").value
  // alert(postId)
  const token=localStorage.getItem("token");
  let url=`https://tarmeezacademy.com/api/v1/posts/${id}/comments`;
  let params={
    body:commentInput
  };
  axios.post(url,params,{
    headers:{
      "authorization":`Bearer ${token}`
    }
  }).then((response)=>{
    console.log(response.data)
    showAlert("comment added successfully", "success");
    getPost();
    getPosts();
  }).catch((error)=>{
    console.log(error)
    const errorMessage=error.response.data.message
    showAlert(errorMessage, "danger");

  })
}
//#############################add comments

// ------------------------function Edit Post
function btnEditClick(postObject){
  let post=JSON.parse(decodeURIComponent(postObject))
  //console.log(post)
  //  alert(postid)
  let Modal=new bootstrap.Modal(document.getElementById("addPostBtn"),{})
  Modal.toggle()
  document.getElementById("postIdInput").value=post.id
  document.getElementById("ModalLaber").innerHTML="Edit Post"
  document.getElementById("editBtn").innerHTML="Update";
  document.getElementById("addTitle").value=post.title;
  document.getElementById("Message").value=post.body

}

function addEventFun(){
  
  let Modal=new bootstrap.Modal(document.getElementById("addPostBtn"),{})
  Modal.toggle()
  document.getElementById("ModalLaber").innerHTML="Add New Post"
  document.getElementById("editBtn").innerHTML="Add";
  
}
// ###########################function Edit Post
// ---------------------------deletepost
function btnDeleteClick(postId) {
  selectedPostId = postId; 
  const modal = document.getElementById("Deletemodal");
  const modalInstanc = bootstrap.Modal.getOrCreateInstance(modal);
  modalInstanc.show(); 
}
document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
  const modal = document.getElementById("Deletemodal");
  const modalInstanc = bootstrap.Modal.getOrCreateInstance(modal);
  modalInstanc.hide();

  document.body.classList.remove("modal-open");
  document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());

  const token = localStorage.getItem("token");
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${selectedPostId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      showAlert("Deleted Successfully");
      getPosts();
    })
    .catch((error) => {
      let message = error.response?.data?.message || "Delete failed!";
      showAlert(message, "danger");
    });
});

// ##########################deletepos
// function deletedToken() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
//   showAlert("Logged out successfully", "success");
//   setupNavbar();
//   getPosts();
// }
window.onload = function () {
  setupUi();
  getPosts();
};
