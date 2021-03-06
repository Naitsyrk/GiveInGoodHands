document.addEventListener("DOMContentLoaded", function() {
  /**
   * HomePage - Help section
   */
  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    /**
     * TODO: callback to page change event
     */
    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;

      console.log(page);
    }
  }
  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
        }
      });
    }
  }
  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function(e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep++;
          this.updateForm();
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */
    updateForm() {
      this.$step.innerText = this.currentStep;

      // TODO: Validation

      this.slides.forEach(slide => {
        slide.classList.remove("active");

        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;

      // TODO: get data from inputs and show them in summary
    }

    /**
     * Submit form
     *
     * TODO: validation, send data to server
     */
    submit(e) {
      this.currentStep++;
      this.updateForm();
    }
  }
  const divs = document.querySelectorAll('.step3')
  divs.forEach(function(e) {
    e.style.display = 'none'
  })
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
  const checkboxes = document.querySelectorAll("input[name=categories]");
  checkboxes.forEach(function(element) {
      element.addEventListener('change', function(e) {
        categoryId = `.cat${this.value}`
        const categories = document.querySelectorAll(categoryId)
        categories.forEach(function(category) {
            if (category.style.display === "none") {
                category.style.display="inline"
            }
            else {
                category.style.display="none"
            }
        })
        })
  })
  const finalFormButton = document.querySelector('.to-final-step')
  finalFormButton.addEventListener('click', function(e) {
    const bagsInput = document.querySelector("input[name=bags]")
    const bagsOutput = document.querySelector('.summary-bags')
    const categoriesInput = document.querySelectorAll('input[name=categories]')
    let categoriesOutput = ''
    categoriesInput.forEach(function(categoryInput) {
    if (categoryInput.checked == 1) {
    categoriesOutput += `${categoryInput.nextElementSibling.nextElementSibling.innerText}, `
    }
    })
    categoriesOutput = categoriesOutput.slice(0, -2)
    bagsOutput.innerText = `Liczba work??w: ${bagsInput.value}  Kategorie: (${categoriesOutput})`
    const institutionsName = document.querySelectorAll("input[name=organization]")
    let institutionName = ''
    institutionsName.forEach(function(institution) {
    if (institution.checked == 1) {
        institutionName = institution.value
    }
    })
    const institutionOutput = document.querySelector('.summary-institution')
    institutionOutput.innerText = ` Odbiorca: "${institutionName}"`

    const summaryAddressOutput = document.querySelector('.summary-address')
    const oldAddressUl = summaryAddressOutput.lastChild
    summaryAddressOutput.removeChild(oldAddressUl)
    let street = document.querySelector("input[name=address]")
    let city = document.querySelector("input[name=city]")
    let postCode = document.querySelector("input[name=postcode]")
    let phone = document.querySelector("input[name=phone]")
    const ulAddress = document.createElement('ul')
    liStreet = document.createElement('li')
    liStreet.innerText = street.value
    liCity = document.createElement('li')
    liCity.innerText = city.value
    liPostCode = document.createElement('li')
    liPostCode.innerText = postCode.value
    liPhone = document.createElement('li')
    liPhone.innerText = phone.value
    ulAddress.appendChild(liStreet)
    ulAddress.appendChild(liCity)
    ulAddress.appendChild(liPostCode)
    ulAddress.appendChild(liPhone)
    summaryAddressOutput.appendChild(ulAddress)

    const dateOutput = document.querySelector('.summary-date')
    const oldDateUl = dateOutput.lastChild
    dateOutput.removeChild(oldDateUl)
    let date = document.querySelector("input[name=data]")
    let time = document.querySelector("input[name=time]")
    let comment = document.querySelector("textarea[name=more_info]")
    if (comment.value == null || comment.value == "") {
        commentValue = "Brak uwag"
    }
    else {
        commentValue = comment.value
    }
    const ulDate = document.createElement('ul')
    liDate = document.createElement('li')
    liDate.innerText = date.value
    liTime = document.createElement('li')
    liTime.innerText = time.value
    liComment = document.createElement('li')
    liComment.innerText = commentValue
    ulDate.appendChild(liDate)
    ulDate.appendChild(liTime)
    ulDate.appendChild(liComment)
    dateOutput.appendChild(ulDate)
  })
  });