//  Import custom styles
// import 'Assets/sass/base.scss'; // Styles need to load before JS on this site


/*
These next 2 are only required where forms exist.  
Suggest only loading on articles / contact pages
*/
// Import yup schema validator
import * as yup from 'yup';

// import the form move/snapback logic
import moveForm from './moveform';





// Enable mobile nav banner
document.addEventListener('DOMContentLoaded', () => {

  // Navigation bars
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
        const $target = document.getElementById(el.dataset.target);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
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

  /*
  COMMENTS FORMS - consider moving to non-critical
  */

  // Handle the reply links 
  const $reply_links = Array.prototype.slice.call(document.querySelectorAll('.comment__reply-link'), 0);
  if ($reply_links.length > 0) {
    $reply_links.forEach(el => {

      let commentId = el.dataset.commentId,
        respondId = el.dataset.respondId,
        postId = el.dataset.pageSlug,
        parentId = el.dataset.uid;
        
      el.addEventListener('click', () => {
        // Move the form to reply to the selected comment
        moveForm.move(commentId, respondId, postId, parentId);
      });
    });
  }

  // Handle the comments form
  const $comments = Array.prototype.slice.call(document.querySelectorAll('.comments-form'), 0);
  if ($comments.length > 0) {

    $comments.forEach( el => {

      // build and insert the notification container 
      const baseNotificationEl = document.createElement("div");
      baseNotificationEl.classList.add(
          "notification", 
          "is-light", 
          "is-size-7", 
          "is-hidden");
      baseNotificationEl.innerHTML = '<p class="messages">messages</p>';
      el.before(baseNotificationEl);
      const notificationText = baseNotificationEl.querySelector(".messages");
      // window.notificationText = notificationText;
      // window.baseNotificationEl = baseNotificationEl;

      // quick function to add a notification
      const set_notification = function (message, type) {
        notificationText.innerText = String(message);
        baseNotificationEl.classList.remove("is-hidden", "is-danger", "is-success", "is-info");
        switch (String(type)) {
          case 'error':
            baseNotificationEl.classList.add("is-danger");
            break;
          case 'success':
            baseNotificationEl.classList.add("is-success");
            break;
          case 'info':
          default:
            baseNotificationEl.classList.add("is-info");
        }
        baseNotificationEl.classList.remove("is-hidden");

        baseNotificationEl.scrollIntoView({ behavior: 'smooth' });
      }

      // quick function to reset messages
      const clear_notication = function () {
        notificationText.innerText = 'cleared';
        baseNotificationEl.classList.remove("is-danger", "is-success", "is-info");
        baseNotificationEl.classList.add("is-hidden");
      }

      // window.el = el;

      el.addEventListener('submit', function(evt){
        // halt native form submit
        evt.preventDefault();

        // Create a schema
        let schema = yup.object().shape({
          "fields[message]": yup.string()
            .required("Comment message is required"),
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

        // get the fields and build the payload
        let formFields = el.querySelectorAll('.comments-form input, .comments-form textarea');
        let commentsData = new Object();
        Array.prototype.forEach.call(formFields, function (field, i) {
          commentsData[field.name] = field.value;
        });

        // Validate the inputs and 
        schema
          .validate(commentsData)
          .then(function (valid) {
            // Clear any error messages, send the request, show spinner, clear form and show message
            clear_notication();

            // Set the button to loading
            el.querySelector('#comment-form-submit').classList.add('is-loading');

            let url = new URL(el.getAttribute('action'));

            // Prepare data
            const encodedComponents = new Array();
            for (const name in valid) {
              encodedComponents.push(encodeURIComponent(name) + "=" + encodeURIComponent(valid[name]));
            }
            const formData = encodedComponents.join("&").replace(/%20/g, '+');

            // TODO: Remove before production
            window.formData = formData;

            fetch(url, {
              method: 'post',
              body: formData,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
              
            })
            .then(function( data ) {
              // Check response
              if ( data.status == 200 ) {
                // Show success message
                set_notification("Your comment has been successfully submitted for \
                  moderation and if everything looks okay will appear on this page soon", 
                  "success");
                
                // Clear the form & reset the button
                document.querySelector('.comments-form').reset();
                el.querySelector('#comment-form-submit').classList.remove('is-loading');
                grecaptcha.reset();
              }
              else {
                // non-successful response returned
                set_notification("Oh no! there was a problem submitting your comment, \
                  it's us not you! Please refresh the page and try again", 
                  "error");
                el.querySelector('#comment-form-submit').classList.remove('is-loading');
                grecaptcha.reset();
              }
            })
            .catch(function (err) {
              // Post request failed
              set_notification("Oh no! there was a problem submitting your comment, \
                it's us not you! Please refresh the page and try again", 
                "error");
              el.querySelector('#comment-form-submit').classList.remove('is-loading');
              grecaptcha.reset();
            });
            


          })
          .catch(function (err) {
            // Validation error message
            // Show the error message and exit
            set_notification(err.message, "error");
            grecaptcha.reset();
          });
      });
    });
  }

  /*
  ARTICLE PAGES - critical on mobile article pages
  */
  // If a post page, scroll to article start
  if ( 
      document.querySelector('#main_article') && 
      document.querySelector('.navbar-burger').offsetParent !== null
    ) {
    const $scrollTarget = document.querySelector('#main_article');
    $scrollTarget.scrollIntoView();
  }

  /*
  BOOKMARK BUTTONS - non critical
  */
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