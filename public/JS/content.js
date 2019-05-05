'use strict';
const uploads = document.getElementById('uploads');
const body = document.getElementById('main');


const showPics= () => {
  const showImages = (data) => {
    while (body.firstChild) {
      body.removeChild(body.firstChild);
    }

  };
};

//profile



const profileHTML = () =>{
  $('#main div').empty;

  const user = document.createElement('H1');
  user.innerText = 'Username';

  const description = document.createElement('H1');
  description.innerText = 'aofylbauieyrgf leuryglbiuaebrasdasfeafaefaefgc ida.fliyhaöfd';

  const profilePic = document.getElementById("profilePic");


  body.appendChild(profilePic);
  body.appendChild(user);
  body.appendChild(description);

};