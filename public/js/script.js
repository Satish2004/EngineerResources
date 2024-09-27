// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()



$(".slider-container").slick({
  autoplay: true, // Do we want it to autoplay? true or false
  centerMode: true,
  autoplaySpeed: 0, // How long between each slide when autoplaying
  speed: 1000, // How fast is the transition
  arrows: true, // Do you want to show arrows to trigger each slide
  accessibility: true, // Enables tabbing and arrow key navigation
  // dots: true,            // Enables the dots below to show how many slides
  fade: false, // Changes the animate from slide to fade if true
  infinite: true, // When true, means that it will scroll in a circle
  pauseOnHover: true, // When true means the autoplay pauses when hovering
  pauseOnDotsHover: true, // Pauses the autoplay when hovering over the dots
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});

