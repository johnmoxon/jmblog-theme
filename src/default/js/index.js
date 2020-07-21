//  Import custom styles
import 'Assets/sass/base.scss';

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
  const $buttons = Array.prototype.slice.call(document.querySelectorAll('.button'), 0);
  if ($buttons.length > 0) {
    $buttons.forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('is-loading');
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