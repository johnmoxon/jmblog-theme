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

        baseNotificationEl.scrollIntoView();
      }

      // quick function to reset messages
      const clear_notication = function () {
        notificationText.innerText = 'cleared';
        baseNotificationEl.classList.remove("is-danger", "is-success", "is-info");
        baseNotificationEl.classList.add("is-hidden");
      }

      // window.set_notification = set_notification;
      // window.clear_notication = clear_notication;
      window.el = el;

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
        let commentsData = {};
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

            let reCaptchaSiteKey = el.querySelector('input[name="options[reCaptcha][siteKey]"]').value;
            
            // grecaptcha.ready(function () {
            //   grecaptcha.execute(reCaptchaSiteKey, { action: 'submit' }).then(function (token) {
            //     // Add your logic to submit to your backend server here.
            //   });
            // });

            let url = new URL(el.getAttribute('action'));
            url.search = new URLSearchParams(valid).toString();



            // jQuery test
            console.warn('jQuery test');
            let $form = $('.comments-form');



            $.ajax({
              type: $form.attr('method'),
              url:  $form.attr('action'),
              data: $form.serialize(),
              contentType: 'application/x-www-form-urlencoded',
              success: function (data) {
                // set_notification('Comment submitted Thanks! Your comment is, It will appear when approved.', 'success');
                console.log("SUBMITTED");

                // $("#comment-form-submit")
                //   .html("Submit");

                // $form[0].reset();
                // $(form).removeClass('disabled');
                grecaptcha.reset();
                console.dir(data);
              },
              error: function (err) {
                console.log(err);
                var ecode = (err.responseJSON || {}).errorCode || "unknown";
                console.log("ERROR occurred " + ecode)
                // showModal('Error', 'An error occured.<br>[' + ecode + ']');
                // $("#comment-form-submit").html("Submit")
                // $(form).removeClass('disabled');
                grecaptcha.reset();
              }
            });


            /*
            fetch(url, {
              method: 'post',
              data: JSON.stringify({
                "options[reCaptcha][siteKey]": "6LcSejMaAAAAALJHPL1cBtbVsrfmSamJRYvT6smz", 
                "options[reCaptcha][secret]": "LVgwIjs00gp9SsSa3zMMCIajEEpPSGFtrYHpvZLBMdpagIQ3eAytPiYqXii18uxrwdc7PMfI/tTpOlkREPQ4kyeb6QaofkAiu+8gUxOpBdEqig+Q65Z6vrhQyJCiO6aOTytZvbpbQziVhAnbTt4P5Rnh/fKGegRDlzonw02HgTY=" 
                })
            })
            .then(function( data ) {
              console.log('sending request');
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
            */


          })
          .catch(function (err) {
            // Validation error message
            // Show the error message and exit
            console.warn('Yup validation error');
            set_notification(err.message, "error");
            grecaptcha.reset();
          });
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