//  Import custom styles
import 'Assets/sass/base.scss';

import * as yup from 'yup';

// Enable mobile nav banner
document.addEventListener('DOMContentLoaded', () => {

  // If there are any navbar burgers add a click event to each to toggle classes
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
        const $target = document.getElementById(el.dataset.target);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      })
    });
  }

  // Add loading modifiers to buttons when clicked
  // const $buttons = Array.prototype.slice.call(document.querySelectorAll('.button'), 0);
  // if ($buttons.length > 0) {
  //   $buttons.forEach(el => {
  //     el.addEventListener('click', () => {
  //       el.classList.toggle('is-loading');
  //     });
  //   });
  // }

  // Handle the comments form
  const $comments = Array.prototype.slice.call(document.querySelectorAll('.comments-form'), 0);
  if ($comments.length > 0) {
    $comments.forEach( el => {
      el.addEventListener('submit', function(evt){
        
        evt.preventDefault();

        

        // Create a schema
        let schema = yup.object().shape({
          "fields[message]": yup.string().required("Comment message is required"),
          "fields[name]": yup.string()
            .required("Name is a required field")
            .matches(/^(?:(?![×Þß÷þø])[-'`0-9a-zÀ-ÿ\s])+$/i, "Name must not contain special characters"),
          "fields[email]": yup.string()
            .email("Email must be a valid format"),
          "fields[hp]": yup.string()
            .matches(/^$/),
          "options[origin]": yup.string()
            .required()
            .url("There was a problem please refresh and try again"),
          "options[parent]": yup.string()
            .required()
            .url("There was a problem please refresh and try again"),
          "fields[replying_to_uid]": yup.string(),
          "options[slug]": yup.string()
            .required()
            .matches(/^[a-zA-Z0-9-]+$/i, "There was a problem please refresh and try again")
        });


        // get the fields
        let formFields = document.querySelectorAll('.comments-form input, .comments-form textarea');
        let commentsData = {};
        Array.prototype.forEach.call(formFields, function (field, i) {
          commentsData[field.name] = field.value;
        });

        schema
          .validate(commentsData)
          .catch(function (err) {
            // Show the error message and exit
            console.error(err.name);
            console.info(err.errors);
          })
          .then(function (valid) {
            // Clear any error messages, send the request, show spinner, clear form and show message
            let formAction = el.getAttribute('action');
            fetch(formAction, {
              method: 'post',
              body: JSON.stringify(valid)
            })
            .then(function( data) {
              alert("comment posted - check pull request");
              console.log(data);
            })
            .catch(function (err) {
              alert("bummer")
            });
          });
        
        
        // schema
        //   .validate({
        //     "fields[name]": "jimmy O`Conner",
        //     "fields[message]": 'this is a message',
        //     "fields[email]": 'john@jmoxon.net'
        //   })
        //   .catch(function (err) {
        //     // Show the error message and exit
        //     console.error(err.name);
        //     console.error(err.errors);
        //   })
        //   .then(function (valid) {
        //     // Clear any error messages, send the request, show spinner, clear form and show message
        //     console.log(valid)
        //   });


        // Check honeypot




        
        // check required fields
        // Array.prototype.slice.call($comments.querySelectorAll('.comments-field'), 0).forEach(el => {
          // console.log("Found field: " + el.getAttribute('name'))
        // });
        
        
        // Validate and sanitise inputs
        
        // construct fetch requests
        
        // clear form, reset button and display the success notification 
        
      });
    });
  }

  // If a post page, scroll to article start
  if ( 
      document.querySelector('#main_article') && 
      document.querySelector('.navbar-burger').offsetParent !== null
    ) {
    const $scrollTarget = document.querySelector('#main_article');
    $scrollTarget.scrollIntoView();
  }

  // Add handler for bookmark buttons
  const $bookmark_buttons = Array.prototype.slice.call(document.querySelectorAll('.bookmark-this'), 0);
  if ($bookmark_buttons.length > 0) {
    $bookmark_buttons.forEach(el => {
      let pageTitle = document.title;
      let pageURL = document.location;

      el.addEventListener('click', () => {
        try {
          // Internet Explorer solution
          eval("window.external.AddFa-vorite(pageURL, pageTitle)".replace(/-/g, ''));
        }
        catch (e) {
          try {
            // Mozilla Firefox solution
            window.sidebar.addPanel(pageTitle, pageURL, "");
          }
          catch (e) {
            // Opera solution
            if (typeof (opera) == "object") {
              el.rel = "sidebar";
              el.title = pageTitle;
              el.url = pageURL;
              return true;
            } else {
              // The rest browsers (i.e Chrome, Safari)
              alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
            }
          }
        }
        return false;
      });
    });
  }



  



});