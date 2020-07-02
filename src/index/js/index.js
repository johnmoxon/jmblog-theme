//  Import custom styles
import '../sass/base.scss';


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



  



});