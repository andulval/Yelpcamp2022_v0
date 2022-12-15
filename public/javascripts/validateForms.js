//from BOOTSTRAP
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  bsCustomFileInput.init(); //zeby input z plikami mial dodatkowa funkcje listy - w celach wyswietlania wybranych plikow (images) ktore są załączane - pakiet npm

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".validated-form");
  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    //create array from selected items
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
